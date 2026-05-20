import { Controller, Get, Param, Query, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Response } from 'express';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { ReportsService } from './reports.service';

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(Role.ADMIN)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reports: ReportsService) {}

  @Get(':type')
  preview(
    @Param('type') type: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.reports.generate(type, {
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
    });
  }

  @Get(':type/export')
  async export(
    @Param('type') type: string,
    @Query('format') format: string,
    @Query('from') from: string | undefined,
    @Query('to') to: string | undefined,
    @Res() res: Response,
  ) {
    const output = await this.reports.export(type, format, {
      from: from ? new Date(from) : undefined,
      to: to ? new Date(to) : undefined,
    });
    res.setHeader('Content-Type', output.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${output.filename}"`);
    res.send(output.buffer);
  }
}
