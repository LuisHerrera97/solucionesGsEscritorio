import type {
  AutenticacionRequestDto,
  AutenticacionResponseDto,
  AsignarPermisosRequestDto,
  BotonDto,
  Guid,
  ModuloDto,
  PaginaDto,
  PerfilDto,
  UsuarioDto,
  UsuarioCrearDto,
} from '../../domain/seguridad/types';

export type AuthSessionStore = {
  saveLogin: (data: AutenticacionResponseDto) => void;
  clear: () => void;
  getToken: () => string | null;
  getRefreshToken: () => string | null;
  getUser: () => UsuarioDto | null;
  touchActivity: () => void;
  getLastActivityAt: () => number | null;
};

export type PaginationParams = {
  page?: number;
  pageSize?: number;
};

export type SeguridadGateway = {
  auth: {
    login: (payload: AutenticacionRequestDto) => Promise<AutenticacionResponseDto>;
  };
  usuarios: {
    getAll: () => Promise<UsuarioDto[]>;
    create: (payload: UsuarioCrearDto) => Promise<UsuarioDto>;
    update: (id: Guid, payload: UsuarioDto) => Promise<UsuarioDto>;
    remove: (id: Guid) => Promise<void>;
  };
  perfiles: {
    getAll: () => Promise<PerfilDto[]>;
    create: (payload: PerfilDto) => Promise<PerfilDto>;
    update: (id: Guid, payload: PerfilDto) => Promise<PerfilDto>;
    remove: (id: Guid) => Promise<void>;
  };
  permisos: {
    getMenu: (idPerfil: Guid) => Promise<ModuloDto[]>;
    getPermisos: (idPerfil: Guid) => Promise<AsignarPermisosRequestDto>;
    setPermisos: (payload: AsignarPermisosRequestDto) => Promise<void>;
  };
  modulos: {
    getAll: () => Promise<ModuloDto[]>;
    create: (payload: ModuloDto) => Promise<ModuloDto>;
    update: (id: Guid, payload: ModuloDto) => Promise<ModuloDto>;
    remove: (id: Guid) => Promise<void>;
  };
  paginas: {
    getAll: (params?: PaginationParams) => Promise<PaginaDto[]>;
    create: (payload: PaginaDto) => Promise<PaginaDto>;
    update: (id: Guid, payload: PaginaDto) => Promise<PaginaDto>;
    remove: (id: Guid) => Promise<void>;
  };
  botones: {
    getAll: (params?: PaginationParams) => Promise<BotonDto[]>;
    create: (payload: BotonDto) => Promise<BotonDto>;
    update: (id: Guid, payload: BotonDto) => Promise<BotonDto>;
    remove: (id: Guid) => Promise<void>;
  };
};

export class SeguridadAppService {
  private readonly gateway: SeguridadGateway;
  private readonly session: AuthSessionStore;

  constructor(gateway: SeguridadGateway, session: AuthSessionStore) {
    this.gateway = gateway;
    this.session = session;
  }

  auth = {
    login: async (payload: AutenticacionRequestDto): Promise<AutenticacionResponseDto> => this.gateway.auth.login(payload),
    loginAndStore: async (payload: AutenticacionRequestDto): Promise<AutenticacionResponseDto> => {
      const result = await this.gateway.auth.login(payload);
      if (!result.autenticado) {
        throw new Error('Credenciales inválidas');
      }
      this.session.saveLogin(result);
      return result;
    },
    logout: async (): Promise<void> => {
      this.session.clear();
    },
  };

  usuarios = {
    getAll: async (): Promise<UsuarioDto[]> => this.gateway.usuarios.getAll(),
    create: async (payload: UsuarioCrearDto): Promise<UsuarioDto> => this.gateway.usuarios.create(payload),
    update: async (id: Guid, payload: UsuarioDto): Promise<UsuarioDto> => this.gateway.usuarios.update(id, payload),
    remove: async (id: Guid): Promise<void> => this.gateway.usuarios.remove(id),
  };

  perfiles = {
    getAll: async (): Promise<PerfilDto[]> => this.gateway.perfiles.getAll(),
    create: async (payload: PerfilDto): Promise<PerfilDto> => this.gateway.perfiles.create(payload),
    update: async (id: Guid, payload: PerfilDto): Promise<PerfilDto> => this.gateway.perfiles.update(id, payload),
    remove: async (id: Guid): Promise<void> => this.gateway.perfiles.remove(id),
  };

  permisos = {
    getMenu: async (idPerfil: Guid): Promise<ModuloDto[]> => this.gateway.permisos.getMenu(idPerfil),
    getPermisos: async (idPerfil: Guid): Promise<AsignarPermisosRequestDto> => this.gateway.permisos.getPermisos(idPerfil),
    setPermisos: async (payload: AsignarPermisosRequestDto): Promise<void> => this.gateway.permisos.setPermisos(payload),
  };

  modulos = {
    getAll: async (): Promise<ModuloDto[]> => this.gateway.modulos.getAll(),
    create: async (payload: ModuloDto): Promise<ModuloDto> => this.gateway.modulos.create(payload),
    update: async (id: Guid, payload: ModuloDto): Promise<ModuloDto> => this.gateway.modulos.update(id, payload),
    remove: async (id: Guid): Promise<void> => this.gateway.modulos.remove(id),
  };

  paginas = {
    getAll: async (params?: PaginationParams): Promise<PaginaDto[]> => this.gateway.paginas.getAll(params),
    create: async (payload: PaginaDto): Promise<PaginaDto> => this.gateway.paginas.create(payload),
    update: async (id: Guid, payload: PaginaDto): Promise<PaginaDto> => this.gateway.paginas.update(id, payload),
    remove: async (id: Guid): Promise<void> => this.gateway.paginas.remove(id),
  };

  botones = {
    getAll: async (params?: PaginationParams): Promise<BotonDto[]> => this.gateway.botones.getAll(params),
    create: async (payload: BotonDto): Promise<BotonDto> => this.gateway.botones.create(payload),
    update: async (id: Guid, payload: BotonDto): Promise<BotonDto> => this.gateway.botones.update(id, payload),
    remove: async (id: Guid): Promise<void> => this.gateway.botones.remove(id),
  };
}
