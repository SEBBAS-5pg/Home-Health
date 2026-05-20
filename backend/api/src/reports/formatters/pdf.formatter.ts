import PDFDocument from 'pdfkit';
import { FormatterOutput, ReportFormatter } from './formatter.interface';

export const pdfFormatter: ReportFormatter = {
  format: 'pdf',
  async render({ reportType, columns, rows }): Promise<FormatterOutput> {
    const buffer = await new Promise<Buffer>((resolve) => {
      const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 40 });
      const chunks: Buffer[] = [];
      doc.on('data', (c) => chunks.push(c));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      doc.fontSize(18).fillColor('#0F766E').text(`Reporte de ${reportType}`, { align: 'left' });
      doc
        .fontSize(10)
        .fillColor('#475569')
        .text(`Generado: ${new Date().toLocaleString('es-CO')}`)
        .moveDown(1);

      // Cabecera
      const tableTop = doc.y;
      const colWidth = (doc.page.width - 80) / columns.length;
      doc.font('Helvetica-Bold').fontSize(10).fillColor('#0F172A');
      columns.forEach((c, i) => doc.text(c.header, 40 + i * colWidth, tableTop, { width: colWidth }));
      doc.moveTo(40, doc.y + 4).lineTo(doc.page.width - 40, doc.y + 4).stroke('#E2E8F0');
      doc.moveDown();

      // Filas
      doc.font('Helvetica').fillColor('#0F172A');
      rows.forEach((r) => {
        const y = doc.y;
        columns.forEach((c, i) =>
          doc.text(String(r[c.key] ?? ''), 40 + i * colWidth, y, { width: colWidth }),
        );
        doc.moveDown(0.4);
        if (doc.y > doc.page.height - 60) doc.addPage();
      });

      doc.end();
    });

    return {
      buffer,
      filename: `${reportType}_${stamp()}.pdf`,
      contentType: 'application/pdf',
    };
  },
};

function stamp() {
  return new Date().toISOString().slice(0, 10).replace(/-/g, '');
}
