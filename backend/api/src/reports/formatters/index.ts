import { csvFormatter } from './csv.formatter';
import { excelFormatter } from './excel.formatter';
import { ReportFormatter } from './formatter.interface';
import { pdfFormatter } from './pdf.formatter';

export const REPORT_FORMATTERS: Record<string, ReportFormatter> = {
  csv: csvFormatter,
  xlsx: excelFormatter,
  pdf: pdfFormatter,
};

export type ReportFormat = keyof typeof REPORT_FORMATTERS;
