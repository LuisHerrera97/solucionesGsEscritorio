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
  liquidacionCobranzaId?: string | null;
  corteCajaId?: string | null;
  recibidoCaja?: boolean;
  estatusFichaFinanzas?: 'PENDIENTE' | 'LIQUIDADO' | 'EN_CORTE' | null;
  creditoId?: string | null;
  numeroFicha?: number | null;
  fecha: string;
  hora?: string | null;
  /** false = no entra en caja (p. ej. condonación de interés); ausente se trata como true */
  registraCaja?: boolean;
};



export type CobradorLiquidacionResumenDto = {
  cobradorId: string;
  nombreCobrador: string;
  cantidadMovimientos: number;
  total: number;
  totalEfectivo: number;
  totalTarjeta: number;
  totalTransferencia: number;
};

export type ResumenEstadoFichaCajaDto = {
  total: number;
  pendiente: number;
  liquidado: number;
  enCorte: number;
};

export type ResumenLiquidacionesCajaDto = {
  cobradores: CobradorLiquidacionResumenDto[];
  estados: ResumenEstadoFichaCajaDto;
};

export type RealizarCorteRequestDto = {
  totalReal: number;
  evidencia?: string;
  /** Fecha del día a cortar (YYYY-MM-DD), alineada con el filtro de caja. */
  fechaCorte?: string;
};


export type MarcarRecibidoCajaRequestDto = {
  movimientoIds: string[];
  fecha?: string;
};
