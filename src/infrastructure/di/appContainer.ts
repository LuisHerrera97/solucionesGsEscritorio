import { CobranzaAppService } from '../../application/cobranza/cobranzaAppService';
import { CreditosAppService } from '../../application/creditos/creditosAppService';
import { GeneralAppService } from '../../application/general/generalAppService';
import type { AuthSessionStore } from '../../application/seguridad/seguridadAppService';
import { SeguridadAppService } from '../../application/seguridad/seguridadAppService';
import { sessionStorage } from '../auth/sessionStorage';
import { createCobranzaGateway } from '../gateways/cobranza/cobranzaGateway';
import { createCreditosGateway } from '../gateways/creditos/creditosGateway';
import { createGeneralGateway } from '../gateways/general/generalGateway';
import { createSeguridadGateway } from '../gateways/seguridad/seguridadGateway';

export type AppServices = {
  creditos: CreditosAppService;
  cobranza: CobranzaAppService;
  general: GeneralAppService;
  seguridad: SeguridadAppService;
};

export type AppContainer = {
  services: AppServices;
  session: AuthSessionStore;
};

export const createAppContainer = (): AppContainer => {
  const session: AuthSessionStore = sessionStorage;

  const services: AppServices = {
    creditos: new CreditosAppService(createCreditosGateway()),
    cobranza: new CobranzaAppService(createCobranzaGateway()),
    general: new GeneralAppService(createGeneralGateway()),
    seguridad: new SeguridadAppService(createSeguridadGateway(), session),
  };

  return { services, session };
};
