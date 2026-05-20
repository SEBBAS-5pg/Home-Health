import { Injectable } from '@nestjs/common';
import { NotificationType, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

// Umbral de stock bajo. Si se cambia, también ajustar InventoryService.
const LOW_STOCK_THRESHOLD = 5;
// Días para considerar un producto "próximo a vencer".
const EXPIRY_WARNING_DAYS = 30;

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  // Recorre productos en estado crítico (stock bajo, próximos a vencer, vencidos)
  // y crea notificaciones para los admins si todavía no existe una equivalente.
  //
  // Es idempotente: no genera duplicados gracias a la búsqueda previa.
  // Pensado para llamarse cuando el admin entra al centro de notificaciones.
  async syncForAdmins(): Promise<{ created: number }> {
    const admins = await this.prisma.user.findMany({
      where: { role: Role.ADMIN, isActive: true },
      select: { id: true },
    });
    if (admins.length === 0) return { created: 0 };

    const today = new Date();
    const warnDate = new Date();
    warnDate.setDate(today.getDate() + EXPIRY_WARNING_DAYS);

    const [lowStock, expiring] = await Promise.all([
      this.prisma.product.findMany({
        where: { stock: { gt: 0, lte: LOW_STOCK_THRESHOLD } },
        select: { id: true, name: true, stock: true },
      }),
      this.prisma.product.findMany({
        where: { expirationDate: { not: null, lte: warnDate } },
        select: { id: true, name: true, expirationDate: true },
      }),
    ]);

    let created = 0;
    for (const admin of admins) {
      created += await this.upsertNotifs(
        admin.id,
        NotificationType.LOW_STOCK,
        lowStock.map((p) => ({
          productId: p.id,
          title: 'Stock bajo',
          message: `${p.name} tiene ${p.stock} unidades disponibles.`,
        })),
      );
      created += await this.upsertNotifs(
        admin.id,
        NotificationType.EXPIRATION,
        expiring.map((p) => {
          const daysLeft = Math.ceil(
            (p.expirationDate!.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
          );
          const msg =
            daysLeft < 0
              ? `${p.name} venció hace ${Math.abs(daysLeft)} días.`
              : `${p.name} vence en ${daysLeft} días.`;
          return {
            productId: p.id,
            title: daysLeft < 0 ? 'Producto vencido' : 'Producto por vencer',
            message: msg,
          };
        }),
      );
    }

    return { created };
  }

  // Inserta notificaciones evitando duplicados (mismo user + type + producto).
  private async upsertNotifs(
    userId: string,
    type: NotificationType,
    items: { productId: string; title: string; message: string }[],
  ): Promise<number> {
    if (items.length === 0) return 0;
    // Una sola query para los duplicados existentes.
    const existing = await this.prisma.notification.findMany({
      where: {
        userId,
        type,
        relatedProductId: { in: items.map((i) => i.productId) },
      },
      select: { relatedProductId: true },
    });
    const seen = new Set(existing.map((e) => e.relatedProductId));
    const toCreate = items.filter((i) => !seen.has(i.productId));
    if (toCreate.length === 0) return 0;
    const r = await this.prisma.notification.createMany({
      data: toCreate.map((i) => ({
        userId,
        type,
        title: i.title,
        message: i.message,
        relatedProductId: i.productId,
      })),
    });
    return r.count;
  }
}
