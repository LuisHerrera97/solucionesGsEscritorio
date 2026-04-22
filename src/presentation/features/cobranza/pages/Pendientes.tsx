import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { PendienteCobroDto } from '../../../../domain/cobranza/pendientes/types';
import StatusPanel from '../../../../infrastructure/ui/components/StatusPanel';
import { useDebouncedValue } from '../../../../infrastructure/hooks/useDebouncedValue';
import { usePendientesQuery } from '../hooks/cobranzaHooks';
import { useCobranzaZonaFiltro } from '../hooks/useCobranzaZonaFiltro';
import { PendienteCard } from '../components/pendientes/PendienteCard';
import { PendientesHeader } from '../components/pendientes/PendientesHeader';
import { CobranzaZonaFiltroPanel } from '../components/cobranza/CobranzaZonaFiltroPanel';
import { useAuth } from '../../auth/context/useAuth';

const PAGE_SIZE = 25;

const Pendientes = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const zonaCtx = useCobranzaZonaFiltro('PENDIENTES_TODAS_ZONAS');

  const [busqueda, setBusqueda] = useState('');
  const busquedaDebounced = useDebouncedValue(busqueda);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [busquedaDebounced, zonaCtx.zonaFiltro]);

  const pendientesQuery = usePendientesQuery({
    busqueda: busquedaDebounced || undefined,
    page,
    pageSize: PAGE_SIZE,
    zonaId: zonaCtx.zonaIdParam,
  });

  const listado = pendientesQuery.data;
  const pendientes = useMemo(() => listado?.items ?? [], [listado?.items]);
  const totalCount = listado?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const irAlCredito = useCallback(
    (item: PendienteCobroDto) => {
      navigate(`/creditos/${item.creditoId}`);
    },
    [navigate],
  );

  return (
    <div className="space-y-6">
      <PendientesHeader busqueda={busqueda} onChangeBusqueda={setBusqueda} />

      <CobranzaZonaFiltroPanel
        user={user}
        puedeElegirZona={zonaCtx.puedeElegirZona}
        zonas={zonaCtx.zonas}
        zonasLoading={zonaCtx.zonasLoading}
        zonaFiltro={zonaCtx.zonaFiltro}
        onChangeZona={zonaCtx.setZonaFiltro}
        esZonaDelUsuario={zonaCtx.esZonaDelUsuario}
      />

      <div className="space-y-3">
        {pendientesQuery.isLoading && <StatusPanel variant="loading" title="Cargando pendientes" message="Consultando el servidor..." />}
        {pendientesQuery.isError && <StatusPanel variant="error" title="No fue posible cargar pendientes" message="Intenta nuevamente." />}
        {!pendientesQuery.isLoading && !pendientesQuery.isError && pendientes.length === 0 && (
          <StatusPanel variant="empty" title="Sin pendientes" message="No hay fichas pendientes para mostrar." />
        )}
        {pendientes.map((item) => (
          <PendienteCard key={`${item.creditoId}-${item.numFicha}`} item={item} onIrAlCredito={irAlCredito} />
        ))}
      </div>

      {totalCount > PAGE_SIZE && (
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between border-t border-gray-100 pt-4">
          <p className="text-xs text-textMuted">
            Mostrando {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, totalCount)} de {totalCount}
          </p>
          <div className="flex gap-2">
            <button type="button" className="btn btn-light text-sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              Anterior
            </button>
            <button
              type="button"
              className="btn btn-light text-sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pendientes;
