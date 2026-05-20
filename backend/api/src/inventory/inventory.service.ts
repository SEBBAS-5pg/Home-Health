import { Injectable, NotFoundException } from '@nestjs/common';
import { AuditAction, MovementType, Prisma } from '@prisma/client';
import { StockInsuficienteException } from '../common/exceptions/domain.exceptions';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMovementDto } from './dto/create-movement.dto';

// Umbral para disparar la notificación de stock bajo.
const LOW_STOCK_THRESHOLD = 5;

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  list(productId?: string) {
    return this.prisma.inventoryMovement.findMany({
      where: productId ? { productId } : undefined,
      orderBy: { createdAt: 'desc' },
      include: { product: { select: { id: true, name: true, sku: true } } },
      take: 200,
    });
  }

  // Núcleo del módulo: toda modificación de stock pasa por aquí.
  // - Transacción atómica con bloqueo pesimista (SELECT ... FOR UPDATE).
  // - Si es Salida y el stock no alcanza, abortamos antes de tocar nada.
  // - Si el stock resultante cae bajo el umbral, dejamos una notificación
  //   para los admins (la insertamos en la misma transacción).
  async registerMovement(dto: CreateMovementDto, actorId: string) {
    return this.prisma.$transaction(async (tx) => {
      // Bloqueo pesimista — evita race conditions en concurrencia.
      const [product] = await tx.$queryRaw<Array<{ id: string; name: string; stock: number }>>`
        SELECT id, name, stock FROM products WHERE id = ${dto.productId}::uuid FOR UPDATE
      `;
      if (!product) throw new NotFoundException('Producto no encontrado');

      const delta = dto.movementType === MovementType.ENTRY ? dto.quantity : -dto.quantity;
      const newStock = product.stock + delta;
      if (newStock < 0) {
        throw new StockInsuficienteException(product.name, product.stock);
      }

      // Actualiza stock del producto.
      await tx.product.update({
        where: { id: product.id },
        data: { stock: newStock },
      });

      // Registra el movimiento.
      const movement = await tx.inventoryMovement.create({
        data: {
          productId: product.id,
          movementType: dto.movementType,
          quantity: dto.quantity,
          resultingStock: newStock,
          observation: dto.observation,
        },
      });

      // Audit log.
      await tx.auditLog.create({
        data: {
          userId: actorId,
          action: AuditAction.UPDATE,
          entity: 'Product',
          entityId: product.id,
          beforeData: { stock: product.stock },
          afterData: { stock: newStock, movementId: movement.id },
        },
      });

      // Si el stock resultante es bajo, notificamos a los admins.
      if (newStock <= LOW_STOCK_THRESHOLD) {
        await this.notifyLowStock(tx, product.id, product.name, newStock);
      }

      return movement;
    });
  }

  private async notifyLowStock(
    tx: Prisma.TransactionClient,
    productId: string,
    name: string,
    stock: number,
  ) {
    const admins = await tx.user.findMany({ where: { role: 'ADMIN' }, select: { id: true } });
    if (admins.length === 0) return;
    await tx.notification.createMany({
      data: admins.map((a) => ({
        userId: a.id,
        type: 'LOW_STOCK' as const,
        title: 'Stock bajo',
        message: `${name} tiene ${stock} unidades disponibles.`,
        relatedProductId: productId,
      })),
    });
  }
}
