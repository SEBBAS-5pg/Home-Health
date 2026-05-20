import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { AuthenticatedUser, CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateMovementDto } from './dto/create-movement.dto';
import { InventoryService } from './inventory.service';

@ApiTags('inventory')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventory: InventoryService) {}

  @Get('movements')
  list(@Query('productId') productId?: string) {
    return this.inventory.list(productId);
  }

  @Post('movements')
  register(@Body() dto: CreateMovementDto, @CurrentUser() admin: AuthenticatedUser) {
    return this.inventory.registerMovement(dto, admin.id);
  }
}
