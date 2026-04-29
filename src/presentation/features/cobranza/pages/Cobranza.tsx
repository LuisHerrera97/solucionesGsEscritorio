import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useDebouncedValue } from '../../../../infrastructure/hooks/useDebouncedValue';
import { useCobranzaZonaFiltro } from '../hooks/useCobranzaZonaFiltro';
import { CobranzaFilters } from '../components/cobranza/CobranzaFilters';
import { CobranzaMovimientoCard } from '../components/cobranza/CobranzaMovimientoCard';
import { CobranzaSummary } from '../components/cobranza/CobranzaSummary';
import { CobranzaZonaFiltroPanel } from '../components/cobranza/CobranzaZonaFiltroPanel';
import { useAuth } from '../../auth/context/useAuth';
import { useCobranzaMovimientosRangoQuery, useReversarMovimientoCreditoMutation } from '../../creditos/hooks/creditosHooks';
import type { MovimientoCajaCobranzaDto } from '../../../../domain/creditos/caja/types';
import { getErrorMessage } from '../../../../infrastructure/utils/getErrorMessage';
import { buildTicketHtml } from '../../../../shared/ticket/buildTicketHtml';
import { ConfirmDialog } from '../../../../infrastructure/ui/components/ConfirmDialog';

const Cobranza = () => {
  const { user, canBoton } = useAuth();
  const puedeReversarMovimiento = canBoton('CREDITO_PAGAR_FICHA') || canBoton('CREDITO_ABONAR_FICHA');
  const zonaCtx = useCobranzaZonaFiltro('COBRANZA_TODAS_ZONAS');

  const [fechaInicio, setFechaInicio] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const [fechaFin, setFechaFin] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const [busqueda, setBusqueda] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const busquedaDebounced = useDebouncedValue(busqueda);

  const cobranzaQuery = useCobranzaMovimientosRangoQuery({
    fechaDesde: fechaInicio,
    fechaHasta: fechaFin,
    clienteNombre: busquedaDebounced || undefined,
    zonaId: zonaCtx.zonaIdParam,
  });

  const movimientos = useMemo(() => cobranzaQuery.data ?? [], [cobranzaQuery.data]);
  const reversarMutation = useReversarMovimientoCreditoMutation();
  const [movimientoPendienteReversa, setMovimientoPendienteReversa] = useState<MovimientoCajaCobranzaDto | null>(null);
  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({});

  const movimientosAgrupados = useMemo(() => {
    const groups = new Map<string, MovimientoCajaCobranzaDto[]>();
    for (const m of movimientos) {
      const key = m.operacionId ?? m.id;
      const arr = groups.get(key) ?? [];
      arr.push(m);
      groups.set(key, arr);
    }

    return Array.from(groups.entries()).map(([key, items]) => {
      const ordered = items
        .slice()
        .sort((a, b) => `${b.fecha} ${b.hora ?? ''}`.localeCompare(`${a.fecha} ${a.hora ?? ''}`));
      const principal = ordered[0];
      return {
        key,
        principal,
        detalles: ordered.map((x) => ({
          id: x.id,
          numFicha: x.numeroFicha ?? 0,
          fechaPago: x.fecha,
          horaPago: x.hora ?? '-',
          abono: x.abono ?? 0,
          mora: x.mora ?? 0,
          totalCobrado: x.total ?? 0,
        })),
        abono: ordered.reduce((s, x) => s + (x.abono ?? 0), 0),
        mora: ordered.reduce((s, x) => s + (x.mora ?? 0), 0),
        total: ordered.reduce((s, x) => s + (x.total ?? 0), 0),
      };
    });
  }, [movimientos]);

  const totalCobrado = movimientosAgrupados.reduce((sum, item) => sum + item.total, 0);
  const totalPages = Math.max(1, Math.ceil(movimientosAgrupados.length / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const movimientosPagina = movimientosAgrupados.slice((pageSafe - 1) * pageSize, pageSafe * pageSize);

  useEffect(() => {
    setPage(1);
  }, [fechaInicio, fechaFin, busquedaDebounced, zonaCtx.zonaIdParam]);

  const printTicket = (item: (typeof movimientosAgrupados)[number]) => {
    const html = buildTicketHtml({
      fecha: item.principal.fecha,
      hora: item.principal.hora ?? '-',
      cliente: item.principal.clienteNombre ?? '-',
      folio: item.principal.creditoFolio ?? '-',
      concepto: item.principal.concepto ?? item.principal.tipo ?? 'Movimiento',
      ficha: item.detalles.map((d) => `#${d.numFicha}`).join(', '),
      total: item.total,
    });
    const electronApi = (window as any).ipcRenderer;
    if (electronApi?.printTicketHtml) {
      void electronApi.printTicketHtml(html);
      return;
    }
    const win = window.open('', '_blank', 'width=380,height=640');
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
  };

  const desaplicar = async (mov: MovimientoCajaCobranzaDto) => {
    if (!mov.creditoId || !mov.id) return;
    try {
      await reversarMutation.mutateAsync({ creditoId: mov.creditoId, movimientoId: mov.id });
      toast.success('Operación desaplicada');
      setMovimientoPendienteReversa(null);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'No fue posible desaplicar la operación'));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Cobranza</h1>
          <p className="text-sm text-textMuted">Registro por rango de fechas de pagos de fichas, penalizaciones y abonos.</p>
        </div>
      </div>

      <CobranzaZonaFiltroPanel
        user={user}
        puedeElegirZona={zonaCtx.puedeElegirZona}
        zonas={zonaCtx.zonas}
        zonasLoading={zonaCtx.zonasLoading}
        zonaFiltro={zonaCtx.zonaFiltro}
        onChangeZona={zonaCtx.setZonaFiltro}
        esZonaDelUsuario={zonaCtx.esZonaDelUsuario}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-4">
        <CobranzaFilters
          fechaInicio={fechaInicio}
          fechaFin={fechaFin}
          busqueda={busqueda}
          onChangeFechaInicio={setFechaInicio}
          onChangeFechaFin={setFechaFin}
          onChangeBusqueda={setBusqueda}
        />
        <CobranzaSummary movimientos={movimientosAgrupados.length} totalCobrado={totalCobrado} />

        <div className="space-y-3 pt-2">
          {cobranzaQuery.isLoading && <div className="py-8 text-center text-textMuted">Cargando...</div>}
          {cobranzaQuery.isError && <div className="py-8 text-center text-red-600">No fue posible cargar la cobranza</div>}
          {!cobranzaQuery.isLoading &&
            !cobranzaQuery.isError &&
            movimientosPagina.map((item) => (
              <CobranzaMovimientoCard
                key={item.key}
                item={{
                  id: item.principal.id,
                  creditoId: item.principal.creditoId ?? '',
                  creditoFolio: item.principal.creditoFolio ?? '',
                  clienteNombre: item.principal.clienteNombre ?? '',
                  fechaPago: item.principal.fecha,
                  horaPago: item.principal.hora ?? '-',
                  abono: item.abono,
                  mora: item.mora,
                  totalCobrado: item.total,
                  tipo: item.principal.tipo,
                  concepto: item.principal.concepto,
                  revertido: item.principal.revertido,
                  reversaDeId: item.principal.reversaDeId,
                  detalles: item.detalles,
                }}
                expanded={Boolean(expandedKeys[item.key])}
                onToggleExpanded={() => setExpandedKeys((prev) => ({ ...prev, [item.key]: !prev[item.key] }))}
                onReimprimir={() => printTicket(item)}
                onDesaplicar={puedeReversarMovimiento ? () => setMovimientoPendienteReversa(item.principal) : undefined}
              />
            ))}

          {!cobranzaQuery.isLoading && !cobranzaQuery.isError && movimientosAgrupados.length === 0 && (
            <div className="py-8 text-center text-textMuted">No hay pagos registrados en el rango de fechas seleccionado.</div>
          )}
          {!cobranzaQuery.isLoading && !cobranzaQuery.isError && movimientosAgrupados.length > 0 && (
            <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-white px-3 py-2">
              <p className="text-xs text-textMuted">
                Página {pageSafe} de {totalPages}
              </p>
              <div className="flex gap-2">
                <button type="button" className="btn btn-light px-2 py-1 text-xs" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={pageSafe === 1}>
                  Anterior
                </button>
                <button type="button" className="btn btn-light px-2 py-1 text-xs" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={pageSafe === totalPages}>
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <ConfirmDialog
        isOpen={Boolean(movimientoPendienteReversa)}
        title="Confirmar reversa"
        message={`¿Seguro que deseas desaplicar la operación ${movimientoPendienteReversa?.concepto ?? movimientoPendienteReversa?.tipo ?? ''} del crédito ${movimientoPendienteReversa?.creditoFolio ?? '-'}?`}
        confirmLabel="Desaplicar"
        cancelLabel="Cancelar"
        type="warning"
        loading={reversarMutation.isPending}
        onConfirm={() => {
          if (movimientoPendienteReversa) {
            void desaplicar(movimientoPendienteReversa);
          }
        }}
        onCancel={() => setMovimientoPendienteReversa(null)}
      />
    </div>
  );
};

export default Cobranza;
