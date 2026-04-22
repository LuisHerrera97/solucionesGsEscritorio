import { API_ENDPOINTS_FINANZAS } from '../../../../config/apiEndpoints';
import { ApiService } from '../../../../http/apiService';
import { withQueryParams } from '../../../../utils/url';
import type {
  MovimientoCajaDto,
  MarcarRecibidoCajaRequestDto,
  RealizarCorteRequestDto,
  ResumenLiquidacionesCajaDto,
} from '../../../../../domain/finanzas/caja/types';
import type { CorteCajaDto } from '../../../../../domain/finanzas/cortes/types';
import type { ApiResponse } from '../../../../../domain/shared/ApiResponse';
import { unwrapApiResponse } from '../../../../http/unwrapApiResponse';

export const CajaService = {
  getTurno: async (params?: { fecha?: string }): Promise<MovimientoCajaDto[]> => {
    const url = withQueryParams(API_ENDPOINTS_FINANZAS.CAJA_TURNO, params?.fecha ? { fecha: params.fecha } : {});
    const response = await ApiService.get({ url });
    return unwrapApiResponse(response.data as ApiResponse<MovimientoCajaDto[]>);
  },
  getMovimientosEnRango: async (params: { fechaDesde: string; fechaHasta: string; zonaId?: string; cobradorId?: string }): Promise<MovimientoCajaDto[]> => {
    const url = withQueryParams(API_ENDPOINTS_FINANZAS.CAJA_MOVIMIENTOS, params);
    const response = await ApiService.get({ url });
    return unwrapApiResponse(response.data as ApiResponse<MovimientoCajaDto[]>);
  },
  getResumenLiquidaciones: async (params: { fechaDesde: string; fechaHasta: string; zonaId?: string; cobradorId?: string }): Promise<ResumenLiquidacionesCajaDto> => {
    const url = withQueryParams(API_ENDPOINTS_FINANZAS.CAJA_LIQUIDACIONES_RESUMEN, params);
    const response = await ApiService.get({ url });
    return unwrapApiResponse(response.data as ApiResponse<ResumenLiquidacionesCajaDto>);
  },

  realizarCorte: async (payload: RealizarCorteRequestDto): Promise<CorteCajaDto> => {
    const response = await ApiService.post({ url: API_ENDPOINTS_FINANZAS.CAJA_CORTE, data: payload });
    return unwrapApiResponse(response.data as ApiResponse<CorteCajaDto>);
  },
  marcarMovimientosRecibidoCaja: async (payload: MarcarRecibidoCajaRequestDto): Promise<{ marcados: number }> => {
    const response = await ApiService.post({ url: API_ENDPOINTS_FINANZAS.CAJA_MOVIMIENTOS_MARCAR_RECIBIDO, data: payload });
    return unwrapApiResponse(response.data as ApiResponse<{ marcados: number }>);
  },
};
