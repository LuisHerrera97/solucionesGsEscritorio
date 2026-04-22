export type Guid = string;

export type ConfiguracionSistemaDto = {
  id: Guid;
  moraDiaria: number;
  moraSemanal: number;
  diasGraciaDiaria: number;
  diasGraciaSemanal: number;
  topeMoraDiaria: number;
  topeMoraSemanal: number;
  tasaDiaria: number;
  tasaSemanal: number;
  moraMensual: number;
  diasGraciaMensual: number;
  topeMoraMensual: number;
  tasaMensual: number;
  domingoInhabilDefault: boolean;
  aplicarFeriadosDefault: boolean;
  passwordMinLength: number;
  passwordRequireUpper: boolean;
  passwordRequireLower: boolean;
  passwordRequireDigit: boolean;
  passwordRequireSpecial: boolean;
  passwordExpireDays: number;
  passwordHistoryCount: number;
  lockoutMaxFailedAttempts: number;
  lockoutMinutes: number;
  fechaActualizacion: string;
};

export type ZonaCobranzaDto = {
  id: Guid;
  nombre: string;
  activo: boolean;
  fechaCreacion: string;
  orden: number;
};
