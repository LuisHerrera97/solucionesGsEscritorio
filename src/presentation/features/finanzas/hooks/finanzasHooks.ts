import { type QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AbonarFichaCreditoRequest, Cliente, PenalizarFichaCreditoRequest } from '../../../../domain/finanzas/types';
import type { MarcarRecibidoCajaRequestDto, RealizarCorteRequestDto } from '../../../../domain/finanzas/caja/types';
import { useAppContainer } from '../../../../infrastructure/di/useAppContainer';

export const useClientesQuery = (params?: { page?: number; pageSize?: number; buscar?: string; zonaId?: string }) => {
  const { services } = useAppContainer();
  return useQuery({
    queryKey: ['finanzas', 'clientes', params?.page ?? '', params?.pageSize ?? '', params?.buscar ?? '', params?.zonaId ?? ''],
    queryFn: () => services.finanzas.clientes.getAll(params),
  });
};

export const useCrearClienteMutation = () => {
  const queryClient = useQueryClient();
  const { services } = useAppContainer();
  return useMutation({
    mutationFn: (payload: Omit<Cliente, 'id'>) => services.finanzas.clientes.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['finanzas', 'clientes'] });
    },
  });
};

export const useActualizarClienteMutation = () => {
  const queryClient = useQueryClient();
  const { services } = useAppContainer();
  return useMutation({
    mutationFn: (args: { id: string; payload: Omit<Cliente, 'id'> }) => services.finanzas.clientes.update(args.id, args.payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['finanzas', 'clientes'] });
    },
  });
};

export const useEliminarClienteMutation = () => {
  const queryClient = useQueryClient();
  const { services } = useAppContainer();
  return useMutation({
    mutationFn: (id: string) => services.finanzas.clientes.delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['finanzas', 'clientes'] });
    },
  });
};

export const useCreditosQuery = (params?: { searchTerm?: string; page?: number; pageSize?: number; zonaId?: string }) => {
  const { services } = useAppContainer();
  return useQuery({
    queryKey: ['finanzas', 'creditos', params?.searchTerm ?? '', params?.page ?? '', params?.pageSize ?? '', params?.zonaId ?? ''],
    queryFn: () => services.finanzas.creditos.getAll(params),
  });
};

export const useCreditoByIdQuery = (id?: string) => {
  const { services } = useAppContainer();
  return useQuery({
    queryKey: ['finanzas', 'creditos', id],
    queryFn: () => services.finanzas.creditos.getById(id as string),
    enabled: Boolean(id),
  });
};

export const useMovimientosByCreditoQuery = (id?: string) => {
  const { services } = useAppContainer();
  return useQuery({
    queryKey: ['finanzas', 'creditos', id, 'movimientos'],
    queryFn: () => services.finanzas.creditos.getMovimientos(id as string),
    enabled: Boolean(id),
  });
};

export const useCrearCreditoMutation = () => {
  const queryClient = useQueryClient();
  const { services } = useAppContainer();
  return useMutation({
    mutationFn: (payload: { clienteId: string; monto: number; plazo: number; tipo: 'diario' | 'semanal' | 'mensual'; permitirDomingo?: boolean; aplicarFeriados?: boolean; tasaManual?: number; observacion?: string }) =>
      services.finanzas.creditos.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['finanzas', 'creditos'] });
      await queryClient.invalidateQueries({ queryKey: ['cobranza', 'pendientes'] });
      await queryClient.invalidateQueries({ queryKey: ['finanzas', 'reportes'] });
    },
  });
};

const invalidateTrasFichaCredito = async (queryClient: QueryClient, creditoId: string) => {
  await queryClient.invalidateQueries({ queryKey: ['finanzas', 'creditos'] });
  await queryClient.invalidateQueries({ queryKey: ['finanzas', 'creditos', creditoId] });
  await queryClient.invalidateQueries({ queryKey: ['finanzas', 'creditos', creditoId, 'movimientos'] });
  await queryClient.invalidateQueries({ queryKey: ['cobranza', 'pendientes'] });
  await queryClient.invalidateQueries({ queryKey: ['finanzas', 'caja', 'turno'] });
  await queryClient.invalidateQueries({ queryKey: ['finanzas', 'caja', 'movimientos'] });
  await queryClient.invalidateQueries({ queryKey: ['finanzas', 'caja', 'movimientos'] });
};

export const useAbonarFichaCreditoMutation = () => {
  const queryClient = useQueryClient();
  const { services } = useAppContainer();
  return useMutation({
    mutationFn: (payload: AbonarFichaCreditoRequest) => services.finanzas.creditos.abonarFicha(payload),
    onSuccess: async (_data, variables) => {
      await invalidateTrasFichaCredito(queryClient, variables.creditoId);
    },
  });
};

export const usePenalizarFichaCreditoMutation = () => {
  const queryClient = useQueryClient();
  const { services } = useAppContainer();
  return useMutation({
    mutationFn: (payload: PenalizarFichaCreditoRequest) => services.finanzas.creditos.penalizarFicha(payload),
    onSuccess: async (_data, variables) => {
      await invalidateTrasFichaCredito(queryClient, variables.creditoId);
    },
  });
};

export const useReestructurarCreditoMutation = () => {
  const queryClient = useQueryClient();
  const { services } = useAppContainer();
  return useMutation({
    mutationFn: (payload: { creditoId: string; nuevoMonto: number; nuevoPlazo: number; tipo: 'diario' | 'semanal' | 'mensual' }) =>
      services.finanzas.creditos.reestructurar(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['finanzas', 'creditos'] });
      await queryClient.invalidateQueries({ queryKey: ['cobranza', 'pendientes'] });
      await queryClient.invalidateQueries({ queryKey: ['finanzas', 'reportes'] });
    },
  });
};

export const useCajaTurnoQuery = (params?: { fecha?: string }) => {
  const { services } = useAppContainer();
  return useQuery({
    queryKey: ['finanzas', 'caja', 'turno', params?.fecha ?? ''],
    queryFn: () => services.finanzas.caja.getTurno(params),
  });
};

export const useCajaMovimientosRangoQuery = (params: { fechaDesde: string; fechaHasta: string; zonaId?: string; cobradorId?: string }) => {
  const { services } = useAppContainer();
  return useQuery({
    queryKey: ['finanzas', 'caja', 'movimientos', params.fechaDesde, params.fechaHasta, params.zonaId ?? '', params.cobradorId ?? ''],
    queryFn: () => services.finanzas.caja.getMovimientosEnRango(params),
  });
};



export const useRealizarCorteMutation = () => {
  const queryClient = useQueryClient();
  const { services } = useAppContainer();
  return useMutation({
    mutationFn: (payload: RealizarCorteRequestDto) => services.finanzas.caja.realizarCorte(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['finanzas', 'caja', 'turno'] });
      await queryClient.invalidateQueries({ queryKey: ['finanzas', 'caja', 'movimientos'] });
      await queryClient.invalidateQueries({ queryKey: ['finanzas', 'cortes'] });
      await queryClient.invalidateQueries({ queryKey: ['finanzas', 'reportes'] });
    },
  });
};


export const useMarcarMovimientosRecibidoCajaMutation = () => {
  const queryClient = useQueryClient();
  const { services } = useAppContainer();
  return useMutation({
    mutationFn: (payload: MarcarRecibidoCajaRequestDto) => services.finanzas.caja.marcarMovimientosRecibidoCaja(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['finanzas', 'caja', 'turno'] });
      await queryClient.invalidateQueries({ queryKey: ['finanzas', 'caja', 'movimientos'] });
      await queryClient.invalidateQueries({ queryKey: ['finanzas', 'caja', 'liquidaciones'] });
      await queryClient.invalidateQueries({ queryKey: ['cobranza', 'liquidaciones', 'cobradores'] });
    },
  });
};

export const useCortesQuery = (params: { fechaInicio?: string; fechaFin?: string }) => {
  const { services } = useAppContainer();
  return useQuery({
    queryKey: ['finanzas', 'cortes', params.fechaInicio ?? '', params.fechaFin ?? ''],
    queryFn: () => services.finanzas.cortes.getAll(params),
  });
};


export const useCondonarInteresMutation = () => {
  const queryClient = useQueryClient();
  const { services } = useAppContainer();
  return useMutation({
    mutationFn: (payload: { creditoId: string; numeroFicha: number }) => services.finanzas.creditos.condonarInteres(payload),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['finanzas', 'creditos', variables.creditoId] });
      await queryClient.invalidateQueries({ queryKey: ['cobranza', 'pendientes'] });
    },
  });
};

export const useCondonarInteresMontoMutation = () => {
  const queryClient = useQueryClient();
  const { services } = useAppContainer();
  return useMutation({
    mutationFn: (payload: { creditoId: string; monto: number }) => services.finanzas.creditos.condonarInteresMonto(payload),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['finanzas', 'creditos'] });
      await queryClient.invalidateQueries({ queryKey: ['finanzas', 'creditos', variables.creditoId] });
      await queryClient.invalidateQueries({ queryKey: ['cobranza', 'pendientes'] });
    },
  });
};

export const useActualizarObservacionMutation = () => {
  const queryClient = useQueryClient();
  const { services } = useAppContainer();
  return useMutation({
    mutationFn: (payload: { creditoId: string; observacion: string }) => services.finanzas.creditos.actualizarObservacion(payload),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['finanzas', 'creditos'] });
      await queryClient.invalidateQueries({ queryKey: ['finanzas', 'creditos', variables.creditoId] });
    },
  });
};

export const useAplicarMoraMutation = () => {
  const queryClient = useQueryClient();
  const { services } = useAppContainer();
  return useMutation({
    mutationFn: () => services.finanzas.creditos.aplicarMora(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['finanzas', 'creditos'] });
      await queryClient.invalidateQueries({ queryKey: ['cobranza', 'pendientes'] });
    },
  });
};

export const useDashboardResumenQuery = (params?: { zonaId?: string }) => {
  const { services } = useAppContainer();
  return useQuery({
    queryKey: ['finanzas', 'dashboard', 'resumen', params?.zonaId],
    queryFn: () => services.finanzas.dashboard.getResumen(params),
  });
};
