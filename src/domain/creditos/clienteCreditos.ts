import type { Guid } from '../seguridad/types';
import type { Cliente } from './types';

export type CreditoResumenDto = {
  id: Guid;
  folio: string;
  monto: number;
  total: number;
  pagado: number;
  tipo: string;
  estatus: string;
  fechaCreacion: string;
};

export type ClienteCreditosDto = {
  cliente: Cliente;
  vigentes: CreditoResumenDto[];
  liquidados: CreditoResumenDto[];
};
