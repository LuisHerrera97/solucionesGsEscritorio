import { useQuery } from '@tanstack/react-query';
import { useAppContainer } from '../../../../infrastructure/di/useAppContainer';

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
