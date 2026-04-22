import { API_ENDPOINTS_COBRANZA } from '../../../../config/apiEndpoints';
import { ApiService } from '../../../../http/apiService';
import { withQueryParams } from '../../../../utils/url';
import type { MovimientoCobranzaDto } from '../../../../../domain/cobranza/cobranza/types';
import type { ApiResponse } from '../../../../../domain/shared/ApiResponse';
import { unwrapApiResponse } from '../../../../http/unwrapApiResponse';

export const CobranzaService = {
  getAll: async (params: { fechaInicio?: string; fechaFin?: string; busqueda?: string; zonaId?: string }): Promise<MovimientoCobranzaDto[]> => {
    const url = withQueryParams(API_ENDPOINTS_COBRANZA.COBRANZA, params);
    const response = await ApiService.get({ url });
    return unwrapApiResponse(response.data as ApiResponse<MovimientoCobranzaDto[]>);
  },
};
