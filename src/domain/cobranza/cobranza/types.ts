export type MovimientoCobranzaDto = {
  id?: string;
  creditoId: string;
  creditoFolio: string;
  numFicha: number;
  fechaPago: string;
  horaPago: string;
  fechaLimite: string;
  capital: number;
  interes: number;
  abono: number;
  mora: number;
  totalCobrado: number;
  clienteNombre: string;
  clienteNegocio: string;
  tipoCredito: 'diario' | 'semanal' | string;
  tipo?: string;
  concepto?: string | null;
  medio?: string;
  reversaDeId?: string | null;
  revertido?: boolean;
};

/** Vista de tarjeta en pantalla Cobranza (agrupada por operación). */
export type CobranzaOperacionDetalleVm = {
  id: string;
  numFicha: number;
  fechaPago: string;
  horaPago: string;
  abono: number;
  mora: number;
  totalCobrado: number;
};

export type CobranzaOperacionCardVm = {
  id: string;
  creditoId: string;
  creditoFolio: string;
  clienteNombre: string;
  fechaPago: string;
  horaPago: string;
  abono: number;
  mora: number;
  totalCobrado: number;
  tipo?: string;
  concepto?: string | null;
  revertido?: boolean;
  reversaDeId?: string | null;
  detalles: CobranzaOperacionDetalleVm[];
};
