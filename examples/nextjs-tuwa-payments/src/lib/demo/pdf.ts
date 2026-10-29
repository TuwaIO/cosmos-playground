// A one-page PDF of plain text lines, for the documents of demo mode: enough for a download button to give a real
// file, without a PDF package. Real documents come from Quasar (`quasar.payments.getDocument`).

/** Escapes the characters PDF strings reserve, and drops what Helvetica's standard encoding lacks. */
function pdfText(text: string): string {
  return text
    .replace(/[^\x20-\x7e]/g, '-')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

/**
 * Builds an A4 PDF with a title and lines of text.
 *
 * @param title - The first line, in a larger size.
 * @param lines - The lines under it.
 * @returns The bytes of the file.
 */
export function textPdf(title: string, lines: readonly string[]): Uint8Array {
  const content = [
    'BT',
    '/F1 20 Tf',
    '56 780 Td',
    `(${pdfText(title)}) Tj`,
    '/F1 11 Tf',
    '0 -34 Td',
    ...lines.flatMap((line) => [`(${pdfText(line)}) Tj`, '0 -18 Td']),
    'ET',
  ].join('\n');

  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
  ];

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [];
  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  pdf += offsets.map((offset) => `${String(offset).padStart(10, '0')} 00000 n \n`).join('');
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return new TextEncoder().encode(pdf);
}
