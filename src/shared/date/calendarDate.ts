/**
 * La API envía fechas de calendario como ISO con medianoche UTC (p. ej. 2026-04-15T00:00:00Z).
 * `new Date(...).toLocaleDateString()` en zonas detrás de UTC muestra el día anterior.
 * Estas funciones interpretan y muestran el día de negocio según el calendario.
 */
export function parseCalendarDateFromApi(isoOrDay: string | null | undefined): Date | null {
  if (isoOrDay == null || isoOrDay === '') return null;
  const s = String(isoOrDay).trim();
  const datePart = s.slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
    const [y, m, d] = datePart.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatCalendarDateFromApi(
  isoOrDay: string | null | undefined,
  options?: Intl.DateTimeFormatOptions,
  locale = 'es-MX',
): string {
  const dt = parseCalendarDateFromApi(isoOrDay);
  if (!dt) return '-';
  return dt.toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric', ...options });
}

/** Clave YYYY-MM-DD alineada con la fecha guardada en BD para valores medianoche UTC. */
export function calendarDayKeyFromApi(isoOrDay: string | null | undefined): string {
  if (isoOrDay == null || isoOrDay === '') return '';
  const s = String(isoOrDay).trim();
  const datePart = s.slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) return datePart;
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

export function localCalendarDayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
