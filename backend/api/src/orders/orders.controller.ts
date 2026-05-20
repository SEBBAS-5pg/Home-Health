import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';
import { AuthenticatedUser, CurrentUser } from '../common/decorators/current-user.decorator';
import { ChangeStatusDto } from './dto/change-status.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';

@ApiTags('orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Get()
  list(@CurrentUser() actor: AuthenticatedUser, @Query('status') status?: OrderStatus) {
    return this.orders.list(actor, status);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string, @CurrentUser() actor: AuthenticatedUser) {
    return this.orders.findOne(id, actor);
  }

  @Post()
  create(@Body() dto: CreateOrderDto, @CurrentUser() actor: AuthenticatedUser) {
    return this.orders.create(dto, actor.id);
  }

  @Patch(':id/status')
  changeStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: ChangeStatusDto,
    @CurrentUser() actor: AuthenticatedUser,
  ) {
    return this.orders.changeStatus(id, dto, actor);
  }
}
