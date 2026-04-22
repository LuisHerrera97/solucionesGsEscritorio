import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ConfiguracionSistemaDto, Guid, ZonaCobranzaDto } from '../../../../domain/general/types';
import type { FeriadoDto } from '../../../../domain/general/feriados';
import { useAppContainer } from '../../../../infrastructure/di/useAppContainer';

export const useConfiguracionSistemaQuery = () => {
  const { services } = useAppContainer();
  return useQuery({
    queryKey: ['general', 'configuracion'],
    queryFn: services.general.configuracion.get,
  });
};

export const useActualizarConfiguracionSistemaMutation = () => {
  const queryClient = useQueryClient();
  const { services } = useAppContainer();
  return useMutation({
    mutationFn: (payload: ConfiguracionSistemaDto) => services.general.configuracion.update(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['general', 'configuracion'] });
    },
  });
};

export const useZonasCobranzaQuery = () => {
  const { services } = useAppContainer();
  return useQuery({
    queryKey: ['general', 'zonas'],
    queryFn: services.general.zonasCobranza.getAll,
  });
};

export const useCrearZonaCobranzaMutation = () => {
  const queryClient = useQueryClient();
  const { services } = useAppContainer();
  return useMutation({
    mutationFn: (payload: Pick<ZonaCobranzaDto, 'nombre' | 'orden'>) => services.general.zonasCobranza.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['general', 'zonas'] });
    },
  });
};

export const useActualizarZonaCobranzaMutation = () => {
  const queryClient = useQueryClient();
  const { services } = useAppContainer();
  return useMutation({
    mutationFn: ({ id, payload }: { id: Guid; payload: ZonaCobranzaDto }) => services.general.zonasCobranza.update(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['general', 'zonas'] });
    },
  });
};

export const useEliminarZonaCobranzaMutation = () => {
  const queryClient = useQueryClient();
  const { services } = useAppContainer();
  return useMutation({
    mutationFn: (id: Guid) => services.general.zonasCobranza.remove(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['general', 'zonas'] });
    },
  });
};

export const useAuditoriaQuery = (params: {
  desdeUtc?: string;
  hastaUtc?: string;
  usuarioId?: string;
  accion?: string;
  entidadTipo?: string;
  entidadId?: string;
  page?: number;
  pageSize?: number;
}) => {
  const { services } = useAppContainer();
  return useQuery({
    queryKey: [
      'general',
      'auditoria',
      params.desdeUtc ?? '',
      params.hastaUtc ?? '',
      params.usuarioId ?? '',
      params.accion ?? '',
      params.entidadTipo ?? '',
      params.entidadId ?? '',
      params.page ?? 1,
      params.pageSize ?? 100,
    ],
    queryFn: () => services.general.auditoria.get(params),
  });
};

export const useAuditoriaFiltrosOpcionesQuery = (params: { desdeUtc: string; hastaUtc: string }) => {
  const { services } = useAppContainer();
  return useQuery({
    queryKey: ['general', 'auditoria', 'filtros', params.desdeUtc, params.hastaUtc],
    queryFn: () => services.general.auditoria.getFiltrosOpciones(params),
  });
};

export const useFeriadosQuery = () => {
  const { services } = useAppContainer();
  return useQuery({
    queryKey: ['general', 'feriados'],
    queryFn: services.general.feriados.getAll,
  });
};

export const useCrearFeriadoMutation = () => {
  const queryClient = useQueryClient();
  const { services } = useAppContainer();
  return useMutation({
    mutationFn: (payload: Pick<FeriadoDto, 'fecha' | 'nombre' | 'activo'>) => services.general.feriados.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['general', 'feriados'] });
    },
  });
};

export const useActualizarFeriadoMutation = () => {
  const queryClient = useQueryClient();
  const { services } = useAppContainer();
  return useMutation({
    mutationFn: ({ id, payload }: { id: Guid; payload: Pick<FeriadoDto, 'fecha' | 'nombre' | 'activo'> }) => services.general.feriados.update(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['general', 'feriados'] });
    },
  });
};

export const useEliminarFeriadoMutation = () => {
  const queryClient = useQueryClient();
  const { services } = useAppContainer();
  return useMutation({
    mutationFn: (id: Guid) => services.general.feriados.remove(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['general', 'feriados'] });
    },
  });
};
