export interface Cliente {
  id: string;
  nombre: string;
  apellido: string;
  direccion: string;
  negocio: string;
  zona: string;
  estatus: 'Activo' | 'Inactivo' | 'En Revisión';
}

/** Respuesta de listado de clientes (paginado o completo) desde la API */
export type ClientesListado = {
  items: Cliente[];
  totalCount: number;
};

export interface Ficha {
  num: number;
  fecha: string;
  fechaPago?: string;
  hora?: string;
  folio: string;
  capital: number;
  interes: number;
  total: number;
  abono?: number;
  mora?: number;
  abonoAcumulado: number;
  moraAcumulada: number;
  saldoCap: number;
  saldoPendiente: number;
  pagada: boolean;
  aplicado?: boolean;
}

export interface Credito {
  id: string;
  folio: string;
  clienteId: string;
  monto: number;
  interesTotal: number;
  total: number;
  cuota: number;
  totalFichas: number;
  pagado: number;
  tipo: 'diario' | 'semanal' | 'mensual';
  estatus: 'Activo' | 'Liquidado' | 'Reestructurado';
  permitirDomingo?: boolean;
  aplicarFeriados?: boolean;
  fichas: Ficha[];
}

export type MedioPago = 'Efectivo' | 'Tarjeta' | 'Transferencia' | 'Mixto';

export type AbonarFichaCreditoRequest = {
  creditoId: string;
  numeroFicha: number;
  cantidadFichas?: number;
  idempotencyKey?: string;
  montoAbono?: number;
  medio?: MedioPago;
  montoEfectivo?: number;
  montoTransferencia?: number;
};

export type PenalizarFichaCreditoRequest = {
  creditoId: string;
  numeroFicha: number;
  monto: number;
  idempotencyKey?: string;
};

export interface DetallePago {
  medio: MedioPago;
  montoEfectivo?: number;
  montoTransferencia?: number;
}

export interface Movimiento {
  id?: string;
  hora: string;
  tipo: 'Ficha' | 'Mora' | 'Ingreso' | 'Gasto';
  concepto?: string;
  medio: MedioPago;
  montoEfectivo?: number;
  montoTransferencia?: number;
  folio?: string;
  abono?: number;
  mora?: number;
  total: number;
  fecha: string;
}

export interface Corte {
  id: string;
  fecha: string;
  hora: string;
  totalTeorico: number;
  totalReal: number;
  diferencia: number;
  movimientos: Movimiento[];
}

export interface Config {
  moraDiaria: number;
  moraSemanal: number;
  moraMensual: number;
  tasaDiaria: number;
  tasaSemanal: number;
  tasaMensual: number;
  diasGraciaSemanal?: number;
  diasGraciaMensual?: number;
  topeMoraSemanal?: number;
  topeMoraMensual?: number;
}

export interface DashboardResumenDto {
  totalClientes: number;
  creditosActivos: number;
  totalVencido: number;
}
