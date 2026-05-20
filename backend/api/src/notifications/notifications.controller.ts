import { Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NotificationType, Role } from '@prisma/client';
import { AuthenticatedUser, CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from './notifications.service';

@ApiTags('notifications')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  // Sincroniza notificaciones de stock bajo y vencimientos.
  // Solo admins; se invoca al abrir el centro de notificaciones en el frontend.
  @Post('sync')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  sync() {
    return this.notifications.syncForAdmins();
  }

  @Get()
  list(
    @CurrentUser() user: AuthenticatedUser,
    @Query('type') type?: NotificationType,
    @Query('unread') unread?: 'true' | 'false',
  ) {
    return this.prisma.notification.findMany({
      where: {
        userId: user.id,
        ...(type && { type }),
        ...(unread === 'true' && { isRead: false }),
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  @Patch(':id/read')
  async markAsRead(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    await this.prisma.notification.updateMany({
      where: { id, userId: user.id },
      data: { isRead: true },
    });
    return { id, isRead: true };
  }

  @Patch('read-all')
  async markAllAsRead(@CurrentUser() user: AuthenticatedUser) {
    const result = await this.prisma.notification.updateMany({
      where: { userId: user.id, isRead: false },
      data: { isRead: true },
    });
    return { updated: result.count };
  }
}
