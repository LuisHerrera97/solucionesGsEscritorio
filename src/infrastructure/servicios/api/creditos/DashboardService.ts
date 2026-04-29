import { API_ENDPOINTS_CREDITOS } from '../../../config/apiEndpoints';
import { ApiService } from '../../../http/apiService';
import type { DashboardResumenDto } from '../../../../domain/creditos/types';
import type { MovimientoCajaDto } from '../../../../domain/creditos/caja/types';
import type { ApiResponse } from '../../../../domain/shared/ApiResponse';
import { unwrapApiResponse } from '../../../http/unwrapApiResponse';
import { withQueryParams } from '../../../utils/url';

export class DashboardService {
  static async getResumen(params?: { zonaId?: string }): Promise<DashboardResumenDto> {
    const url = withQueryParams(API_ENDPOINTS_CREDITOS.DASHBOARD_RESUMEN, params ?? {});
    const response = await ApiService.get({ url });
    return unwrapApiResponse(response.data as ApiResponse<DashboardResumenDto>);
  }

  static async getMovimientosEnRango(params: {
    fechaDesde: string;
    fechaHasta: string;
    zonaId?: string;
    cobradorId?: string;
  }): Promise<MovimientoCajaDto[]> {
    const url = withQueryParams(API_ENDPOINTS_CREDITOS.DASHBOARD_MOVIMIENTOS, params);
    const response = await ApiService.get({ url });
    return unwrapApiResponse(response.data as ApiResponse<MovimientoCajaDto[]>);
  }
}
