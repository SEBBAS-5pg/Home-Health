import { PrismaService } from '../../prisma/prisma.service';
import { ReportStrategy } from './report-strategy.interface';

// Reporte de inventario actual: lista cada producto con stock y categoría.
export const inventarioStrategy: ReportStrategy = {
  type: 'inventario',
  columns: [
    { key: 'sku', header: 'SKU' },
    { key: 'name', header: 'Producto' },
    { key: 'category', header: 'Categoría' },
    { key: 'stock', header: 'Stock' },
    { key: 'price', header: 'Precio' },
    { key: 'expirationDate', header: 'Vencimiento' },
  ],

  async generate(prisma: PrismaService) {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { name: 'asc' },
    });
    return products.map((p) => ({
      sku: p.sku,
      name: p.name,
      category: p.category.name,
      stock: p.stock,
      price: Number(p.price).toFixed(2),
      expirationDate: p.expirationDate?.toISOString().slice(0, 10) ?? '',
    }));
  },
};
