export type PendienteCobroDto = {
  creditoId: string;
  creditoFolio: string;
  numFicha: number;
  fechaLimite: string;
  totalFicha: number;
  /** Total abonado a la ficha (API: abonoAcumulado) */
  abonoAcumulado: number;
  pendiente: number;
  estado: 'Vencida' | 'Hoy' | string;
  clienteNombre: string;
  clienteNegocio: string;
  tipoCredito: 'diario' | 'semanal' | string;
};

export type PendientesListadoDto = {
  items: PendienteCobroDto[];
  totalCount: number;
};
