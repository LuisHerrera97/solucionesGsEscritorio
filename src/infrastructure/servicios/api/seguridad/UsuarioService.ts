import { API_ENDPOINTS_SEGURIDAD } from '../../../config/apiEndpoints';
import { ApiService } from '../../../http/apiService';
import type { Guid, ResetPasswordAdminRequestDto, UsuarioDto, UsuarioCrearDto } from '../../../../domain/seguridad/types';
import { withRouteParams } from '../../../utils/url';
import type { ApiResponse } from '../../../../domain/shared/ApiResponse';
import { unwrapApiResponse } from '../../../http/unwrapApiResponse';

export const UsuarioService = {
  getAll: async (): Promise<UsuarioDto[]> => {
    const response = await ApiService.get({ url: API_ENDPOINTS_SEGURIDAD.USUARIOS });
    return unwrapApiResponse(response.data as ApiResponse<UsuarioDto[]>);
  },
  getById: async (id: Guid): Promise<UsuarioDto> => {
    const url = withRouteParams(`${API_ENDPOINTS_SEGURIDAD.USUARIOS}/{id}`, { id });
    const response = await ApiService.get({ url });
    return unwrapApiResponse(response.data as ApiResponse<UsuarioDto>);
  },
  create: async (payload: UsuarioCrearDto): Promise<UsuarioDto> => {
    const response = await ApiService.post({ url: API_ENDPOINTS_SEGURIDAD.USUARIOS, data: payload });
    return unwrapApiResponse(response.data as ApiResponse<UsuarioDto>);
  },
  update: async (id: Guid, payload: UsuarioDto): Promise<UsuarioDto> => {
    const url = withRouteParams(`${API_ENDPOINTS_SEGURIDAD.USUARIOS}/{id}`, { id });
    const response = await ApiService.put({ url, data: payload });
    return unwrapApiResponse(response.data as ApiResponse<UsuarioDto>);
  },
  remove: async (id: Guid): Promise<void> => {
    const url = withRouteParams(`${API_ENDPOINTS_SEGURIDAD.USUARIOS}/{id}`, { id });
    const response = await ApiService.delete({ url });
    unwrapApiResponse(response.data as ApiResponse<boolean>);
  },
  resetPasswordAdmin: async (id: Guid, payload: ResetPasswordAdminRequestDto): Promise<void> => {
    const url = withRouteParams(API_ENDPOINTS_SEGURIDAD.USUARIOS_RESET_PASSWORD, { id });
    const response = await ApiService.post({ url, data: payload });
    unwrapApiResponse(response.data as ApiResponse<boolean>);
  },
};
