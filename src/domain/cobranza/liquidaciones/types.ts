import type { Guid } from '../../seguridad/types';

export type LiquidacionPendienteResumenDto = {
  cantidadMovimientos: number;
  totalEfectivo: number;
  totalTarjeta: number;
  totalTransferencia: number;
  total: number;
};

export type CrearLiquidacionCobranzaRequestDto = {
  evidencia?: string;
};

export type LiquidacionCobranzaDto = {
  id: Guid;
  cobradorId: Guid;
  nombreCobrador?: string;
  fecha: string;
  hora: string;
  totalEfectivo: number;
  totalTransferencia: number;
  total: number;
  evidencia?: string | null;
  estatus: string;
  fechaCreacion: string;
};

