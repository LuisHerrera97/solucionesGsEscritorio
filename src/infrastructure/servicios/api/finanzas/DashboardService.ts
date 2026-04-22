import { API_ENDPOINTS_FINANZAS } from '../../../config/apiEndpoints';
import { ApiService } from '../../../http/apiService';
import type { DashboardResumenDto } from '../../../../domain/finanzas/types';
import type { ApiResponse } from '../../../../domain/shared/ApiResponse';
import { unwrapApiResponse } from '../../../http/unwrapApiResponse';
import { withQueryParams } from '../../../utils/url';

export class DashboardService {
  static async getResumen(params?: { zonaId?: string }): Promise<DashboardResumenDto> {
    const url = withQueryParams(API_ENDPOINTS_FINANZAS.DASHBOARD_RESUMEN, params ?? {});
    const response = await ApiService.get({ url });
    return unwrapApiResponse(response.data as ApiResponse<DashboardResumenDto>);
  }
}
