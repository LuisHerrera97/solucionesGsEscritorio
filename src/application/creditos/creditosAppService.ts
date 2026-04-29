import type { AbonarFichaCreditoRequest, Cliente, ClientesListado, Credito, DashboardResumenDto, PenalizarFichaCreditoRequest } from '../../domain/creditos/types';
import type { MovimientoCajaDto } from '../../domain/creditos/caja/types';
import type { CorteCajaDto } from '../../domain/creditos/cortes/types';

export type CreditoApi = Credito & {
  clienteNombre?: string;
  clienteApellido?: string;
  clienteNegocio?: string;
  clienteZona?: string;
  observacion?: string;
};

export type PaginationParams = {
  page?: number;
  pageSize?: number;
};

export type ClientesQueryParams = PaginationParams & {
  buscar?: string;
};

export type CreditosGateway = {
  clientes: {
    getAll: (params?: ClientesQueryParams) => Promise<ClientesListado>;
    create: (payload: Omit<Cliente, 'id'>) => Promise<Cliente>;
    update: (id: string, payload: Omit<Cliente, 'id'>) => Promise<Cliente>;
    delete: (id: string) => Promise<void>;
  };
  creditos: {
    getAll: (params?: { searchTerm?: string; page?: number; pageSize?: number }) => Promise<CreditoApi[]>;
    getById: (id: string) => Promise<CreditoApi>;
    create: (payload: {
      clienteId: string;
      monto: number;
      plazo: number;
      tipo: 'diario' | 'semanal' | 'mensual';
      permitirDomingo?: boolean;
      aplicarFeriados?: boolean;
      tasaManual?: number;
      observacion?: string;
    }) => Promise<CreditoApi>;
    abonarFicha: (payload: AbonarFichaCreditoRequest) => Promise<CreditoApi>;
    penalizarFicha: (payload: PenalizarFichaCreditoRequest) => Promise<CreditoApi>;
    reestructurar: (payload: { creditoId: string; nuevoMonto: number; nuevoPlazo: number; tipo: 'diario' | 'semanal' | 'mensual' }) => Promise<CreditoApi>;
    condonarInteres: (payload: { creditoId: string; numeroFicha: number }) => Promise<string>;
    condonarInteresMonto: (payload: { creditoId: string; monto: number }) => Promise<string>;
    actualizarObservacion: (payload: { creditoId: string; observacion: string }) => Promise<string>;
    aplicarMora: () => Promise<number>;
    getMovimientos: (id: string) => Promise<MovimientoCajaDto[]>;
  };
  cortes: {
    getAll: (params: { fechaInicio?: string; fechaFin?: string }) => Promise<CorteCajaDto[]>;
  };
  dashboard: {
    getResumen: (params?: { zonaId?: string }) => Promise<DashboardResumenDto>;
    getMovimientosEnRango: (params: { fechaDesde: string; fechaHasta: string; zonaId?: string; cobradorId?: string }) => Promise<MovimientoCajaDto[]>;
  };
}

export class CreditosAppService {
  private readonly gateway: CreditosGateway;

  constructor(gateway: CreditosGateway) {
    this.gateway = gateway;
  }

  clientes = {
    getAll: async (params?: ClientesQueryParams): Promise<ClientesListado> => this.gateway.clientes.getAll(params),
    create: async (payload: Omit<Cliente, 'id'>): Promise<Cliente> => this.gateway.clientes.create(payload),
    update: async (id: string, payload: Omit<Cliente, 'id'>): Promise<Cliente> => this.gateway.clientes.update(id, payload),
    delete: async (id: string): Promise<void> => this.gateway.clientes.delete(id),
  };

  creditos = {
    getAll: async (params?: { searchTerm?: string; page?: number; pageSize?: number }): Promise<CreditoApi[]> => this.gateway.creditos.getAll(params),
    getById: async (id: string): Promise<CreditoApi> => this.gateway.creditos.getById(id),
    create: async (payload: {
      clienteId: string;
      monto: number;
      plazo: number;
      tipo: 'diario' | 'semanal' | 'mensual';
      permitirDomingo?: boolean;
      aplicarFeriados?: boolean;
      tasaManual?: number;
      observacion?: string;
    }): Promise<CreditoApi> => this.gateway.creditos.create(payload),
    abonarFicha: async (payload: AbonarFichaCreditoRequest): Promise<CreditoApi> => this.gateway.creditos.abonarFicha(payload),
    penalizarFicha: async (payload: PenalizarFichaCreditoRequest): Promise<CreditoApi> => this.gateway.creditos.penalizarFicha(payload),
    reestructurar: async (payload: { creditoId: string; nuevoMonto: number; nuevoPlazo: number; tipo: 'diario' | 'semanal' | 'mensual' }): Promise<CreditoApi> =>
      this.gateway.creditos.reestructurar(payload),
    condonarInteres: async (payload: { creditoId: string; numeroFicha: number }): Promise<string> =>
      this.gateway.creditos.condonarInteres(payload),
    condonarInteresMonto: async (payload: { creditoId: string; monto: number }): Promise<string> =>
      this.gateway.creditos.condonarInteresMonto(payload),
    actualizarObservacion: async (payload: { creditoId: string; observacion: string }): Promise<string> =>
      this.gateway.creditos.actualizarObservacion(payload),
    aplicarMora: async (): Promise<number> => this.gateway.creditos.aplicarMora(),
    getMovimientos: async (id: string): Promise<MovimientoCajaDto[]> => this.gateway.creditos.getMovimientos(id),
  };

  cortes = {
    getAll: async (params: { fechaInicio?: string; fechaFin?: string }): Promise<CorteCajaDto[]> => this.gateway.cortes.getAll(params),
  };
  dashboard = {
    getResumen: async (params?: { zonaId?: string }): Promise<DashboardResumenDto> => this.gateway.dashboard.getResumen(params),
    getMovimientosEnRango: async (params: { fechaDesde: string; fechaHasta: string; zonaId?: string; cobradorId?: string }): Promise<MovimientoCajaDto[]> =>
      this.gateway.dashboard.getMovimientosEnRango(params),
  };

}
