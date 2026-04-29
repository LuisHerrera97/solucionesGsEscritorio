import type { CreditosGateway } from '../../../application/creditos/creditosAppService';
import { ClientesService } from '../../servicios/api/creditos/ClientesService';
import { CreditosService } from '../../servicios/api/creditos/CreditosService';
import { CortesService } from '../../servicios/api/creditos/cortes/CortesService';
import { DashboardService } from '../../servicios/api/creditos/DashboardService';

export const createCreditosGateway = (): CreditosGateway => {
  return {
    clientes: {
      getAll: ClientesService.getAll,
      create: ClientesService.create,
      update: ClientesService.update,
      delete: ClientesService.delete,
    },
    creditos: {
      getAll: CreditosService.getAll,
      getById: CreditosService.getById,
      create: CreditosService.create,
      abonarFicha: CreditosService.abonarFicha,
      abonarFichasVigentes: CreditosService.abonarFichasVigentes,
      penalizarFicha: CreditosService.penalizarFicha,
      reversarMovimiento: CreditosService.reversarMovimiento,
      reestructurar: CreditosService.reestructurar,
      condonarInteres: CreditosService.condonarInteres,
      condonarInteresMonto: CreditosService.condonarInteresMonto,
      actualizarObservacion: CreditosService.actualizarObservacion,
      aplicarMora: CreditosService.aplicarMora,
      getMovimientos: CreditosService.getMovimientos,
    },
    cortes: {
      getAll: CortesService.getAll,
    },
    dashboard: {
      getResumen: DashboardService.getResumen,
      getMovimientosEnRango: DashboardService.getMovimientosEnRango,
      getMovimientosCobranzaEnRango: DashboardService.getMovimientosCobranzaEnRango,
    },
  };
};
