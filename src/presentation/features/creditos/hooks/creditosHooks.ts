import { type QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AbonarFichaCreditoRequest, Cliente, PenalizarFichaCreditoRequest } from '../../../../domain/creditos/types';
import { useAppContainer } from '../../../../infrastructure/di/useAppContainer';

export const useClientesQuery = (params?: { page?: number; pageSize?: number; buscar?: string; zonaId?: string }) => {
  const { services } = useAppContainer();
  return useQuery({
    queryKey: ['creditos', 'clientes', params?.page ?? '', params?.pageSize ?? '', params?.buscar ?? '', params?.zonaId ?? ''],
    queryFn: () => services.creditos.clientes.getAll(params),
  });
};

export const useCrearClienteMutation = () => {
  const queryClient = useQueryClient();
  const { services } = useAppContainer();
  return useMutation({
    mutationFn: (payload: Omit<Cliente, 'id'>) => services.creditos.clientes.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['creditos', 'clientes'] });
    },
  });
};

export const useActualizarClienteMutation = () => {
  const queryClient = useQueryClient();
  const { services } = useAppContainer();
  return useMutation({
    mutationFn: (args: { id: string; payload: Omit<Cliente, 'id'> }) => services.creditos.clientes.update(args.id, args.payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['creditos', 'clientes'] });
    },
  });
};

export const useEliminarClienteMutation = () => {
  const queryClient = useQueryClient();
  const { services } = useAppContainer();
  return useMutation({
    mutationFn: (id: string) => services.creditos.clientes.delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['creditos', 'clientes'] });
    },
  });
};

export const useCreditosQuery = (params?: { searchTerm?: string; page?: number; pageSize?: number; zonaId?: string }) => {
  const { services } = useAppContainer();
  return useQuery({
    queryKey: ['creditos', 'creditos', params?.searchTerm ?? '', params?.page ?? '', params?.pageSize ?? '', params?.zonaId ?? ''],
    queryFn: () => services.creditos.creditos.getAll(params),
  });
};

export const useCreditoByIdQuery = (id?: string) => {
  const { services } = useAppContainer();
  return useQuery({
    queryKey: ['creditos', 'creditos', id],
    queryFn: () => services.creditos.creditos.getById(id as string),
    enabled: Boolean(id),
  });
};

export const useMovimientosByCreditoQuery = (id?: string) => {
  const { services } = useAppContainer();
  return useQuery({
    queryKey: ['creditos', 'creditos', id, 'movimientos'],
    queryFn: () => services.creditos.creditos.getMovimientos(id as string),
    enabled: Boolean(id),
  });
};

export const useCrearCreditoMutation = () => {
  const queryClient = useQueryClient();
  const { services } = useAppContainer();
  return useMutation({
    mutationFn: (payload: { clienteId: string; monto: number; plazo: number; tipo: 'diario' | 'semanal' | 'mensual'; permitirDomingo?: boolean; aplicarFeriados?: boolean; tasaManual?: number; observacion?: string }) =>
      services.creditos.creditos.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['creditos', 'creditos'] });
      await queryClient.invalidateQueries({ queryKey: ['cobranza', 'pendientes'] });
      await queryClient.invalidateQueries({ queryKey: ['creditos', 'reportes'] });
    },
  });
};

const invalidateTrasFichaCredito = async (queryClient: QueryClient, creditoId: string) => {
  await queryClient.invalidateQueries({ queryKey: ['creditos', 'creditos'] });
  await queryClient.invalidateQueries({ queryKey: ['creditos', 'creditos', creditoId] });
  await queryClient.invalidateQueries({ queryKey: ['creditos', 'creditos', creditoId, 'movimientos'] });
  await queryClient.invalidateQueries({ queryKey: ['cobranza', 'pendientes'] });
  await queryClient.invalidateQueries({ queryKey: ['creditos', 'dashboard', 'movimientos'] });
};

export const useAbonarFichaCreditoMutation = () => {
  const queryClient = useQueryClient();
  const { services } = useAppContainer();
  return useMutation({
    mutationFn: (payload: AbonarFichaCreditoRequest) => services.creditos.creditos.abonarFicha(payload),
    onSuccess: async (_data, variables) => {
      await invalidateTrasFichaCredito(queryClient, variables.creditoId);
    },
  });
};

export const usePenalizarFichaCreditoMutation = () => {
  const queryClient = useQueryClient();
  const { services } = useAppContainer();
  return useMutation({
    mutationFn: (payload: PenalizarFichaCreditoRequest) => services.creditos.creditos.penalizarFicha(payload),
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
      services.creditos.creditos.reestructurar(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['creditos', 'creditos'] });
      await queryClient.invalidateQueries({ queryKey: ['cobranza', 'pendientes'] });
      await queryClient.invalidateQueries({ queryKey: ['creditos', 'reportes'] });
    },
  });
};

export const useDashboardMovimientosRangoQuery = (params: { fechaDesde: string; fechaHasta: string; zonaId?: string; cobradorId?: string }) => {
  const { services } = useAppContainer();
  return useQuery({
    queryKey: ['creditos', 'dashboard', 'movimientos', params.fechaDesde, params.fechaHasta, params.zonaId ?? '', params.cobradorId ?? ''],
    queryFn: () => services.creditos.dashboard.getMovimientosEnRango(params),
  });
};

export const useCortesQuery = (params: { fechaInicio?: string; fechaFin?: string }) => {
  const { services } = useAppContainer();
  return useQuery({
    queryKey: ['creditos', 'cortes', params.fechaInicio ?? '', params.fechaFin ?? ''],
    queryFn: () => services.creditos.cortes.getAll(params),
  });
};


export const useCondonarInteresMutation = () => {
  const queryClient = useQueryClient();
  const { services } = useAppContainer();
  return useMutation({
    mutationFn: (payload: { creditoId: string; numeroFicha: number }) => services.creditos.creditos.condonarInteres(payload),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['creditos', 'creditos', variables.creditoId] });
      await queryClient.invalidateQueries({ queryKey: ['cobranza', 'pendientes'] });
    },
  });
};

export const useCondonarInteresMontoMutation = () => {
  const queryClient = useQueryClient();
  const { services } = useAppContainer();
  return useMutation({
    mutationFn: (payload: { creditoId: string; monto: number }) => services.creditos.creditos.condonarInteresMonto(payload),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['creditos', 'creditos'] });
      await queryClient.invalidateQueries({ queryKey: ['creditos', 'creditos', variables.creditoId] });
      await queryClient.invalidateQueries({ queryKey: ['cobranza', 'pendientes'] });
    },
  });
};

export const useActualizarObservacionMutation = () => {
  const queryClient = useQueryClient();
  const { services } = useAppContainer();
  return useMutation({
    mutationFn: (payload: { creditoId: string; observacion: string }) => services.creditos.creditos.actualizarObservacion(payload),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['creditos', 'creditos'] });
      await queryClient.invalidateQueries({ queryKey: ['creditos', 'creditos', variables.creditoId] });
    },
  });
};

export const useAplicarMoraMutation = () => {
  const queryClient = useQueryClient();
  const { services } = useAppContainer();
  return useMutation({
    mutationFn: () => services.creditos.creditos.aplicarMora(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['creditos', 'creditos'] });
      await queryClient.invalidateQueries({ queryKey: ['cobranza', 'pendientes'] });
    },
  });
};

export const useDashboardResumenQuery = (params?: { zonaId?: string }) => {
  const { services } = useAppContainer();
  return useQuery({
    queryKey: ['creditos', 'dashboard', 'resumen', params?.zonaId],
    queryFn: () => services.creditos.dashboard.getResumen(params),
  });
};
