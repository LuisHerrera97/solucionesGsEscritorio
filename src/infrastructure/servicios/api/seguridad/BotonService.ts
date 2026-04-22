import { API_ENDPOINTS_SEGURIDAD } from '../../../config/apiEndpoints';
import { ApiService } from '../../../http/apiService';
import { withQueryParams, withRouteParams } from '../../../utils/url';
import type { BotonDto, Guid } from '../../../../domain/seguridad/types';
import type { ApiResponse } from '../../../../domain/shared/ApiResponse';
import { unwrapApiResponse } from '../../../http/unwrapApiResponse';

export const BotonService = {
  getAll: async (params?: { page?: number; pageSize?: number }): Promise<BotonDto[]> => {
    const url = withQueryParams(API_ENDPOINTS_SEGURIDAD.BOTONES, params ?? {});
    const response = await ApiService.get({ url });
    return unwrapApiResponse(response.data as ApiResponse<BotonDto[]>);
  },
  create: async (payload: BotonDto): Promise<BotonDto> => {
    const response = await ApiService.post({ url: API_ENDPOINTS_SEGURIDAD.BOTONES, data: payload });
    return unwrapApiResponse(response.data as ApiResponse<BotonDto>);
  },
  update: async (idBoton: Guid, payload: BotonDto): Promise<BotonDto> => {
    const url = withRouteParams(`${API_ENDPOINTS_SEGURIDAD.BOTONES}/{idBoton}`, { idBoton });
    const response = await ApiService.put({ url, data: payload });
    return unwrapApiResponse(response.data as ApiResponse<BotonDto>);
  },
  remove: async (idBoton: Guid): Promise<void> => {
    const url = withRouteParams(`${API_ENDPOINTS_SEGURIDAD.BOTONES}/{idBoton}`, { idBoton });
    const response = await ApiService.delete({ url });
    unwrapApiResponse(response.data as ApiResponse<boolean>);
  },
};
