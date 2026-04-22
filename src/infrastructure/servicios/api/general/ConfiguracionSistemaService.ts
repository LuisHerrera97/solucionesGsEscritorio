import { API_ENDPOINTS_GENERAL } from '../../../config/apiEndpoints';
import { ApiService } from '../../../http/apiService';
import type { ConfiguracionSistemaDto } from '../../../../domain/general/types';
import type { ApiResponse } from '../../../../domain/shared/ApiResponse';
import { unwrapApiResponse } from '../../../http/unwrapApiResponse';

export const ConfiguracionSistemaService = {
  get: async (): Promise<ConfiguracionSistemaDto> => {
    const response = await ApiService.get({ url: API_ENDPOINTS_GENERAL.CONFIGURACION });
    return unwrapApiResponse(response.data as ApiResponse<ConfiguracionSistemaDto>);
  },
  update: async (payload: ConfiguracionSistemaDto): Promise<ConfiguracionSistemaDto> => {
    const response = await ApiService.put({ url: API_ENDPOINTS_GENERAL.CONFIGURACION, data: payload });
    return unwrapApiResponse(response.data as ApiResponse<ConfiguracionSistemaDto>);
  },
};
