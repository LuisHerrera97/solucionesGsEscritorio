import { calendarDayKeyFromApi, localCalendarDayKey } from '../date/calendarDate';

/** Misma regla que FichasEstadoCuenta: vencida si la fecha de calendario es estrictamente anterior a hoy. */
export function fichaNoPagadaEsAtrasada(fecha: string | null | undefined): boolean {
  const k = calendarDayKeyFromApi(fecha);
  if (k === '') return false;
  return k < localCalendarDayKey();
}

/** Vigentes (no vencidas) primero, luego atrasadas; dentro de cada grupo por número de ficha. */
export function compareFichasParaPagoMultiples<T extends { num: number; fecha: string; pagada: boolean }>(a: T, b: T): number {
  const ra = a.pagada ? 2 : fichaNoPagadaEsAtrasada(a.fecha) ? 1 : 0;
  const rb = b.pagada ? 2 : fichaNoPagadaEsAtrasada(b.fecha) ? 1 : 0;
  if (ra !== rb) return ra - rb;
  return a.num - b.num;
}

export function fichasNoPagadasOrdenadasParaPagoMultiples<T extends { num: number; fecha: string; pagada: boolean }>(
  fichas: T[],
): T[] {
  return fichas.filter((f) => !f.pagada).sort(compareFichasParaPagoMultiples);
}
