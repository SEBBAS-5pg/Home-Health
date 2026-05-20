import { ReportColumn } from '../strategies/report-strategy.interface';

export interface FormatterOutput {
  buffer: Buffer;
  filename: string;
  contentType: string;
}

// Cada formato (csv, xlsx, pdf) implementa esta interfaz.
// La elección del formato se hace en runtime según el query param `?format=...`.
export interface ReportFormatter {
  readonly format: string;
  render(opts: {
    reportType: string;
    columns: ReportColumn[];
    rows: Record<string, unknown>[];
  }): Promise<FormatterOutput>;
}
