import { API_ENDPOINTS_SEGURIDAD } from '../../../config/apiEndpoints';
import { ApiService } from '../../../http/apiService';
import type { Guid, PerfilDto } from '../../../../domain/seguridad/types';
import { withRouteParams } from '../../../utils/url';
import type { ApiResponse } from '../../../../domain/shared/ApiResponse';
import { unwrapApiResponse } from '../../../http/unwrapApiResponse';

export const PerfilService = {
  getAll: async (): Promise<PerfilDto[]> => {
    const response = await ApiService.get({ url: API_ENDPOINTS_SEGURIDAD.PERFILES });
    return unwrapApiResponse(response.data as ApiResponse<PerfilDto[]>);
  },
  create: async (payload: PerfilDto): Promise<PerfilDto> => {
    const response = await ApiService.post({ url: API_ENDPOINTS_SEGURIDAD.PERFILES, data: payload });
    return unwrapApiResponse(response.data as ApiResponse<PerfilDto>);
  },
  update: async (idPerfil: Guid, payload: PerfilDto): Promise<PerfilDto> => {
    const url = withRouteParams(`${API_ENDPOINTS_SEGURIDAD.PERFILES}/{idPerfil}`, { idPerfil });
    const response = await ApiService.put({ url, data: payload });
    return unwrapApiResponse(response.data as ApiResponse<PerfilDto>);
  },
  remove: async (idPerfil: Guid): Promise<void> => {
    const url = withRouteParams(`${API_ENDPOINTS_SEGURIDAD.PERFILES}/{idPerfil}`, { idPerfil });
    const response = await ApiService.delete({ url });
    unwrapApiResponse(response.data as ApiResponse<boolean>);
  },
};
