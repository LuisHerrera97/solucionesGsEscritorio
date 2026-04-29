import { API_ENDPOINTS_CREDITOS } from '../../../../config/apiEndpoints';
import { ApiService } from '../../../../http/apiService';
import { withQueryParams } from '../../../../utils/url';
import type { CorteCajaDto } from '../../../../../domain/creditos/cortes/types';
import type { ApiResponse } from '../../../../../domain/shared/ApiResponse';
import { unwrapApiResponse } from '../../../../http/unwrapApiResponse';

export const CortesService = {
  getAll: async (params: { fechaInicio?: string; fechaFin?: string }): Promise<CorteCajaDto[]> => {
    const url = withQueryParams(API_ENDPOINTS_CREDITOS.CORTES, params);
    const response = await ApiService.get({ url });
    return unwrapApiResponse(response.data as ApiResponse<CorteCajaDto[]>);
  },
};
