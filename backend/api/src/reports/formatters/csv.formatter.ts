import { FormatterOutput, ReportFormatter } from './formatter.interface';

// CSV con BOM UTF-8 para que Excel reconozca las tildes.
function escapeCsv(value: unknown): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export const csvFormatter: ReportFormatter = {
  format: 'csv',
  async render({ reportType, columns, rows }): Promise<FormatterOutput> {
    const header = columns.map((c) => escapeCsv(c.header)).join(',');
    const body = rows
      .map((r) => columns.map((c) => escapeCsv(r[c.key])).join(','))
      .join('\n');
    const csv = `﻿${header}\n${body}\n`;
    return {
      buffer: Buffer.from(csv, 'utf8'),
      filename: `${reportType}_${stamp()}.csv`,
      contentType: 'text/csv; charset=utf-8',
    };
  },
};

function stamp() {
  return new Date().toISOString().slice(0, 10).replace(/-/g, '');
}
