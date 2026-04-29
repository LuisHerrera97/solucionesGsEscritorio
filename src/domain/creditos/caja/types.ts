/** Respuesta de `GET .../dashboard/movimientos-cobranza` (vista mínima para la pantalla Cobranza). */
export type MovimientoCajaCobranzaDto = {
  id: string;
  tipo: string;
  concepto?: string | null;
  total: number;
  abono?: number | null;
  mora?: number | null;
  operacionId?: string | null;
  reversaDeId?: string | null;
  revertido?: boolean;
  creditoId?: string | null;
  creditoFolio?: string | null;
  clienteNombre?: string | null;
  numeroFicha?: number | null;
  fecha: string;
  hora?: string | null;
};

export type MovimientoCajaDto = {
  id: string;
  tipo: string;
  concepto?: string | null;
  medio: 'Efectivo' | 'Tarjeta' | 'Transferencia' | 'Mixto' | string;
  total: number;
  montoEfectivo?: number | null;
  montoTransferencia?: number | null;
  abono?: number | null;
  mora?: number | null;
  cobradorId?: string | null;
  corteCajaId?: string | null;
  recibidoCaja?: boolean;
  estatusFichaFinanzas?: 'PENDIENTE' | 'COBRADO' | 'EN_CORTE' | null;
  operacionId?: string | null;
  reversaDeId?: string | null;
  revertido?: boolean;
  creditoId?: string | null;
  creditoFolio?: string | null;
  clienteNombre?: string | null;
  numeroFicha?: number | null;
  fecha: string;
  hora?: string | null;
  registraCaja?: boolean;
};
