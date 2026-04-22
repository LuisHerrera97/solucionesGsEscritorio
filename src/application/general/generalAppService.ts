import type { Guid, ZonaCobranzaDto, ConfiguracionSistemaDto } from '../../domain/general/types';
import type { AuditoriaEventoDto, AuditoriaFiltrosOpcionesDto } from '../../domain/general/auditoria';
import type { FeriadoDto } from '../../domain/general/feriados';

export type GeneralGateway = {
  configuracion: {
    get: () => Promise<ConfiguracionSistemaDto>;
    update: (payload: ConfiguracionSistemaDto) => Promise<ConfiguracionSistemaDto>;
  };
  zonasCobranza: {
    getAll: () => Promise<ZonaCobranzaDto[]>;
    create: (payload: Pick<ZonaCobranzaDto, 'nombre' | 'orden'>) => Promise<ZonaCobranzaDto>;
    update: (id: Guid, payload: ZonaCobranzaDto) => Promise<ZonaCobranzaDto>;
    remove: (id: Guid) => Promise<void>;
  };
  auditoria: {
    get: (params: {
      desdeUtc?: string;
      hastaUtc?: string;
      usuarioId?: string;
      accion?: string;
      entidadTipo?: string;
      entidadId?: string;
      page?: number;
      pageSize?: number;
    }) => Promise<AuditoriaEventoDto[]>;
    getFiltrosOpciones: (params: { desdeUtc: string; hastaUtc: string }) => Promise<AuditoriaFiltrosOpcionesDto>;
  };
  feriados: {
    getAll: () => Promise<FeriadoDto[]>;
    create: (payload: Pick<FeriadoDto, 'fecha' | 'nombre' | 'activo'>) => Promise<FeriadoDto>;
    update: (id: Guid, payload: Pick<FeriadoDto, 'fecha' | 'nombre' | 'activo'>) => Promise<FeriadoDto>;
    remove: (id: Guid) => Promise<void>;
  };
};

export class GeneralAppService {
  private readonly gateway: GeneralGateway;

  constructor(gateway: GeneralGateway) {
    this.gateway = gateway;
  }

  configuracion = {
    get: async (): Promise<ConfiguracionSistemaDto> => this.gateway.configuracion.get(),
    update: async (payload: ConfiguracionSistemaDto): Promise<ConfiguracionSistemaDto> => this.gateway.configuracion.update(payload),
  };

  zonasCobranza = {
    getAll: async (): Promise<ZonaCobranzaDto[]> => this.gateway.zonasCobranza.getAll(),
    create: async (payload: Pick<ZonaCobranzaDto, 'nombre' | 'orden'>): Promise<ZonaCobranzaDto> => this.gateway.zonasCobranza.create(payload),
    update: async (id: Guid, payload: ZonaCobranzaDto): Promise<ZonaCobranzaDto> => this.gateway.zonasCobranza.update(id, payload),
    remove: async (id: Guid): Promise<void> => this.gateway.zonasCobranza.remove(id),
  };

  auditoria = {
    get: async (params: {
      desdeUtc?: string;
      hastaUtc?: string;
      usuarioId?: string;
      accion?: string;
      entidadTipo?: string;
      entidadId?: string;
      page?: number;
      pageSize?: number;
    }): Promise<AuditoriaEventoDto[]> => this.gateway.auditoria.get(params),
    getFiltrosOpciones: async (params: { desdeUtc: string; hastaUtc: string }): Promise<AuditoriaFiltrosOpcionesDto> =>
      this.gateway.auditoria.getFiltrosOpciones(params),
  };

  feriados = {
    getAll: async (): Promise<FeriadoDto[]> => this.gateway.feriados.getAll(),
    create: async (payload: Pick<FeriadoDto, 'fecha' | 'nombre' | 'activo'>): Promise<FeriadoDto> => this.gateway.feriados.create(payload),
    update: async (id: Guid, payload: Pick<FeriadoDto, 'fecha' | 'nombre' | 'activo'>): Promise<FeriadoDto> => this.gateway.feriados.update(id, payload),
    remove: async (id: Guid): Promise<void> => this.gateway.feriados.remove(id),
  };
}
