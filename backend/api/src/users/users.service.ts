import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly repo: UsersRepository) {}

  list(filter: { role?: Role; query?: string }) {
    return this.repo.list(filter);
  }

  async findOne(id: string) {
    const user = await this.repo.findById(id);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    const { passwordHash: _, ...safe } = user;
    return safe;
  }

  async updateMe(currentUserId: string, dto: UpdateUserDto) {
    // El usuario solo puede tocar su nombre y teléfono.
    const { role, isActive, ...allowed } = dto;
    if (role || typeof isActive === 'boolean') {
      throw new ForbiddenException('No puedes cambiar tu propio rol ni estado');
    }
    return this.repo.update(currentUserId, allowed);
  }

  async updateByAdmin(targetId: string, adminId: string, dto: UpdateUserDto) {
    // El admin no puede degradarse a sí mismo (evita quedarse sin admins).
    if (targetId === adminId && dto.role && dto.role !== Role.ADMIN) {
      throw new BadRequestException('No puedes cambiar tu propio rol');
    }
    const exists = await this.repo.findById(targetId);
    if (!exists) throw new NotFoundException('Usuario no encontrado');
    return this.repo.update(targetId, dto);
  }
}
