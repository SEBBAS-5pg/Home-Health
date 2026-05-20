import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ProductsRepository } from './products.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly repo: ProductsRepository) {}

  list(filter: { query?: string; categoryId?: string; onlyAvailable?: boolean }) {
    return this.repo.list(filter);
  }

  async findOne(id: string) {
    const product = await this.repo.findById(id);
    if (!product) throw new NotFoundException('Producto no encontrado');
    return product;
  }

  async create(dto: CreateProductDto) {
    const duplicate = await this.repo.findBySku(dto.sku);
    if (duplicate) throw new ConflictException(`Ya existe un producto con SKU ${dto.sku}`);

    return this.repo.create({
      name: dto.name,
      sku: dto.sku,
      description: dto.description,
      price: new Prisma.Decimal(dto.price),
      stock: dto.stock,
      expirationDate: dto.expirationDate ? new Date(dto.expirationDate) : null,
      category: { connect: { id: dto.categoryId } },
    });
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);

    const data: Prisma.ProductUpdateInput = {
      ...(dto.name && { name: dto.name }),
      ...(dto.sku && { sku: dto.sku }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.price !== undefined && { price: new Prisma.Decimal(dto.price) }),
      ...(dto.stock !== undefined && { stock: dto.stock }),
      ...(dto.expirationDate && { expirationDate: new Date(dto.expirationDate) }),
      ...(dto.categoryId && { category: { connect: { id: dto.categoryId } } }),
    };
    return this.repo.update(id, data);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.repo.remove(id);
  }

  expiring(days?: number) {
    return this.repo.expiring(days);
  }
}
