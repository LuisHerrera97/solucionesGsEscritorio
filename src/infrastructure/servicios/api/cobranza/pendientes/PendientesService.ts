import { API_ENDPOINTS_COBRANZA } from '../../../../config/apiEndpoints';
import { ApiService } from '../../../../http/apiService';
import { withQueryParams } from '../../../../utils/url';
import type { PendientesListadoDto } from '../../../../../domain/cobranza/pendientes/types';
import type { ApiResponse } from '../../../../../domain/shared/ApiResponse';
import { unwrapApiResponse } from '../../../../http/unwrapApiResponse';

export const PendientesService = {
  getPage: async (params: {
    busqueda?: string;
    page?: number;
    pageSize?: number;
    zonaId?: string;
  }): Promise<PendientesListadoDto> => {
    const url = withQueryParams(API_ENDPOINTS_COBRANZA.PENDIENTES, {
      busqueda: params.busqueda,
      page: params.page,
      pageSize: params.pageSize,
      zonaId: params.zonaId,
    });
    const response = await ApiService.get({ url });
    return unwrapApiResponse(response.data as ApiResponse<PendientesListadoDto>);
  },
};
