import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import {
  AuditAction,
  MovementType,
  Notification,
  OrderStatus,
  Prisma,
  Role,
} from '@prisma/client';
import {
  InvalidStateTransitionException,
  ProductExpiredException,
  StockInsuficienteException,
} from '../common/exceptions/domain.exceptions';
import { PrismaService } from '../prisma/prisma.service';
import { ChangeStatusDto } from './dto/change-status.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStateMachine } from './order-state-machine';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  // Listado para admin: ve todo.
  // Listado para cliente: ve solo lo suyo.
  list(actor: { id: string; role: Role }, status?: OrderStatus) {
    const where: Prisma.OrderWhereInput = {};
    if (status) where.status = status;
    if (actor.role !== Role.ADMIN) where.customerId = actor.id;

    return this.prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        items: { include: { product: { select: { name: true, sku: true } } } },
        customer: { select: { id: true, fullName: true, email: true } },
        history: { orderBy: { changedAt: 'asc' } },
      },
    });
  }

  async findOne(id: string, actor: { id: string; role: Role }) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
        customer: { select: { id: true, fullName: true, email: true, phone: true } },
        history: { orderBy: { changedAt: 'asc' } },
      },
    });
    if (!order) throw new NotFoundException('Pedido no encontrado');
    if (actor.role !== Role.ADMIN && order.customerId !== actor.id) {
      throw new ForbiddenException('No tienes acceso a este pedido');
    }
    return order;
  }

  // Crea el pedido en una transacción.
  // Valida stock y vencimiento de cada producto, calcula el total
  // y registra el AuditLog + Notification de "Nuevo pedido" para los admins.
  async create(dto: CreateOrderDto, customerId: string) {
    return this.prisma.$transaction(async (tx) => {
      const productIds = dto.items.map((i) => i.productId);
      const products = await tx.product.findMany({ where: { id: { in: productIds } } });
      if (products.length !== dto.items.length) {
        throw new NotFoundException('Algún producto del pedido no existe');
      }

      let total = new Prisma.Decimal(0);
      const itemsData: Prisma.OrderItemCreateManyOrderInput[] = [];
      const today = new Date();

      for (const it of dto.items) {
        const product = products.find((p) => p.id === it.productId)!;
        if (product.expirationDate && product.expirationDate < today) {
          throw new ProductExpiredException(product.name);
        }
        if (product.stock < it.quantity) {
          throw new StockInsuficienteException(product.name, product.stock);
        }
        const subtotal = new Prisma.Decimal(product.price).mul(it.quantity);
        total = total.add(subtotal);
        itemsData.push({
          productId: product.id,
          quantity: it.quantity,
          unitPrice: product.price,
        });
      }

      // Número de pedido tipo PED-00128.
      // Reemplazamos el enfoque por contador no atómico (count) por una
      // secuencia en la BD (`order_number_seq`) para evitar duplicados bajo
      // concurrencia. Si la secuencia no existe, hacemos fallback al count().
      let seqVal: number | null = null;
      try {
        const res = await tx.$queryRaw<Array<{ v: string }>>`
          SELECT nextval('order_number_seq') as v
        `;
        if (res && res[0] && res[0].v) {
          seqVal = parseInt(String(res[0].v), 10);
        }
      } catch (e) {
        // Si la secuencia no existe o hay error, caeremos al método legacy.
        seqVal = null;
      }

      if (seqVal === null) {
        const count = await tx.order.count();
        seqVal = count + 129;
      }

      const number = `PED-${String(seqVal).padStart(5, '0')}`;

      const order = await tx.order.create({
        data: {
          number,
          customerId,
          deliveryAddress: dto.deliveryAddress,
          total,
          status: OrderStatus.PENDING,
          items: { createMany: { data: itemsData } },
          history: { create: { toStatus: OrderStatus.PENDING, changedBy: customerId } },
        },
        include: { items: true },
      });

      await tx.auditLog.create({
        data: {
          userId: customerId,
          action: AuditAction.CREATE,
          entity: 'Order',
          entityId: order.id,
          afterData: { number, total: total.toString() },
        },
      });

      // Notificar a admins.
      await this.notifyAdmins(tx, {
        type: 'NEW_ORDER',
        title: 'Nuevo pedido',
        message: `${number} por ${total.toString()}`,
        relatedOrderId: order.id,
      });

      return order;
    });
  }

  // Cambia el estado siguiendo la state machine. Si la transición implica
  // pasar de PENDING → PREPARING, descontamos el stock en la misma transacción.
  async changeStatus(id: string, dto: ChangeStatusDto, actor: { id: string; role: Role }) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { id }, include: { items: true } });
      if (!order) throw new NotFoundException('Pedido no encontrado');

      // El cliente solo puede cancelar pedidos suyos en estado Pendiente.
      const isClientCancellingOwn =
        actor.role === Role.CLIENT &&
        order.customerId === actor.id &&
        order.status === OrderStatus.PENDING &&
        dto.status === OrderStatus.CANCELLED;

      const isAdminTransition = actor.role === Role.ADMIN;

      if (!isClientCancellingOwn && !isAdminTransition) {
        throw new ForbiddenException('No puedes realizar este cambio');
      }

      if (!OrderStateMachine.canTransition(order.status, dto.status)) {
        throw new InvalidStateTransitionException(order.status, dto.status);
      }

      // Si pasa de PENDING → PREPARING, descontamos stock.
      if (order.status === OrderStatus.PENDING && dto.status === OrderStatus.PREPARING) {
        for (const it of order.items) {
          const [p] = await tx.$queryRaw<Array<{ id: string; name: string; stock: number }>>`
            SELECT id, name, stock FROM products WHERE id = ${it.productId}::uuid FOR UPDATE
          `;
          if (p.stock < it.quantity) {
            throw new StockInsuficienteException(p.name, p.stock);
          }
          const newStock = p.stock - it.quantity;
          await tx.product.update({ where: { id: p.id }, data: { stock: newStock } });
          await tx.inventoryMovement.create({
            data: {
              productId: p.id,
              movementType: MovementType.EXIT,
              quantity: it.quantity,
              resultingStock: newStock,
              observation: `Salida automática por pedido ${order.number}`,
            },
          });
        }
      }

      const updated = await tx.order.update({
        where: { id: order.id },
        data: {
          status: dto.status,
          history: {
            create: {
              fromStatus: order.status,
              toStatus: dto.status,
              changedBy: actor.id,
              reason: dto.reason,
            },
          },
        },
        include: {
          items: { include: { product: true } },
          history: { orderBy: { changedAt: 'asc' } },
          customer: { select: { id: true, fullName: true, email: true, phone: true } },
        },
      });

      await tx.auditLog.create({
        data: {
          userId: actor.id,
          action: AuditAction.STATE_CHANGE,
          entity: 'Order',
          entityId: order.id,
          beforeData: { status: order.status },
          afterData: { status: dto.status, reason: dto.reason },
        },
      });

      // Notificación al cliente cuando la orden avanza.
      if (order.customerId !== actor.id) {
        await tx.notification.create({
          data: {
            userId: order.customerId,
            type: 'STATE_CHANGE',
            title: `Pedido ${order.number}`,
            message: `Estado actualizado: ${dto.status}`,
            relatedOrderId: order.id,
          },
        });
      }

      return updated;
    });
  }

  private notifyAdmins(
    tx: Prisma.TransactionClient,
    payload: Pick<Notification, 'type' | 'title' | 'message' | 'relatedOrderId'>,
  ) {
    return tx.user.findMany({ where: { role: Role.ADMIN }, select: { id: true } }).then((admins) =>
      admins.length
        ? tx.notification.createMany({
            data: admins.map((a) => ({ ...payload, userId: a.id })),
          })
        : null,
    );
  }
}
