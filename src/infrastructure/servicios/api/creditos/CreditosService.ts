import { API_ENDPOINTS_CREDITOS } from '../../../config/apiEndpoints';
import { ApiService } from '../../../http/apiService';
import type { AbonarFichaCreditoRequest, Credito, PenalizarFichaCreditoRequest } from '../../../../domain/creditos/types';
import { withQueryParams, withRouteParams } from '../../../utils/url';
import type { ApiResponse } from '../../../../domain/shared/ApiResponse';
import { unwrapApiResponse } from '../../../http/unwrapApiResponse';
import type { MovimientoCajaDto } from '../../../../domain/creditos/caja/types';

export type CreditoApi = Credito & {
  clienteNombre?: string;
  clienteApellido?: string;
  clienteNegocio?: string;
  clienteZona?: string;
  observacion?: string;
};

export const CreditosService = {
  getAll: async (params?: { searchTerm?: string; page?: number; pageSize?: number; zonaId?: string }): Promise<CreditoApi[]> => {
    const url = withQueryParams(API_ENDPOINTS_CREDITOS.CREDITOS, params ?? {});
    const response = await ApiService.get({ url });
    return unwrapApiResponse(response.data as ApiResponse<CreditoApi[]>);
  },
  getById: async (id: string): Promise<CreditoApi> => {
    const url = withRouteParams(API_ENDPOINTS_CREDITOS.CREDITO_BY_ID, { id });
    const response = await ApiService.get({ url });
    return unwrapApiResponse(response.data as ApiResponse<CreditoApi>);
  },
  getMovimientos: async (id: string): Promise<MovimientoCajaDto[]> => {
    const url = withRouteParams(API_ENDPOINTS_CREDITOS.CREDITO_MOVIMIENTOS, { id });
    const response = await ApiService.get({ url });
    return unwrapApiResponse(response.data as ApiResponse<MovimientoCajaDto[]>);
  },
  create: async (payload: {
    clienteId: string;
    monto: number;
    plazo: number;
    tipo: 'diario' | 'semanal' | 'mensual';
    permitirDomingo?: boolean;
    aplicarFeriados?: boolean;
    tasaManual?: number;
    observacion?: string;
  }): Promise<CreditoApi> => {
    const response = await ApiService.post({ url: API_ENDPOINTS_CREDITOS.CREDITOS, data: payload });
    return unwrapApiResponse(response.data as ApiResponse<CreditoApi>);
  },
  abonarFicha: async (payload: AbonarFichaCreditoRequest): Promise<CreditoApi> => {
    const url = withRouteParams(API_ENDPOINTS_CREDITOS.ABONO_FICHA, {
      creditoId: payload.creditoId,
      numeroFicha: String(payload.numeroFicha),
    });
    const response = await ApiService.post({
      url,
      data: {
        idempotencyKey: payload.idempotencyKey,
        montoAbono: payload.montoAbono,
        medio: payload.medio,
        montoEfectivo: payload.montoEfectivo,
        montoTransferencia: payload.montoTransferencia,
      },
    });
    return unwrapApiResponse(response.data as ApiResponse<CreditoApi>);
  },
  penalizarFicha: async (payload: PenalizarFichaCreditoRequest): Promise<CreditoApi> => {
    const url = withRouteParams(API_ENDPOINTS_CREDITOS.MULTA_FICHA, {
      creditoId: payload.creditoId,
      numeroFicha: String(payload.numeroFicha),
    });
    const response = await ApiService.post({
      url,
      data: {
        monto: payload.monto,
        idempotencyKey: payload.idempotencyKey,
      },
    });
    return unwrapApiResponse(response.data as ApiResponse<CreditoApi>);
  },
  reestructurar: async (payload: {
    creditoId: string;
    nuevoMonto: number;
    nuevoPlazo: number;
    tipo: 'diario' | 'semanal' | 'mensual';
  }): Promise<CreditoApi> => {
    const url = withRouteParams(API_ENDPOINTS_CREDITOS.REESTRUCTURAR, { creditoId: payload.creditoId });
    const response = await ApiService.put({
      url,
      data: {
        creditoId: payload.creditoId,
        nuevoMonto: payload.nuevoMonto,
        nuevoPlazo: payload.nuevoPlazo,
        tipo: payload.tipo,
      },
    });
    return unwrapApiResponse(response.data as ApiResponse<CreditoApi>);
  },
  condonarInteres: async (payload: { creditoId: string; numeroFicha: number }): Promise<string> => {
    const url = withRouteParams(API_ENDPOINTS_CREDITOS.CONDONAR_INTERES, {
      creditoId: payload.creditoId,
      numeroFicha: String(payload.numeroFicha),
    });
    const response = await ApiService.post({ url });
    return unwrapApiResponse(response.data as ApiResponse<string>);
  },
  condonarInteresMonto: async (payload: { creditoId: string; monto: number }): Promise<string> => {
    const url = withRouteParams(API_ENDPOINTS_CREDITOS.CONDONAR_INTERES_MONTO, { creditoId: payload.creditoId });
    const response = await ApiService.post({ url, data: { monto: payload.monto } });
    return unwrapApiResponse(response.data as ApiResponse<string>);
  },
  actualizarObservacion: async (payload: { creditoId: string; observacion: string }): Promise<string> => {
    const url = withRouteParams(API_ENDPOINTS_CREDITOS.ACTUALIZAR_OBSERVACION, { creditoId: payload.creditoId });
    const response = await ApiService.put({ url, data: { observacion: payload.observacion } });
    return unwrapApiResponse(response.data as ApiResponse<string>);
  },
  aplicarMora: async (): Promise<number> => {
    const response = await ApiService.post({ url: API_ENDPOINTS_CREDITOS.APLICAR_MORA });
    return unwrapApiResponse(response.data as ApiResponse<number>);
  },
};
