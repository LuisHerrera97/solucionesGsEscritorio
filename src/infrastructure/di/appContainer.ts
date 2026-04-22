import { CobranzaAppService } from '../../application/cobranza/cobranzaAppService';
import { FinanzasAppService } from '../../application/finanzas/finanzasAppService';
import { GeneralAppService } from '../../application/general/generalAppService';
import type { AuthSessionStore } from '../../application/seguridad/seguridadAppService';
import { SeguridadAppService } from '../../application/seguridad/seguridadAppService';
import { sessionStorage } from '../auth/sessionStorage';
import { createCobranzaGateway } from '../gateways/cobranza/cobranzaGateway';
import { createFinanzasGateway } from '../gateways/finanzas/finanzasGateway';
import { createGeneralGateway } from '../gateways/general/generalGateway';
import { createSeguridadGateway } from '../gateways/seguridad/seguridadGateway';

export type AppServices = {
  finanzas: FinanzasAppService;
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
    finanzas: new FinanzasAppService(createFinanzasGateway()),
    cobranza: new CobranzaAppService(createCobranzaGateway()),
    general: new GeneralAppService(createGeneralGateway()),
    seguridad: new SeguridadAppService(createSeguridadGateway(), session),
  };

  return { services, session };
};
