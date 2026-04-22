import { useState, useMemo, useEffect } from 'react';
import { toast } from 'react-toastify';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  User, 
  Calendar as CalendarIcon,
  ArrowRight,
  Filter,
  MoreVertical,
  LayoutList,
  CreditCard,
} from 'lucide-react';
import { 
  useAllLiquidationsQuery, 
  useConfirmarLiquidacionMutation, 
  useRechazarLiquidacionMutation,
  useLiquidacionCobradoresResumenQuery,
  useLiquidacionMovimientosPendientesCobradorQuery,
} from '../hooks/cobranzaHooks';
import { useCobranzaZonaFiltro } from '../hooks/useCobranzaZonaFiltro';
import { CobranzaZonaFiltroPanel } from '../components/cobranza/CobranzaZonaFiltroPanel';
import { useAuth } from '../../auth/context/useAuth';
import StatusPanel from '../../../../infrastructure/ui/components/StatusPanel';
import { ConfirmDialog } from '../../../../infrastructure/ui/components/ConfirmDialog';
import { Alert } from '../../../../infrastructure/ui/components/Alert';
import { getErrorMessage } from '../../../../infrastructure/utils/getErrorMessage';
import { formatCalendarDateFromApi } from '../../../../shared/date/calendarDate';
import { useMarcarMovimientosRecibidoCajaMutation } from '../../finanzas/hooks/finanzasHooks';

const GestionLiquidacionesPage = () => {
  const { user } = useAuth();
  const zonaCtx = useCobranzaZonaFiltro('COBRANZA_TODAS_ZONAS');
  const [fechaInicio, setFechaInicio] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split('T')[0];
  });
  const [fechaFin, setFechaFin] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [fechaConsultaCobradores, setFechaConsultaCobradores] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [cobradorSeleccionado, setCobradorSeleccionado] = useState<string>('');
  
  // Modales
  const [confirmModal, setConfirmModal] = useState<{ id: string; name: string } | null>(null);
  const [rejectModal, setRejectModal] = useState<{ id: string; name: string } | null>(null);

  const query = useAllLiquidationsQuery(fechaInicio, fechaFin, zonaCtx.zonaIdParam);
  const cobradoresResumenQuery = useLiquidacionCobradoresResumenQuery({
    fechaDesde: fechaConsultaCobradores,
    fechaHasta: fechaConsultaCobradores,
    zonaId: zonaCtx.zonaIdParam,
  });
  const movimientosCobradorQuery = useLiquidacionMovimientosPendientesCobradorQuery(
    cobradorSeleccionado || undefined,
    fechaConsultaCobradores,
  );
  const marcarRecibidoMutation = useMarcarMovimientosRecibidoCajaMutation();
  const confirmMutation = useConfirmarLiquidacionMutation();
  const rejectMutation = useRechazarLiquidacionMutation();

  const cobradoresLista = cobradoresResumenQuery.data?.cobradores ?? [];
  const estadosFichas = cobradoresResumenQuery.data?.estados;

  useEffect(() => {
    const ids = new Set(cobradoresLista.map((c) => c.cobradorId));
    if (cobradorSeleccionado && !ids.has(cobradorSeleccionado)) {
      setCobradorSeleccionado('');
    }
  }, [cobradoresLista, cobradorSeleccionado]);

  const movimientosPendientesCaja = movimientosCobradorQuery.data ?? [];
  const movimientosPorCobrarCaja = movimientosPendientesCaja.filter((m) => !m.recibidoCaja);
  const idsPendientesCaja = movimientosPorCobrarCaja.map((m) => m.id);
  const totalPendienteCaja = movimientosPorCobrarCaja.reduce((acc, m) => acc + m.total, 0);
  const totalPendienteEfectivoCaja = movimientosPorCobrarCaja.reduce(
    (acc, m) => acc + (m.montoEfectivo ?? (m.medio === 'Efectivo' ? m.total : 0)),
    0,
  );
  const totalPendienteTarjetaCaja = movimientosPorCobrarCaja.reduce(
    (acc, m) => acc + (m.medio === 'Tarjeta' ? m.total : 0),
    0,
  );

  const handleConfirmAction = async () => {
    if (!confirmModal) return;
    try {
      await confirmMutation.mutateAsync(confirmModal.id);
      toast.success('Liquidación confirmada y registrada en caja');
      setConfirmModal(null);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'Error al confirmar'));
    }
  };

  const handleRejectAction = async () => {
    if (!rejectModal) return;
    try {
      await rejectMutation.mutateAsync(rejectModal.id);
      toast.success('Liquidación rechazada');
      setRejectModal(null);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'Error al rechazar'));
    }
  };

  const handleMarcarPendientesComoCobrado = async () => {
    if (idsPendientesCaja.length === 0) return;
    try {
      const fecha = `${fechaConsultaCobradores}T00:00:00.000Z`;
      await marcarRecibidoMutation.mutateAsync({
        movimientoIds: idsPendientesCaja,
        fecha,
      });
      toast.success('Movimientos marcados como cobrado');
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'No fue posible marcar como cobrado'));
    }
  };

  const pendingLiquidations = useMemo(() => {
    return (query.data ?? []).filter(l => l.estatus.toLowerCase() === 'enviada');
  }, [query.data]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textDark flex items-center gap-2">
            <ShieldCheck className="text-primaryBlue" />
            Gestión de Liquidaciones
          </h1>
          <p className="text-textMuted mt-1">Supervisa y valida las liquidaciones enviadas por los cobradores.</p>
        </div>
      </div>

      {/* Stats Section */}
      <CobranzaZonaFiltroPanel
        user={user}
        puedeElegirZona={zonaCtx.puedeElegirZona}
        zonas={zonaCtx.zonas}
        zonasLoading={zonaCtx.zonasLoading}
        zonaFiltro={zonaCtx.zonaFiltro}
        onChangeZona={zonaCtx.setZonaFiltro}
        esZonaDelUsuario={zonaCtx.esZonaDelUsuario}
      />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-textDark flex items-center gap-2">
              <LayoutList className="text-primaryBlue" size={22} />
              Recaudación por cobrador
            </h3>
            <p className="text-sm text-textMuted mt-1">
              Totales agrupados en servidor por cobrador (fichas e ingresos de cobranza del día). Elige un cobrador para ver efectivo, tarjeta, transferencia y cada movimiento pendiente de liquidar.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200 shrink-0">
            <CalendarIcon size={16} className="text-textMuted" />
            <span className="text-xs font-semibold text-textMuted uppercase">Día</span>
            <input
              type="date"
              className="bg-transparent border-none text-sm p-0 focus:ring-0"
              value={fechaConsultaCobradores}
              onChange={(e) => setFechaConsultaCobradores(e.target.value)}
            />
          </div>
        </div>

        {cobradoresResumenQuery.isError && (
          <StatusPanel variant="error" title="No se pudo cargar el resumen" message="Verifica permisos o tu conexión e intenta de nuevo." />
        )}

        {estadosFichas && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-3">
              <p className="text-[10px] font-bold text-textMuted uppercase">Total fichas día</p>
              <p className="text-lg font-black text-textDark">${estadosFichas.total.toLocaleString()}</p>
            </div>
            <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-3">
              <p className="text-[10px] font-bold text-amber-800/80 uppercase">Pendiente liq.</p>
              <p className="text-lg font-black text-amber-700">${estadosFichas.pendiente.toLocaleString()}</p>
            </div>
            <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-3">
              <p className="text-[10px] font-bold text-blue-800/80 uppercase">Enviado (liq.)</p>
              <p className="text-lg font-black text-blue-700">${estadosFichas.liquidado.toLocaleString()}</p>
            </div>
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-3">
              <p className="text-[10px] font-bold text-emerald-800/80 uppercase">En corte</p>
              <p className="text-lg font-black text-emerald-700">${estadosFichas.enCorte.toLocaleString()}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-4 lg:items-end">
          <div className="flex-1 min-w-0">
            <label className="block text-xs font-semibold text-textMuted uppercase tracking-wide mb-1.5">Cobrador</label>
            <select
              className="form-input w-full max-w-xl"
              value={cobradorSeleccionado}
              onChange={(e) => setCobradorSeleccionado(e.target.value)}
              disabled={cobradoresResumenQuery.isLoading}
            >
              <option value="">Selecciona un cobrador…</option>
              {cobradoresLista.map((c) => (
                <option key={c.cobradorId} value={c.cobradorId}>
                  {c.nombreCobrador} — {c.cantidadMovimientos} mov. — ${c.total.toLocaleString()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {cobradorSeleccionado && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="rounded-xl border border-primaryBlue/20 bg-primaryBlue/5 p-4">
              <p className="text-[10px] font-bold text-textMuted uppercase">Total</p>
              <p className="text-xl font-black text-primaryBlue">${totalPendienteCaja.toLocaleString()}</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-4">
              <p className="text-[10px] font-bold text-textMuted uppercase">Efectivo</p>
              <p className="text-xl font-black text-textDark">${totalPendienteEfectivoCaja.toLocaleString()}</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-4">
              <p className="text-[10px] font-bold text-textMuted uppercase flex items-center gap-1">
                <CreditCard size={12} /> Tarjeta
              </p>
              <p className="text-xl font-black text-textDark">${totalPendienteTarjetaCaja.toLocaleString()}</p>
            </div>
          </div>
        )}

        {cobradorSeleccionado && (
          <div className="border-t border-gray-100 pt-5">
            <h4 className="text-sm font-bold text-textDark mb-3">Movimientos pendientes de liquidar (caja)</h4>
            {idsPendientesCaja.length > 0 && (
              <div className="mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="text-sm text-textMuted">
                  ${totalPendienteEfectivoCaja.toLocaleString()} efectivo • ${totalPendienteTarjetaCaja.toLocaleString()} tarjeta • Total ${totalPendienteCaja.toLocaleString()}
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleMarcarPendientesComoCobrado}
                  disabled={marcarRecibidoMutation.isPending}
                >
                  Marcar como cobrado
                </button>
              </div>
            )}
            {movimientosCobradorQuery.isLoading && (
              <div className="py-12 flex justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primaryBlue" />
              </div>
            )}
            {movimientosCobradorQuery.isError && (
              <StatusPanel variant="error" title="Error" message="No se pudieron cargar los movimientos." />
            )}
            {!movimientosCobradorQuery.isLoading && !movimientosCobradorQuery.isError && (
              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50/80 text-[10px] font-bold text-textMuted uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Fecha</th>
                      <th className="px-4 py-3">Hora</th>
                      <th className="px-4 py-3">Tipo</th>
                      <th className="px-4 py-3">Concepto</th>
                      <th className="px-4 py-3">Medio</th>
                      <th className="px-4 py-3 text-right">Total</th>
                      <th className="px-4 py-3">Estado ficha</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(movimientosCobradorQuery.data ?? []).length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-10 text-center text-textMuted">
                          No hay movimientos pendientes de liquidación para este cobrador en la fecha seleccionada.
                        </td>
                      </tr>
                    ) : (
                      movimientosCobradorQuery.data?.map((m) => (
                        <tr key={m.id} className="hover:bg-gray-50/50">
                          <td className="px-4 py-2.5 whitespace-nowrap">{formatCalendarDateFromApi(m.fecha)}</td>
                          <td className="px-4 py-2.5 text-textMuted">{m.hora ?? '—'}</td>
                          <td className="px-4 py-2.5">{m.tipo}</td>
                          <td className="px-4 py-2.5 max-w-[220px] truncate" title={m.concepto ?? ''}>
                            {m.concepto ?? '—'}
                          </td>
                          <td className="px-4 py-2.5">{m.medio}</td>
                          <td className="px-4 py-2.5 text-right font-semibold">${m.total.toLocaleString()}</td>
                          <td className="px-4 py-2.5 text-xs text-textMuted">{m.estatusFichaFinanzas ?? '—'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>


      {/* Pending Reviews Section */}
      {pendingLiquidations.length > 0 && (
        <div className="space-y-4 animate-in slide-in-from-left-4 duration-300">
          <h3 className="text-lg font-bold text-textDark flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Liquidaciones por Confirmar
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {pendingLiquidations.map((liq) => (
              <div key={liq.id} className="bg-white rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-all overflow-hidden border-l-4 border-l-primaryBlue">
                <div className="p-5 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-textMuted">
                      <User size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-textDark text-lg">Cobrador #{liq.cobradorId.toString().substring(0, 5)}</h4>
                      <p className="text-sm text-textMuted flex items-center gap-1.5 mt-0.5">
                        <CalendarIcon size={14} /> {formatCalendarDateFromApi(liq.fecha)} a las {liq.hora}
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-primaryBlue font-black text-xl">
                    ${liq.total.toLocaleString()}
                  </div>
                </div>

                <div className="px-5 pb-5 grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <span className="text-textMuted block opacity-70 uppercase tracking-tighter">Efectivo</span>
                    <span className="font-bold text-textDark text-base">${liq.totalEfectivo.toLocaleString()}</span>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <span className="text-textMuted block opacity-70 uppercase tracking-tighter">Transferencia</span>
                    <span className="font-bold text-textDark text-base">${liq.totalTransferencia.toLocaleString()}</span>
                  </div>
                </div>

                {liq.evidencia && (
                  <div className="px-5 mb-4">
                    <Alert type="info" message={liq.evidencia} title="Evidencia adjunta" />
                  </div>
                )}

                <div className="px-5 py-4 bg-gray-50/50 flex items-center gap-2 border-t border-gray-100">
                  <button 
                    onClick={() => setRejectModal({ id: liq.id, name: `Cobrador ${liq.cobradorId.toString().substring(0, 5)}` })}
                    className="flex-1 btn btn-light text-red-600 hover:bg-red-50 border-red-100 py-2.5"
                  >
                    Rechazar
                  </button>
                  <button 
                    onClick={() => setConfirmModal({ id: liq.id, name: `Cobrador ${liq.cobradorId.toString().substring(0, 5)}` })}
                    className="flex-[2] btn btn-primary py-2.5 flex items-center justify-center gap-2"
                  >
                    Confirmar Recepción <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-textDark flex items-center gap-2">
            <Filter className="text-textMuted" size={20} />
            Todas las Liquidaciones
          </h3>

          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
              <CalendarIcon size={16} className="text-textMuted" />
              <input type="date" className="bg-transparent border-none text-sm p-0 focus:ring-0" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
              <span className="text-gray-300">|</span>
              <input type="date" className="bg-transparent border-none text-sm p-0 focus:ring-0" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          {query.isLoading && (
            <div className="p-20 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primaryBlue mb-4"></div>
              <p className="text-textMuted font-medium">Buscando registros...</p>
            </div>
          )}

          {!query.isLoading && (
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 text-[10px] font-bold text-textMuted uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">Cobrador</th>
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4 text-right">Monto</th>
                  <th className="px-6 py-4">Evidencia</th>
                  <th className="px-6 py-4">Estatus</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(!query.data || query.data.length === 0) ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                       <div className="flex flex-col items-center justify-center text-textMuted">
                          <Filter size={40} className="mb-3 opacity-20" />
                          <p className="text-lg font-medium">No se encontraron liquidaciones</p>
                          <p className="text-sm">Prueba ajustando el rango de fechas o el filtro de zona.</p>
                       </div>
                    </td>
                  </tr>
                ) : (
                  query.data.map(liq => (
                    <tr key={liq.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-primaryBlue text-[10px] font-bold">
                            {liq.nombreCobrador ? liq.nombreCobrador.substring(0, 2).toUpperCase() : 'FS'}
                          </div>
                          <span className="text-sm font-semibold text-textDark">{liq.nombreCobrador ?? `ID ${liq.cobradorId.toString().substring(0, 8)}`}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-textDark">{formatCalendarDateFromApi(liq.fecha)}</div>
                        <div className="text-[10px] text-textMuted opacity-70">{liq.hora}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-bold text-textDark">${liq.total.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-textMuted truncate max-w-[150px] inline-block" title={liq.evidencia ?? undefined}>{liq.evidencia || '-'}</span>
                      </td>
                      <td className="px-6 py-4">
                        {liq.estatus.toLowerCase() === 'confirmada' ? (
                          <span className="py-1 px-3 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 w-max">
                            <CheckCircle2 size={10} /> Confirmada
                          </span>
                        ) : liq.estatus.toLowerCase() === 'enviada' ? (
                          <span className="py-1 px-3 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 w-max">
                            <Clock size={10} /> Pendiente
                          </span>
                        ) : (
                          <span className="py-1 px-3 rounded-full bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 w-max">
                            <XCircle size={10} /> Rechazada
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                         <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-textMuted">
                            <MoreVertical size={16} />
                         </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog 
        isOpen={!!confirmModal}
        title="Confirmar Liquidación"
        message={`¿Estás seguro de que deseas confirmar la liquidación de ${confirmModal?.name}? Esto registrará automáticamente una entrada en el libro de caja.`}
        type="success"
        confirmLabel="Sí, Confirmar"
        loading={confirmMutation.isPending}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmModal(null)}
      />

       {/* Reject Dialog */}
       <ConfirmDialog 
        isOpen={!!rejectModal}
        title="Rechazar Liquidación"
        message={`¿Estás seguro de que deseas rechazar la liquidación de ${rejectModal?.name}? Los movimientos volverán a aparecer como pendientes para el cobrador.`}
        type="danger"
        confirmLabel="Sí, Rechazar"
        loading={rejectMutation.isPending}
        onConfirm={handleRejectAction}
        onCancel={() => setRejectModal(null)}
      />
    </div>
  );
};

export default GestionLiquidacionesPage;
