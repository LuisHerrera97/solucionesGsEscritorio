import type { GeneralGateway } from '../../../application/general/generalAppService';
import { ConfiguracionSistemaService } from '../../servicios/api/general/ConfiguracionSistemaService';
import { AuditoriaService } from '../../servicios/api/general/AuditoriaService';
import { FeriadosService } from '../../servicios/api/general/FeriadosService';
import { ZonasCobranzaService } from '../../servicios/api/general/ZonasCobranzaService';

export const createGeneralGateway = (): GeneralGateway => {
  return {
    configuracion: {
      get: ConfiguracionSistemaService.get,
      update: ConfiguracionSistemaService.update,
    },
    zonasCobranza: {
      getAll: ZonasCobranzaService.getAll,
      create: ZonasCobranzaService.create,
      update: ZonasCobranzaService.update,
      remove: ZonasCobranzaService.remove,
    },
    auditoria: {
      get: AuditoriaService.get,
      getFiltrosOpciones: AuditoriaService.getFiltrosOpciones,
    },
    feriados: {
      getAll: FeriadosService.getAll,
      create: FeriadosService.create,
      update: FeriadosService.update,
      remove: FeriadosService.remove,
    },
  };
};
