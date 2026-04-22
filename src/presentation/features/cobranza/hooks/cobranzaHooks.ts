import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAppContainer } from '../../../../infrastructure/di/useAppContainer';
import { LiquidacionesService } from '../../../../infrastructure/servicios/api/cobranza/liquidaciones/LiquidacionesService';
import type { CrearLiquidacionCobranzaRequestDto } from '../../../../domain/cobranza/liquidaciones/types';
import type { MovimientoCajaDto, ResumenLiquidacionesCajaDto } from '../../../../domain/finanzas/caja/types';

export const usePendientesQuery = (params: { busqueda?: string; page: number; pageSize: number; zonaId?: string }) => {
  const { services } = useAppContainer();
  return useQuery({
    queryKey: ['cobranza', 'pendientes', params.busqueda ?? '', params.page, params.pageSize, params.zonaId ?? ''],
    queryFn: () => services.cobranza.pendientes.getPage(params),
    placeholderData: (prev) => prev,
  });
};



export const useCobranzaQuery = (params: { fechaInicio?: string; fechaFin?: string; busqueda?: string; zonaId?: string }) => {
  const { services } = useAppContainer();
  return useQuery({
    queryKey: ['cobranza', 'cobranza', params.fechaInicio ?? '', params.fechaFin ?? '', params.busqueda ?? '', params.zonaId ?? ''],
    queryFn: () => services.cobranza.cobranza.getAll(params),
  });
};

export const useLiquidacionResumenPendienteQuery = () => {
  return useQuery({
    queryKey: ['cobranza', 'liquidaciones', 'pendiente', 'resumen'],
    queryFn: LiquidacionesService.getResumenPendiente,
  });
};

export const useCrearLiquidacionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CrearLiquidacionCobranzaRequestDto) => LiquidacionesService.crear(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['cobranza', 'liquidaciones'] });
      await queryClient.invalidateQueries({ queryKey: ['finanzas', 'caja', 'turno'] });
      await queryClient.invalidateQueries({ queryKey: ['cobranza', 'pendientes'] });
      await queryClient.invalidateQueries({ queryKey: ['cobranza', 'liquidaciones', 'cobradores'] });
    },
  });
};

export const useLiquidacionesHistoryQuery = (fechaInicio?: string, fechaFin?: string) => {
  return useQuery({
    queryKey: ['cobranza', 'liquidaciones', 'historial', fechaInicio, fechaFin],
    queryFn: () => LiquidacionesService.getHistorial(fechaInicio, fechaFin),
  });
};

export const useAllLiquidationsQuery = (fechaInicio?: string, fechaFin?: string, zonaId?: string) => {
  return useQuery({
    queryKey: ['cobranza', 'liquidaciones', 'all', fechaInicio, fechaFin, zonaId],
    queryFn: () => LiquidacionesService.getAll(fechaInicio, fechaFin, zonaId),
  });
};

export const useLiquidacionCobradoresResumenQuery = (params: { fechaDesde: string; fechaHasta: string; zonaId?: string }) => {
  return useQuery({
    queryKey: ['cobranza', 'liquidaciones', 'cobradores', 'resumen', params.fechaDesde, params.fechaHasta, params.zonaId ?? ''],
    queryFn: (): Promise<ResumenLiquidacionesCajaDto> => LiquidacionesService.getCobradoresResumen(params),
  });
};

export const useLiquidacionMovimientosPendientesCobradorQuery = (cobradorId: string | undefined, fecha: string) => {
  return useQuery({
    queryKey: ['cobranza', 'liquidaciones', 'cobradores', 'movimientos', cobradorId ?? '', fecha],
    queryFn: (): Promise<MovimientoCajaDto[]> => LiquidacionesService.getMovimientosPendientesCobrador(cobradorId!, fecha),
    enabled: Boolean(cobradorId),
  });
};

export const useConfirmarLiquidacionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => LiquidacionesService.confirmar(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['cobranza', 'liquidaciones'] });
      await queryClient.invalidateQueries({ queryKey: ['finanzas', 'caja', 'turno'] });
      await queryClient.invalidateQueries({ queryKey: ['finanzas', 'caja', 'movimientos'] });
      await queryClient.invalidateQueries({ queryKey: ['cobranza', 'liquidaciones', 'cobradores'] });
    },
  });
};

export const useRechazarLiquidacionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => LiquidacionesService.rechazar(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['cobranza', 'liquidaciones'] });
      await queryClient.invalidateQueries({ queryKey: ['cobranza', 'pendientes'] });
      await queryClient.invalidateQueries({ queryKey: ['cobranza', 'liquidaciones', 'cobradores'] });
    },
  });
};
