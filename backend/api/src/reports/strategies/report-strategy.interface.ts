import { PrismaService } from '../../prisma/prisma.service';

export interface ReportFilters {
  from?: Date;
  to?: Date;
}

export interface ReportColumn {
  key: string;
  header: string;
}

// Contrato común para cualquier tipo de reporte.
// Cada implementación decide qué columnas exporta y cómo construye las filas
// a partir de la base de datos.
export interface ReportStrategy<TRow = Record<string, unknown>> {
  readonly type: string;
  readonly columns: ReportColumn[];
  generate(prisma: PrismaService, filters: ReportFilters): Promise<TRow[]>;
}
