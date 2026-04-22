import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AsignarPermisosRequestDto, BotonDto, Guid, ModuloDto, PaginaDto, PerfilDto, UsuarioDto, UsuarioCrearDto } from '../../../../domain/seguridad/types';
import { useAppContainer } from '../../../../infrastructure/di/useAppContainer';

export const useUsuariosQuery = () => {
  const { services } = useAppContainer();
  return useQuery({
    queryKey: ['seguridad', 'usuarios'],
    queryFn: services.seguridad.usuarios.getAll,
  });
};

export const useCrearUsuarioMutation = () => {
  const queryClient = useQueryClient();
  const { services } = useAppContainer();
  return useMutation({
    mutationFn: (payload: UsuarioCrearDto) => services.seguridad.usuarios.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'usuarios'] });
    },
  });
};

export const useActualizarUsuarioMutation = () => {
  const queryClient = useQueryClient();
  const { services } = useAppContainer();
  return useMutation({
    mutationFn: ({ id, payload }: { id: Guid; payload: UsuarioDto }) => services.seguridad.usuarios.update(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'usuarios'] });
    },
  });
};

export const useEliminarUsuarioMutation = () => {
  const queryClient = useQueryClient();
  const { services } = useAppContainer();
  return useMutation({
    mutationFn: (id: Guid) => services.seguridad.usuarios.remove(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'usuarios'] });
    },
  });
};

export const usePerfilesQuery = () => {
  const { services } = useAppContainer();
  return useQuery({
    queryKey: ['seguridad', 'perfiles'],
    queryFn: services.seguridad.perfiles.getAll,
  });
};

export const useCrearPerfilMutation = () => {
  const queryClient = useQueryClient();
  const { services } = useAppContainer();
  return useMutation({
    mutationFn: (payload: PerfilDto) => services.seguridad.perfiles.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'perfiles'] });
    },
  });
};

export const useActualizarPerfilMutation = () => {
  const queryClient = useQueryClient();
  const { services } = useAppContainer();
  return useMutation({
    mutationFn: ({ id, payload }: { id: Guid; payload: PerfilDto }) => services.seguridad.perfiles.update(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'perfiles'] });
    },
  });
};

export const useEliminarPerfilMutation = () => {
  const queryClient = useQueryClient();
  const { services } = useAppContainer();
  return useMutation({
    mutationFn: (id: Guid) => services.seguridad.perfiles.remove(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'perfiles'] });
    },
  });
};

export const useMenuPerfilQuery = (idPerfil?: Guid | '') => {
  const { services } = useAppContainer();
  return useQuery({
    queryKey: ['seguridad', 'perfiles', idPerfil ?? '', 'menu'],
    queryFn: () => services.seguridad.permisos.getMenu(idPerfil as Guid),
    enabled: Boolean(idPerfil),
  });
};

export const useSetPermisosMutation = (perfilId: Guid) => {
  const queryClient = useQueryClient();
  const { services } = useAppContainer();
  return useMutation({
    mutationFn: (payload: AsignarPermisosRequestDto) => services.seguridad.permisos.setPermisos(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'perfiles', perfilId, 'menu'] });
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'perfiles', perfilId, 'permisos'] });
    },
  });
};

export const useModulosQuery = () => {
  const { services } = useAppContainer();
  return useQuery({
    queryKey: ['seguridad', 'modulos'],
    queryFn: services.seguridad.modulos.getAll,
  });
};

export const usePaginasQuery = (params?: { page?: number; pageSize?: number }) => {
  const { services } = useAppContainer();
  return useQuery({
    queryKey: ['seguridad', 'paginas', params?.page ?? '', params?.pageSize ?? ''],
    queryFn: () => services.seguridad.paginas.getAll(params),
  });
};

export const useBotonesQuery = (params?: { page?: number; pageSize?: number }) => {
  const { services } = useAppContainer();
  return useQuery({
    queryKey: ['seguridad', 'botones', params?.page ?? '', params?.pageSize ?? ''],
    queryFn: () => services.seguridad.botones.getAll(params),
  });
};

export const useCrearModuloMutation = () => {
  const queryClient = useQueryClient();
  const { services } = useAppContainer();
  return useMutation({
    mutationFn: (payload: ModuloDto) => services.seguridad.modulos.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'modulos'] });
    },
  });
};

export const useActualizarModuloMutation = () => {
  const queryClient = useQueryClient();
  const { services } = useAppContainer();
  return useMutation({
    mutationFn: ({ id, payload }: { id: Guid; payload: ModuloDto }) => services.seguridad.modulos.update(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'modulos'] });
    },
  });
};

export const useEliminarModuloMutation = () => {
  const queryClient = useQueryClient();
  const { services } = useAppContainer();
  return useMutation({
    mutationFn: (id: Guid) => services.seguridad.modulos.remove(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'modulos'] });
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'paginas'] });
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'botones'] });
    },
  });
};

export const useCrearPaginaMutation = () => {
  const queryClient = useQueryClient();
  const { services } = useAppContainer();
  return useMutation({
    mutationFn: (payload: PaginaDto) => services.seguridad.paginas.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'paginas'] });
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'modulos'] });
    },
  });
};

export const useActualizarPaginaMutation = () => {
  const queryClient = useQueryClient();
  const { services } = useAppContainer();
  return useMutation({
    mutationFn: ({ id, payload }: { id: Guid; payload: PaginaDto }) => services.seguridad.paginas.update(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'paginas'] });
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'modulos'] });
    },
  });
};

export const useEliminarPaginaMutation = () => {
  const queryClient = useQueryClient();
  const { services } = useAppContainer();
  return useMutation({
    mutationFn: (id: Guid) => services.seguridad.paginas.remove(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'paginas'] });
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'botones'] });
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'modulos'] });
    },
  });
};

export const useCrearBotonMutation = () => {
  const queryClient = useQueryClient();
  const { services } = useAppContainer();
  return useMutation({
    mutationFn: (payload: BotonDto) => services.seguridad.botones.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'botones'] });
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'paginas'] });
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'modulos'] });
    },
  });
};

export const useActualizarBotonMutation = () => {
  const queryClient = useQueryClient();
  const { services } = useAppContainer();
  return useMutation({
    mutationFn: ({ id, payload }: { id: Guid; payload: BotonDto }) => services.seguridad.botones.update(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'botones'] });
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'paginas'] });
    },
  });
};

export const useEliminarBotonMutation = () => {
  const queryClient = useQueryClient();
  const { services } = useAppContainer();
  return useMutation({
    mutationFn: (id: Guid) => services.seguridad.botones.remove(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'botones'] });
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'paginas'] });
      await queryClient.invalidateQueries({ queryKey: ['seguridad', 'modulos'] });
    },
  });
};
