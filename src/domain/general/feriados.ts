import type { Guid } from '../seguridad/types';

export type FeriadoDto = {
  id: Guid;
  fecha: string;
  nombre: string;
  activo: boolean;
  fechaCreacion: string;
};

