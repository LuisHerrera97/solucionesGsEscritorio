import type { MovimientoCobranzaDto } from '../../domain/cobranza/cobranza/types';
import type { PendientesListadoDto } from '../../domain/cobranza/pendientes/types';

export type CobranzaGateway = {
  pendientes: {
    getPage: (params: { busqueda?: string; page?: number; pageSize?: number; zonaId?: string }) => Promise<PendientesListadoDto>;
  };

  cobranza: {
    getAll: (params: { fechaInicio?: string; fechaFin?: string; busqueda?: string; zonaId?: string }) => Promise<MovimientoCobranzaDto[]>;
  };
};

export class CobranzaAppService {
  private readonly gateway: CobranzaGateway;

  constructor(gateway: CobranzaGateway) {
    this.gateway = gateway;
  }

  pendientes = {
    getPage: async (params: { busqueda?: string; page?: number; pageSize?: number; zonaId?: string }): Promise<PendientesListadoDto> =>
      this.gateway.pendientes.getPage(params),
  };

  cobranza = {
    getAll: async (params: { fechaInicio?: string; fechaFin?: string; busqueda?: string; zonaId?: string }): Promise<MovimientoCobranzaDto[]> =>
      this.gateway.cobranza.getAll(params),
  };
}
