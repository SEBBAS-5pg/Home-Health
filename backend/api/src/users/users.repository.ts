import { Injectable } from '@nestjs/common';
import { Prisma, Role, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

// El repository es un wrapper finito alrededor de Prisma.
// Las páginas (UserService) usan ESTOS métodos, no Prisma directo.
// Eso facilita testear el servicio con mocks y aislar el ORM.
@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  list(filter: { role?: Role; query?: string }) {
    const where: Prisma.UserWhereInput = {};
    if (filter.role) where.role = filter.role;
    if (filter.query) {
      where.OR = [
        { fullName: { contains: filter.query, mode: 'insensitive' } },
        { email: { contains: filter.query, mode: 'insensitive' } },
      ];
    }
    return this.prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: this.publicFields(),
    });
  }

  update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }

  publicFields() {
    return {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    } satisfies Prisma.UserSelect;
  }
}
