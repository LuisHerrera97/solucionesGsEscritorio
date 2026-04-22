import { API_ENDPOINTS_SEGURIDAD } from '../../../config/apiEndpoints';
import { ApiService } from '../../../http/apiService';
import { withQueryParams, withRouteParams } from '../../../utils/url';
import type { Guid, PaginaDto } from '../../../../domain/seguridad/types';
import type { ApiResponse } from '../../../../domain/shared/ApiResponse';
import { unwrapApiResponse } from '../../../http/unwrapApiResponse';

export const PaginaService = {
  getAll: async (params?: { page?: number; pageSize?: number }): Promise<PaginaDto[]> => {
    const url = withQueryParams(API_ENDPOINTS_SEGURIDAD.PAGINAS, params ?? {});
    const response = await ApiService.get({ url });
    return unwrapApiResponse(response.data as ApiResponse<PaginaDto[]>);
  },
  create: async (payload: PaginaDto): Promise<PaginaDto> => {
    const response = await ApiService.post({ url: API_ENDPOINTS_SEGURIDAD.PAGINAS, data: payload });
    return unwrapApiResponse(response.data as ApiResponse<PaginaDto>);
  },
  update: async (idPagina: Guid, payload: PaginaDto): Promise<PaginaDto> => {
    const url = withRouteParams(`${API_ENDPOINTS_SEGURIDAD.PAGINAS}/{idPagina}`, { idPagina });
    const response = await ApiService.put({ url, data: payload });
    return unwrapApiResponse(response.data as ApiResponse<PaginaDto>);
  },
  remove: async (idPagina: Guid): Promise<void> => {
    const url = withRouteParams(`${API_ENDPOINTS_SEGURIDAD.PAGINAS}/{idPagina}`, { idPagina });
    const response = await ApiService.delete({ url });
    unwrapApiResponse(response.data as ApiResponse<boolean>);
  },
};
