import { API_ENDPOINTS_GENERAL } from '../../../config/apiEndpoints';
import { ApiService } from '../../../http/apiService';
import type { ApiResponse } from '../../../../domain/shared/ApiResponse';
import { unwrapApiResponse } from '../../../http/unwrapApiResponse';
import type { AuditoriaEventoDto, AuditoriaFiltrosOpcionesDto } from '../../../../domain/general/auditoria';
import { withQueryParams } from '../../../utils/url';

export const AuditoriaService = {
  get: async (params: {
    desdeUtc?: string;
    hastaUtc?: string;
    usuarioId?: string;
    accion?: string;
    entidadTipo?: string;
    entidadId?: string;
    page?: number;
    pageSize?: number;
  }): Promise<AuditoriaEventoDto[]> => {
    const url = withQueryParams(API_ENDPOINTS_GENERAL.AUDITORIA, params);
    const response = await ApiService.get({ url });
    return unwrapApiResponse(response.data as ApiResponse<AuditoriaEventoDto[]>);
  },

  getFiltrosOpciones: async (params: { desdeUtc: string; hastaUtc: string }): Promise<AuditoriaFiltrosOpcionesDto> => {
    const url = withQueryParams(`${API_ENDPOINTS_GENERAL.AUDITORIA}/filtros`, params);
    const response = await ApiService.get({ url });
    return unwrapApiResponse(response.data as ApiResponse<AuditoriaFiltrosOpcionesDto>);
  },
};

