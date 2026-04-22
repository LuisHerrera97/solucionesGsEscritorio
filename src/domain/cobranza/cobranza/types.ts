export type MovimientoCobranzaDto = {
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
};
