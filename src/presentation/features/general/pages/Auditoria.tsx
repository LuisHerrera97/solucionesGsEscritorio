import { useEffect, useMemo, useState } from 'react';
import StatusPanel from '../../../../infrastructure/ui/components/StatusPanel';
import { useAuditoriaFiltrosOpcionesQuery, useAuditoriaQuery } from '../hooks/generalHooks';

const PAGE_SIZE = 50;

const Auditoria = () => {
  const [desde, setDesde] = useState(() => new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
  const [hasta, setHasta] = useState(() => new Date().toISOString().slice(0, 10));
  const [accion, setAccion] = useState('');
  const [entidadTipo, setEntidadTipo] = useState('');
  const [page, setPage] = useState(1);

  const rangoUtc = useMemo(() => {
    const desdeUtc = new Date(`${desde}T00:00:00.000Z`).toISOString();
    const hastaUtc = new Date(`${hasta}T23:59:59.999Z`).toISOString();
    return { desdeUtc, hastaUtc };
  }, [desde, hasta]);

  useEffect(() => {
    setPage(1);
  }, [desde, hasta, accion, entidadTipo]);

  const filtrosOpcionesQuery = useAuditoriaFiltrosOpcionesQuery(rangoUtc);

  useEffect(() => {
    const data = filtrosOpcionesQuery.data;
    if (!data) return;
    setAccion((prev) => (prev && data.acciones.some((a) => a.valor === prev) ? prev : ''));
    setEntidadTipo((prev) => (prev && data.entidadesTipo.some((a) => a.valor === prev) ? prev : ''));
  }, [filtrosOpcionesQuery.data]);

  const params = useMemo(
    () => ({
      ...rangoUtc,
      accion: accion.trim() || undefined,
      entidadTipo: entidadTipo.trim() || undefined,
      page,
      pageSize: PAGE_SIZE,
    }),
    [rangoUtc, accion, entidadTipo, page],
  );

  const auditoriaQuery = useAuditoriaQuery(params);
  const eventos = auditoriaQuery.data ?? [];
  const haySiguiente = eventos.length === PAGE_SIZE;

  const etiquetaAccion = useMemo(() => {
    const m = new Map<string, string>();
    filtrosOpcionesQuery.data?.acciones.forEach((o) => m.set(o.valor, o.etiqueta));
    return m;
  }, [filtrosOpcionesQuery.data]);

  const etiquetaEntidadTipo = useMemo(() => {
    const m = new Map<string, string>();
    filtrosOpcionesQuery.data?.entidadesTipo.forEach((o) => m.set(o.valor, o.etiqueta));
    return m;
  }, [filtrosOpcionesQuery.data]);

  const opcionesAccion = filtrosOpcionesQuery.data?.acciones ?? [];
  const opcionesEntidad = filtrosOpcionesQuery.data?.entidadesTipo ?? [];
  const filtrosCargando = filtrosOpcionesQuery.isLoading;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Bitácora</h1>
        <p className="text-sm text-textMuted">
          Consulta accesos y cambios importantes. Elige fechas y, si lo necesitas, filtra por tipo de actividad o por área del sistema usando las listas desplegables.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
        <p className="text-sm font-semibold text-gray-800 mb-3">Filtros</p>
        {filtrosOpcionesQuery.isError && (
          <p className="text-xs text-red-600 mb-3">No se pudieron cargar las listas de filtro. Puedes seguir viendo eventos por fecha.</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="form-label" htmlFor="auditoria-desde">
              Desde
            </label>
            <input id="auditoria-desde" type="date" className="form-input w-full" value={desde} onChange={(e) => setDesde(e.target.value)} />
          </div>
          <div>
            <label className="form-label" htmlFor="auditoria-hasta">
              Hasta
            </label>
            <input id="auditoria-hasta" type="date" className="form-input w-full" value={hasta} onChange={(e) => setHasta(e.target.value)} />
          </div>
          <div>
            <label className="form-label" htmlFor="auditoria-actividad">
              Actividad (qué se hizo)
            </label>
            <select
              id="auditoria-actividad"
              className="form-input w-full"
              value={accion}
              disabled={filtrosCargando}
              onChange={(e) => setAccion(e.target.value)}
            >
              <option value="">Todas las actividades</option>
              {opcionesAccion.map((o) => (
                <option key={o.valor} value={o.valor}>
                  {o.etiqueta}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label" htmlFor="auditoria-area">
              Área (sobre qué fue)
            </label>
            <select
              id="auditoria-area"
              className="form-input w-full"
              value={entidadTipo}
              disabled={filtrosCargando}
              onChange={(e) => setEntidadTipo(e.target.value)}
            >
              <option value="">Todas las áreas</option>
              {opcionesEntidad.map((o) => (
                <option key={o.valor} value={o.valor}>
                  {o.etiqueta}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className="text-xs text-textMuted mt-3">
          Las opciones se actualizan al cambiar las fechas: solo aparecen actividades y áreas que registraron eventos en ese periodo.
        </p>
      </div>

      {auditoriaQuery.isLoading && <StatusPanel variant="loading" title="Cargando bitácora" message="Consultando el servidor..." />}
      {auditoriaQuery.isError && <StatusPanel variant="error" title="No fue posible cargar bitácora" message="Intenta nuevamente." />}

      {!auditoriaQuery.isLoading && !auditoriaQuery.isError && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left p-3">Fecha</th>
                <th className="text-left p-3">Actividad</th>
                <th className="text-left p-3">Área</th>
                <th className="text-left p-3">Quién lo hizo</th>
                <th className="text-left p-3">Detalle</th>
              </tr>
            </thead>
            <tbody>
              {eventos.map((e) => (
                <tr key={e.id} className="border-t border-gray-100">
                  <td className="p-3 whitespace-nowrap">{new Date(e.fecha).toLocaleString()}</td>
                  <td className="p-3 whitespace-nowrap">{etiquetaAccion.get(e.accion) ?? e.accion}</td>
                  <td
                    className="p-3 whitespace-nowrap max-w-[14rem] truncate"
                    title={e.entidadId ? String(e.entidadId) : undefined}
                  >
                    {e.entidadTipo ? (etiquetaEntidadTipo.get(e.entidadTipo) ?? e.entidadTipo) : ''}
                  </td>
                  <td className="p-3 whitespace-nowrap max-w-[16rem]">
                    {e.usuarioNombre?.trim() || (e.usuarioId ? String(e.usuarioId) : '—')}
                  </td>
                  <td className="p-3 text-gray-700">{(e.detalle ?? '').replace(/;/g, ' · ')}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {eventos.length === 0 && <div className="p-10 text-center text-textMuted">Sin eventos en el rango seleccionado.</div>}
        </div>
      )}

      {!auditoriaQuery.isLoading && !auditoriaQuery.isError && (eventos.length > 0 || page > 1) && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-xl border border-gray-100 px-4 py-3">
          <p className="text-sm text-textMuted">
            Página <span className="font-semibold text-textDark">{page}</span> · hasta {PAGE_SIZE} eventos por página
          </p>
          <div className="flex gap-2">
            <button type="button" className="btn btn-light" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              Anterior
            </button>
            <button type="button" className="btn btn-light" disabled={!haySiguiente} onClick={() => setPage((p) => p + 1)}>
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Auditoria;
