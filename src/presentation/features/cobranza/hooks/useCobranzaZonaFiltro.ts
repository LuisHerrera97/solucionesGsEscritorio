import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import type { ZonaCobranzaDto } from '../../../../domain/general/types';
import { useAuth } from '../../auth/context/useAuth';
import { useZonasCobranzaQuery } from '../../general/hooks/generalHooks';

export const PERM_CREDITO_TODAS_ZONAS = 'CREDITO_TODAS_ZONAS';

export type UseCobranzaZonaFiltroResult = {
  puedeElegirZona: boolean;
  zonaFiltro: string;
  setZonaFiltro: (v: string) => void;
  /** Id de zona a enviar al API (omitir si undefined = todas las zonas) */
  zonaIdParam: string | undefined;
  zonas: ZonaCobranzaDto[];
  zonasLoading: boolean;
  esZonaDelUsuario: boolean;
};

export const useCobranzaZonaFiltro = (permiso = PERM_CREDITO_TODAS_ZONAS): UseCobranzaZonaFiltroResult => {
  const { user, canBoton } = useAuth();
  const puedeElegirZona = canBoton(permiso);
  const zonasQuery = useZonasCobranzaQuery();
  const zonas = zonasQuery.data ?? [];

  const [zonaFiltro, setZonaFiltro] = useState('');
  const initZonaUsuario = useRef(false);

  useEffect(() => {
    initZonaUsuario.current = false;
  }, [user?.id]);

  useEffect(() => {
    if (!puedeElegirZona || initZonaUsuario.current) return;
    if (zonasQuery.isLoading) return;
    initZonaUsuario.current = true;
    if (user?.idZonaCobranza) {
      const z = zonas.find((zz) => zz.id === user.idZonaCobranza);
      if (z?.id) setZonaFiltro(z.id);
    }
  }, [puedeElegirZona, user?.idZonaCobranza, zonas, zonasQuery.isLoading]);

  useEffect(() => {
    if (!puedeElegirZona || !zonaFiltro.trim() || zonasQuery.isLoading || zonas.length === 0) return;
    const ok = zonas.some((z) => z.id === zonaFiltro.trim());
    if (!ok) {
      toast.warning('La zona seleccionada no es válida.');
      setZonaFiltro('');
    }
  }, [puedeElegirZona, zonaFiltro, zonas, zonasQuery.isLoading]);

  const zonaIdParam = useMemo(() => {
    if (!puedeElegirZona) return undefined;
    const t = zonaFiltro.trim();
    return t === '' ? undefined : t;
  }, [puedeElegirZona, zonaFiltro]);

  const zonaSeleccionada = useMemo(
    () => zonas.find((z) => z.id === zonaFiltro.trim()),
    [zonas, zonaFiltro],
  );
  const esZonaDelUsuario = Boolean(user?.idZonaCobranza && zonaSeleccionada?.id === user.idZonaCobranza);

  return {
    puedeElegirZona,
    zonaFiltro,
    setZonaFiltro,
    zonaIdParam,
    zonas,
    zonasLoading: zonasQuery.isLoading,
    esZonaDelUsuario,
  };
};
