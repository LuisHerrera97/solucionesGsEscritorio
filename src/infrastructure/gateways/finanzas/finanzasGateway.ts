import type { FinanzasGateway } from '../../../application/finanzas/finanzasAppService';
import { ClientesService } from '../../servicios/api/finanzas/ClientesService';
import { CreditosService } from '../../servicios/api/finanzas/CreditosService';
import { CajaService } from '../../servicios/api/finanzas/caja/CajaService';
import { CortesService } from '../../servicios/api/finanzas/cortes/CortesService';
import { DashboardService } from '../../servicios/api/finanzas/DashboardService';

export const createFinanzasGateway = (): FinanzasGateway => {
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
      penalizarFicha: CreditosService.penalizarFicha,
      reestructurar: CreditosService.reestructurar,
      condonarInteres: CreditosService.condonarInteres,
      condonarInteresMonto: CreditosService.condonarInteresMonto,
      actualizarObservacion: CreditosService.actualizarObservacion,
      aplicarMora: CreditosService.aplicarMora,
      getMovimientos: CreditosService.getMovimientos,
    },
    caja: {
      getTurno: CajaService.getTurno,
      getMovimientosEnRango: CajaService.getMovimientosEnRango,
      getResumenLiquidaciones: CajaService.getResumenLiquidaciones,
      realizarCorte: CajaService.realizarCorte,
      marcarMovimientosRecibidoCaja: CajaService.marcarMovimientosRecibidoCaja,
    },
    cortes: {
      getAll: CortesService.getAll,
    },
    dashboard: {
      getResumen: DashboardService.getResumen,
    },
  };
};
