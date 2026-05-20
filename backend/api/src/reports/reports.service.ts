import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { REPORT_FORMATTERS } from './formatters';
import { FormatterOutput } from './formatters/formatter.interface';
import { REPORT_STRATEGIES } from './strategies';
import { ReportFilters } from './strategies/report-strategy.interface';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  // Genera el reporte en pantalla (devuelve filas + columnas).
  async generate(type: string, filters: ReportFilters) {
    const strategy = REPORT_STRATEGIES[type];
    if (!strategy) throw new NotFoundException(`Tipo de reporte "${type}" no existe`);
    const rows = await strategy.generate(this.prisma, filters);
    return { type, columns: strategy.columns, rows };
  }

  // Exporta en el formato pedido (pdf/xlsx/csv).
  async export(type: string, format: string, filters: ReportFilters): Promise<FormatterOutput> {
    const strategy = REPORT_STRATEGIES[type];
    if (!strategy) throw new NotFoundException(`Tipo de reporte "${type}" no existe`);

    const formatter = REPORT_FORMATTERS[format];
    if (!formatter) {
      throw new BadRequestException(`Formato "${format}" no soportado. Usa pdf, xlsx o csv.`);
    }

    const rows = await strategy.generate(this.prisma, filters);
    if (rows.length === 0) throw new BadRequestException('El reporte no contiene datos para exportar');

    return formatter.render({ reportType: type, columns: strategy.columns, rows });
  }
}
