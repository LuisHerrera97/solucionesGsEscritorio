export type Guid = string;

export type AutenticacionRequestDto = {
  usuarioAcceso: string;
  contrasena: string;
};

export type UsuarioDto = {
  id: Guid;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  usuarioAcceso: string;

  activo: boolean;
  fechaCreacion: string;
  ultimoAcceso?: string | null;
  passwordExpiresAt?: string | null;
  mustChangePassword?: boolean;
  lockoutUntil?: string | null;
  idPerfil: Guid;
  nombrePerfil: string;
  idZonaCobranza?: Guid | null;
  nombreZonaCobranza?: string;
};

export type UsuarioCrearDto = UsuarioDto & {
  contrasena: string;
};

export type AutenticacionResponseDto = {
  token: string;
  refreshToken: string;
  usuario: UsuarioDto;
  autenticado: boolean;
};

export type RefreshTokenRequestDto = {
  userId: Guid;
  refreshToken: string;
};

export type SolicitarRecuperacionPasswordRequestDto = {
  usuarioAcceso: string;
};

export type SolicitarRecuperacionPasswordResponseDto = {
  ok: boolean;
  codigo?: string | null;
};

export type RestablecerPasswordRequestDto = {
  usuarioAcceso: string;
  codigo: string;
  nuevaContrasena: string;
};

export type CambiarPasswordRequestDto = {
  contrasenaActual: string;
  nuevaContrasena: string;
};

export type ResetPasswordAdminRequestDto = {
  nuevaContrasena: string;
};

export type PerfilDto = {
  id: Guid;
  nombre: string;
  clave: string;
  activo: boolean;
  fechaCreacion: string;
  orden: number;
};

export type ModuloDto = {
  id: Guid;
  nombre: string;
  clave: string;
  icono: string;
  activo: boolean;
  tienePermiso: boolean;
  fechaCreacion: string;
  orden: number;
  paginas: PaginaDto[];
};

export type PaginaDto = {
  id: Guid;
  nombre: string;
  clave: string;
  ruta: string;
  idModulo: Guid;
  nombreModulo: string;
  activo: boolean;
  /** Si no viene del API (datos antiguos), se trata como true. */
  enMenu?: boolean | null;
  tienePermiso: boolean;
  fechaCreacion: string;
  orden: number;
  botones: BotonDto[];
};

export type BotonDto = {
  id: Guid;
  nombre: string;
  clave: string;
  idPagina: Guid;
  nombrePagina: string;
  activo: boolean;
  tienePermiso: boolean;
  fechaCreacion: string;
  orden: number;
};

export type AsignarPermisosRequestDto = {
  idPerfil: Guid;
  modulosPermitidos: Guid[];
  paginasPermitidas: Guid[];
  botonesPermitidos: Guid[];
};
