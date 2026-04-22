import type { Guid } from '../seguridad/types';

export type AuditoriaEventoDto = {
  id: Guid;
  usuarioId?: Guid | null;
  /** Nombre y usuario de acceso, si el backend lo resolvió */
  usuarioNombre?: string | null;
  accion: string;
  entidadTipo?: string | null;
  entidadId?: Guid | null;
  fecha: string;
  detalle?: string | null;
};

export type OpcionFiltroAuditoriaDto = {
  valor: string;
  etiqueta: string;
};

export type AuditoriaFiltrosOpcionesDto = {
  acciones: OpcionFiltroAuditoriaDto[];
  entidadesTipo: OpcionFiltroAuditoriaDto[];
};

