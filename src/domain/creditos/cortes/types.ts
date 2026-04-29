import type { MovimientoCajaDto } from '../caja/types';

export type CorteCajaDto = {
  id: string;
  fecha: string;
  hora?: string | null;
  totalTeorico: number;
  totalReal: number;
  diferencia: number;
  movimientos: MovimientoCajaDto[];
};

