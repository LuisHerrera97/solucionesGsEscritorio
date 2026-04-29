type TicketData = {
  fecha: string;
  hora: string;
  cliente: string;
  folio: string;
  concepto: string;
  ficha?: string;
  total: number;
  detalle?: string[];
};

const TICKET_WIDTH = 40;
const line = '-'.repeat(TICKET_WIDTH);
const center = (value: string) => value.toUpperCase().padStart(Math.floor((TICKET_WIDTH + value.length) / 2), ' ');
const row = (label: string, value: string) => `${label.toUpperCase().padEnd(11, ' ')}: ${value}`;
const safe = (value: string) => value.replace(/[<>&]/g, (ch) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[ch] ?? ch));

export const buildTicketHtml = (data: TicketData): string => {
  const detalleRows = (data.detalle ?? [])
    .map((d) => safe(d).toUpperCase())
    .join('\n');
  const content = [
    center('SOLUCIONES GS'),
    line,
    row('FECHA', data.fecha),
    row('HORA', data.hora),
    line,
    center('*** C-L-I-E-N-T-E ***'),
    safe(data.cliente).toUpperCase(),
    row('CREDITO', safe(data.folio).toUpperCase()),
    row('CONCEPTO', safe(data.concepto).toUpperCase()),
    row('FICHA', safe(data.ficha ?? '-').toUpperCase()),
    line,
    center('*** P-A-G-A-D-O ***'),
    row('IMPORTE', `$${data.total.toLocaleString()}`),
    ...(detalleRows ? [detalleRows] : []),
    line,
    center('GRACIAS POR SU PUNTUALIDAD!!'),
    center('FAVOR DE CONSERVAR SU COMPROBANTE'),
  ].join('\n');

  return `
  <html>
    <body style="font-family: 'Courier New', monospace; width: 320px; margin: 0 auto; padding: 8px;">
      <pre style="font-family: inherit; font-size: 14px; line-height: 1.25; margin: 0; white-space: pre-wrap;">${content}</pre>
    </body>
  </html>`;
};
