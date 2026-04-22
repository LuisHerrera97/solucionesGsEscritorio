import { API_ENDPOINTS_SEGURIDAD } from '../../../config/apiEndpoints';
import { ApiService } from '../../../http/apiService';
import type {
  AutenticacionRequestDto,
  AutenticacionResponseDto,
  CambiarPasswordRequestDto,
  RefreshTokenRequestDto,
} from '../../../../domain/seguridad/types';
import type { ApiResponse } from '../../../../domain/shared/ApiResponse';
import { unwrapApiResponse } from '../../../http/unwrapApiResponse';

export const AuthService = {
  login: async (payload: AutenticacionRequestDto): Promise<AutenticacionResponseDto> => {
    const response = await ApiService.post({ url: API_ENDPOINTS_SEGURIDAD.LOGIN, data: payload });
    return unwrapApiResponse(response.data as ApiResponse<AutenticacionResponseDto>);
  },
  refresh: async (payload: RefreshTokenRequestDto): Promise<AutenticacionResponseDto> => {
    const response = await ApiService.post({ url: API_ENDPOINTS_SEGURIDAD.REFRESH, data: payload });
    return unwrapApiResponse(response.data as ApiResponse<AutenticacionResponseDto>);
  },
  cambiarPassword: async (payload: CambiarPasswordRequestDto): Promise<void> => {
    const response = await ApiService.post({ url: API_ENDPOINTS_SEGURIDAD.CAMBIAR_PASSWORD, data: payload });
    unwrapApiResponse(response.data as ApiResponse<unknown>);
  },
};
