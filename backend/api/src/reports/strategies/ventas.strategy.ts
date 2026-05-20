import { OrderStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { ReportFilters, ReportStrategy } from './report-strategy.interface';

// Reporte de ventas agrupado por día.
export const ventasStrategy: ReportStrategy = {
  type: 'ventas',
  columns: [
    { key: 'date', header: 'Fecha' },
    { key: 'orders', header: 'Pedidos' },
    { key: 'income', header: 'Ingresos' },
    { key: 'avgTicket', header: 'Ticket promedio' },
  ],

  async generate(prisma: PrismaService, filters: ReportFilters) {
    const orders = await prisma.order.findMany({
      where: {
        status: { in: [OrderStatus.DELIVERED, OrderStatus.ON_THE_WAY] },
        ...(filters.from && { createdAt: { gte: filters.from } }),
        ...(filters.to && { createdAt: { lte: filters.to } }),
      },
      select: { createdAt: true, total: true },
    });

    const grouped = new Map<string, { count: number; sum: number }>();
    for (const o of orders) {
      const key = o.createdAt.toISOString().slice(0, 10);
      const acc = grouped.get(key) ?? { count: 0, sum: 0 };
      acc.count += 1;
      acc.sum += Number(o.total);
      grouped.set(key, acc);
    }

    return Array.from(grouped.entries())
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, v]) => ({
        date,
        orders: v.count,
        income: v.sum.toFixed(2),
        avgTicket: (v.sum / v.count).toFixed(2),
      }));
  },
};
