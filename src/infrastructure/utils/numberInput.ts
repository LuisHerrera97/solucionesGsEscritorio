/** Permite dejar el input vacío mientras se edita; `Number('')` en JS es 0 y rompe el borrado. */
export type NumberInputValue = number | '';

export function parseNumberInput(raw: string): NumberInputValue {
  return raw === '' ? '' : Number(raw);
}

export function numberInputDisplay(v: NumberInputValue): string | number {
  return (v === '' || v === 0) ? '' : v;
}

export function asNumber(v: NumberInputValue): number {
  return v === '' ? 0 : v;
}

export type WithEmptyNumberFields<T> = {
  [K in keyof T]: T[K] extends number ? NumberInputValue : T[K];
};

export function coalesceEmptyNumbersToZero<T extends object>(obj: T): T {
  const next = { ...obj } as Record<string, unknown>;
  for (const k of Object.keys(next)) {
    if (next[k] === '') next[k] = 0;
  }
  return next as T;
}
