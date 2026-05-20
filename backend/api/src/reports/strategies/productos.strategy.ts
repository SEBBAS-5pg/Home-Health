import { PrismaService } from '../../prisma/prisma.service';
import { ReportFilters, ReportStrategy } from './report-strategy.interface';

// Top productos más vendidos en el periodo.
export const productosStrategy: ReportStrategy = {
  type: 'productos',
  columns: [
    { key: 'sku', header: 'SKU' },
    { key: 'name', header: 'Producto' },
    { key: 'unitsSold', header: 'Unidades vendidas' },
    { key: 'income', header: 'Ingresos' },
  ],

  async generate(prisma: PrismaService, filters: ReportFilters) {
    // Agregación con groupBy de Prisma.
    const grouped = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      where: {
        order: {
          status: { in: ['DELIVERED', 'ON_THE_WAY'] },
          ...(filters.from && { createdAt: { gte: filters.from } }),
          ...(filters.to && { createdAt: { lte: filters.to } }),
        },
      },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 50,
    });

    if (grouped.length === 0) return [];

    const products = await prisma.product.findMany({
      where: { id: { in: grouped.map((g) => g.productId) } },
    });
    const byId = new Map(products.map((p) => [p.id, p]));

    return grouped.map((g) => {
      const p = byId.get(g.productId)!;
      const units = g._sum.quantity ?? 0;
      return {
        sku: p.sku,
        name: p.name,
        unitsSold: units,
        income: (Number(p.price) * units).toFixed(2),
      };
    });
  },
};
