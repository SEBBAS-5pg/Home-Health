import { inventarioStrategy } from './inventario.strategy';
import { productosStrategy } from './productos.strategy';
import { ReportStrategy } from './report-strategy.interface';
import { ventasStrategy } from './ventas.strategy';

// Registry de estrategias. Agregar un reporte nuevo = sumar una entrada acá.
export const REPORT_STRATEGIES: Record<string, ReportStrategy> = {
  ventas: ventasStrategy,
  inventario: inventarioStrategy,
  productos: productosStrategy,
};

export type ReportType = keyof typeof REPORT_STRATEGIES;
