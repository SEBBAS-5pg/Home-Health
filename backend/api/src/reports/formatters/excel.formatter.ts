import * as ExcelJS from 'exceljs';
import { FormatterOutput, ReportFormatter } from './formatter.interface';

export const excelFormatter: ReportFormatter = {
  format: 'xlsx',
  async render({ reportType, columns, rows }): Promise<FormatterOutput> {
    const wb = new ExcelJS.Workbook();
    wb.creator = 'Home-Health';
    wb.created = new Date();
    const ws = wb.addWorksheet(reportType);

    ws.columns = columns.map((c) => ({ header: c.header, key: c.key, width: 22 }));
    ws.getRow(1).font = { bold: true };
    ws.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF14B8A6' },
    };
    ws.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    rows.forEach((r) => ws.addRow(r));

    const arrayBuffer = await wb.xlsx.writeBuffer();
    return {
      buffer: Buffer.from(arrayBuffer),
      filename: `${reportType}_${stamp()}.xlsx`,
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };
  },
};

function stamp() {
  return new Date().toISOString().slice(0, 10).replace(/-/g, '');
}
