import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  list(filter: { query?: string; categoryId?: string; onlyAvailable?: boolean }) {
    const where: Prisma.ProductWhereInput = {};
    if (filter.onlyAvailable) where.stock = { gt: 0 };
    if (filter.categoryId) where.categoryId = filter.categoryId;
    if (filter.query) {
      where.OR = [
        { name: { contains: filter.query, mode: 'insensitive' } },
        { sku: { contains: filter.query, mode: 'insensitive' } },
      ];
    }
    return this.prisma.product.findMany({
      where,
      orderBy: { name: 'asc' },
      include: { category: true },
    });
  }

  findById(id: string) {
    return this.prisma.product.findUnique({ where: { id }, include: { category: true } });
  }

  findBySku(sku: string) {
    return this.prisma.product.findUnique({ where: { sku } });
  }

  create(data: Prisma.ProductCreateInput) {
    return this.prisma.product.create({ data, include: { category: true } });
  }

  update(id: string, data: Prisma.ProductUpdateInput) {
    return this.prisma.product.update({ where: { id }, data, include: { category: true } });
  }

  remove(id: string) {
    return this.prisma.product.delete({ where: { id } });
  }

  // Productos cuya fecha de vencimiento cae dentro de los próximos `days` días.
  expiring(days = 30) {
    const limit = new Date();
    limit.setDate(limit.getDate() + days);
    return this.prisma.product.findMany({
      where: { expirationDate: { not: null, lte: limit } },
      orderBy: { expirationDate: 'asc' },
      include: { category: true },
    });
  }
}
