import type { CobranzaGateway } from '../../../application/cobranza/cobranzaAppService';

import { CobranzaService } from '../../servicios/api/cobranza/cobranza/CobranzaService';
import { PendientesService } from '../../servicios/api/cobranza/pendientes/PendientesService';

export const createCobranzaGateway = (): CobranzaGateway => {
  return {
    pendientes: {
      getPage: PendientesService.getPage,
    },

    cobranza: {
      getAll: CobranzaService.getAll,
    },
  };
};
