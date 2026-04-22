import { API_ENDPOINTS_COBRANZA } from '../../../../config/apiEndpoints';
import { ApiService } from '../../../../http/apiService';
import type { ApiResponse } from '../../../../../domain/shared/ApiResponse';
import { unwrapApiResponse } from '../../../../http/unwrapApiResponse';
import type { CrearLiquidacionCobranzaRequestDto, LiquidacionCobranzaDto, LiquidacionPendienteResumenDto } from '../../../../../domain/cobranza/liquidaciones/types';
import type { MovimientoCajaDto, ResumenLiquidacionesCajaDto } from '../../../../../domain/finanzas/caja/types';
import { withQueryParams, withRouteParams } from '../../../../utils/url';

export const LiquidacionesService = {
  getResumenPendiente: async (): Promise<LiquidacionPendienteResumenDto> => {
    const response = await ApiService.get({ url: API_ENDPOINTS_COBRANZA.LIQUIDACIONES_RESUMEN_PENDIENTE });
    return unwrapApiResponse(response.data as ApiResponse<LiquidacionPendienteResumenDto>);
  },
  crear: async (payload: CrearLiquidacionCobranzaRequestDto): Promise<LiquidacionCobranzaDto> => {
    const response = await ApiService.post({ url: API_ENDPOINTS_COBRANZA.LIQUIDACIONES, data: payload });
    return unwrapApiResponse(response.data as ApiResponse<LiquidacionCobranzaDto>);
  },
  getHistorial: async (fechaInicio?: string, fechaFin?: string): Promise<LiquidacionCobranzaDto[]> => {
    const url = withQueryParams(API_ENDPOINTS_COBRANZA.LIQUIDACIONES_HISTORIAL, { fechaInicio, fechaFin });
    const response = await ApiService.get({ url });
    return unwrapApiResponse(response.data as ApiResponse<LiquidacionCobranzaDto[]>);
  },
  getAll: async (fechaInicio?: string, fechaFin?: string, zonaId?: string): Promise<LiquidacionCobranzaDto[]> => {
    const url = withQueryParams(API_ENDPOINTS_COBRANZA.LIQUIDACIONES_ALL, { fechaInicio, fechaFin, zonaId });
    const response = await ApiService.get({ url });
    return unwrapApiResponse(response.data as ApiResponse<LiquidacionCobranzaDto[]>);
  },
  getCobradoresResumen: async (params: { fechaDesde: string; fechaHasta: string; zonaId?: string }): Promise<ResumenLiquidacionesCajaDto> => {
    const url = withQueryParams(API_ENDPOINTS_COBRANZA.LIQUIDACIONES_COBRADORES_RESUMEN, params);
    const response = await ApiService.get({ url });
    return unwrapApiResponse(response.data as ApiResponse<ResumenLiquidacionesCajaDto>);
  },
  getMovimientosPendientesCobrador: async (cobradorId: string, fecha?: string): Promise<MovimientoCajaDto[]> => {
    const base = withRouteParams(API_ENDPOINTS_COBRANZA.LIQUIDACIONES_COBRADOR_MOVIMIENTOS_PENDIENTES, { cobradorId });
    const url = withQueryParams(base, { fecha });
    const response = await ApiService.get({ url });
    return unwrapApiResponse(response.data as ApiResponse<MovimientoCajaDto[]>);
  },
  confirmar: async (id: string): Promise<void> => {
    const response = await ApiService.post({ url: API_ENDPOINTS_COBRANZA.LIQUIDACIONES_CONFIRMAR.replace('{id}', id) });
    return unwrapApiResponse(response.data as ApiResponse<void>);
  },
  rechazar: async (id: string): Promise<void> => {
    const response = await ApiService.post({ url: API_ENDPOINTS_COBRANZA.LIQUIDACIONES_RECHAZAR.replace('{id}', id) });
    return unwrapApiResponse(response.data as ApiResponse<void>);
  },
};
