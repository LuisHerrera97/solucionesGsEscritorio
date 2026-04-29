import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { ConfirmDialog } from '../../../../infrastructure/ui/components/ConfirmDialog';
import { ModalShell } from '../../../../infrastructure/ui/components/ModalShell';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { Cliente } from '../../../../domain/creditos/types';
import { useDebouncedValue } from '../../../../infrastructure/hooks/useDebouncedValue';
import StatusPanel from '../../../../infrastructure/ui/components/StatusPanel';
import { getErrorMessage } from '../../../../infrastructure/utils/getErrorMessage';
import { asNumber, numberInputDisplay, parseNumberInput, type NumberInputValue } from '../../../../infrastructure/utils/numberInput';
import { useAuth } from '../../auth/context/useAuth';
import { useZonasCobranzaQuery } from '../../general/hooks/generalHooks';
import {
  useActualizarClienteMutation,
  useAbonarFichasVigentesCreditoMutation,
  useClientesQuery,
  useCrearClienteMutation,
  useEliminarClienteMutation,
} from '../hooks/creditosHooks';
import { ClienteCard } from '../components/clientes/ClienteCard';
import { ClienteModal, type ClienteDraft } from '../components/clientes/ClienteModal';
import { ClientesHeader } from '../components/clientes/ClientesHeader';
import { ClientesSearchBar } from '../components/clientes/ClientesSearchBar';
import { useCobranzaZonaFiltro } from '../../cobranza/hooks/useCobranzaZonaFiltro';
import { CobranzaZonaFiltroPanel } from '../../cobranza/components/cobranza/CobranzaZonaFiltroPanel';
import { ClientesService } from '../../../../infrastructure/servicios/api/creditos/ClientesService';
import { CreditosService } from '../../../../infrastructure/servicios/api/creditos/CreditosService';
import { buildTicketHtml } from '../../../../shared/ticket/buildTicketHtml';
import { fichasNoPagadasOrdenadasParaPagoMultiples } from '../../../../shared/creditos/fichasPagoOrden';

const PAGE_SIZE = 12;
const BUSCAR_DEBOUNCE_MS = 300;

const PERM_CLIENTE_TODAS_ZONAS = 'CLIENTE_TODAS_ZONAS';
type MedioPagoCobro = 'Efectivo' | 'Transferencia' | 'Mixto';

const clienteDraftVacio = (): ClienteDraft => ({
  nombre: '',
  apellido: '',
  direccion: '',
  negocio: '',
  zona: '',
  estatus: 'Activo',
});

const clienteADraft = (c: Cliente): ClienteDraft => ({
  id: c.id,
  nombre: c.nombre,
  apellido: c.apellido,
  direccion: c.direccion,
  negocio: c.negocio,
  zona: c.zona,
  estatus: c.estatus,
});

const Clientes = () => {
  const navigate = useNavigate();
  const { user, canBoton } = useAuth();
  /* Quien puede crear clientes puede editarlos/eliminarlos; o permisos dedicados si existen en BD */
  const puedeEditar = canBoton('CLIENTE_EDITAR') || canBoton('CLIENTE_CREAR');
  const puedeEliminar = canBoton('CLIENTE_ELIMINAR') || canBoton('CLIENTE_CREAR');
  const puedePagarFichasVigentesCliente = canBoton('CREDITO_PAGAR_FICHA') || canBoton('CREDITO_ABONAR_FICHA');

  const [searchParams] = useSearchParams();
  const qFromUrl = searchParams.get('q')?.trim() ?? '';
  const [searchTerm, setSearchTerm] = useState(qFromUrl);
  const [page, setPage] = useState(1);

  const {
    puedeElegirZona,
    zonaFiltro,
    setZonaFiltro,
    zonaIdParam,
    zonas,
    zonasLoading,
    esZonaDelUsuario,
  } = useCobranzaZonaFiltro(PERM_CLIENTE_TODAS_ZONAS);

  useEffect(() => {
    setSearchTerm(qFromUrl);
  }, [qFromUrl]);

  const buscarDebounced = useDebouncedValue(searchTerm, BUSCAR_DEBOUNCE_MS);
  const buscarApi = buscarDebounced.trim() === '' ? undefined : buscarDebounced.trim();

  useEffect(() => {
    setPage(1);
  }, [buscarApi, qFromUrl, zonaIdParam]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clienteDraft, setClienteDraft] = useState<ClienteDraft>(clienteDraftVacio);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Cliente | null>(null);
  const [creditoPagoSeleccionado, setCreditoPagoSeleccionado] = useState<{ id: string; folio: string } | null>(null);
  const [cantidadFichasPago, setCantidadFichasPago] = useState<NumberInputValue>(1);
  const [medioPago, setMedioPago] = useState<MedioPagoCobro>('Efectivo');
  const [montoEfectivo, setMontoEfectivo] = useState<NumberInputValue>(0);
  const [montoTransferencia, setMontoTransferencia] = useState<NumberInputValue>(0);
  const [ticketPagoFichas, setTicketPagoFichas] = useState<{ folio: string; cantidad: number; total: number } | null>(null);

  const clientesQuery = useClientesQuery({ page, pageSize: PAGE_SIZE, buscar: buscarApi, zonaId: zonaIdParam });
  const createMutation = useCrearClienteMutation();
  const updateMutation = useActualizarClienteMutation();
  const deleteMutation = useEliminarClienteMutation();
  const abonarFichasVigentesMutation = useAbonarFichasVigentesCreditoMutation();
  const zonasCobranzaQuery = useZonasCobranzaQuery();
  const zonasCobranza = useMemo(() => {
    const zonas = zonasCobranzaQuery.data ?? [];
    return zonas
      .filter((z) => z.activo)
      .slice()
      .sort((a, b) => a.orden - b.orden)
      .map((z) => z.nombre);
  }, [zonasCobranzaQuery.data]);

  const abrirNuevoCliente = () => {
    setClienteDraft(clienteDraftVacio());
    setIsModalOpen(true);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setClienteDraft(clienteDraftVacio());
  };

  const handleGuardarCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !clienteDraft.nombre.trim() ||
      !clienteDraft.apellido.trim() ||
      !clienteDraft.direccion.trim() ||
      !clienteDraft.negocio.trim() ||
      !clienteDraft.zona.trim()
    ) {
      return;
    }
    const zonaTrim = clienteDraft.zona.trim();
    const zonaNormalizada = zonasCobranza.find((zona) => zona.toLowerCase() === zonaTrim.toLowerCase());
    if (zonasCobranza.length > 0 && !zonaNormalizada) {
      toast.error('Selecciona una zona válida');
      return;
    }

    const payload: Omit<Cliente, 'id'> = {
      nombre: clienteDraft.nombre.trim(),
      apellido: clienteDraft.apellido.trim(),
      direccion: clienteDraft.direccion.trim(),
      negocio: clienteDraft.negocio.trim(),
      zona: zonaNormalizada ?? zonaTrim,
      estatus: clienteDraft.estatus,
    };

    try {
      if (clienteDraft.id) {
        await updateMutation.mutateAsync({ id: clienteDraft.id, payload });
        toast.success('Cliente actualizado');
      } else {
        await createMutation.mutateAsync(payload);
        toast.success('Cliente creado');
      }
      cerrarModal();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, clienteDraft.id ? 'No fue posible actualizar el cliente' : 'No fue posible crear el cliente'));
    }
  };

  const handleEliminarCliente = async () => {
    if (!confirmDelete) return;
    try {
      await deleteMutation.mutateAsync(confirmDelete.id);
      toast.success('Cliente eliminado');
      if (clienteSeleccionado?.id === confirmDelete.id) {
        setClienteSeleccionado(null);
      }
      setConfirmDelete(null);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'No fue posible eliminar el cliente'));
    }
  };

  const clientes = useMemo(() => clientesQuery.data?.items ?? [], [clientesQuery.data?.items]);
  const totalCount = clientesQuery.data?.totalCount ?? 0;

  const canGoNext = useMemo(() => page * PAGE_SIZE < totalCount, [page, totalCount]);

  useEffect(() => {
    if (clientesQuery.isLoading || clientesQuery.isError) return;
    const maxPage = Math.max(1, Math.ceil(totalCount / PAGE_SIZE) || 1);
    if (totalCount === 0) {
      if (page !== 1) setPage(1);
      return;
    }
    if (page > maxPage) setPage(maxPage);
  }, [clientesQuery.isLoading, clientesQuery.isError, page, totalCount]);

  const creditosClienteQuery = useQuery({
    queryKey: ['creditos', 'clientes', clienteSeleccionado?.id ?? '', 'creditos'],
    queryFn: () => ClientesService.getCreditos(clienteSeleccionado?.id as string),
    enabled: Boolean(clienteSeleccionado?.id),
  });
  const creditoPagoDetalleQuery = useQuery({
    queryKey: ['creditos', 'creditos', creditoPagoSeleccionado?.id ?? ''],
    queryFn: () => CreditosService.getById(creditoPagoSeleccionado?.id as string),
    enabled: Boolean(creditoPagoSeleccionado?.id),
  });

  const guardandoCliente = createMutation.isPending || updateMutation.isPending;
  const fichasVigentesPago = useMemo(
    () => fichasNoPagadasOrdenadasParaPagoMultiples(creditoPagoDetalleQuery.data?.fichas ?? []),
    [creditoPagoDetalleQuery.data?.fichas],
  );
  const maxFichasVigentes = fichasVigentesPago.length;
  const cantidadFichasPagoN = Math.floor(asNumber(cantidadFichasPago));
  const cantidadFichasValida = cantidadFichasPagoN > 0 && cantidadFichasPagoN <= maxFichasVigentes;
  const montoPagoCalculado = useMemo(() => {
    if (!cantidadFichasValida) return 0;
    return fichasVigentesPago
      .slice(0, cantidadFichasPagoN)
      .reduce((acc, ficha) => acc + (ficha.saldoPendiente ?? ficha.total ?? 0), 0);
  }, [cantidadFichasPagoN, cantidadFichasValida, fichasVigentesPago]);
  const totalMedioMixto = asNumber(montoEfectivo) + asNumber(montoTransferencia);
  const diferenciaMixto = montoPagoCalculado - totalMedioMixto;
  const medioValido = medioPago !== 'Mixto' || Math.abs(totalMedioMixto - montoPagoCalculado) <= 0.01;
  const puedeConfirmarPagoFichas =
    Boolean(creditoPagoSeleccionado) &&
    !abonarFichasVigentesMutation.isPending &&
    cantidadFichasValida &&
    montoPagoCalculado > 0 &&
    medioValido;

  const abrirModalPagarFichas = (creditoId: string, folio: string) => {
    setCreditoPagoSeleccionado({ id: creditoId, folio });
    setCantidadFichasPago(1);
    setMedioPago('Efectivo');
    setMontoEfectivo(0);
    setMontoTransferencia(0);
  };

  const seleccionarMedioPago = (medio: MedioPagoCobro) => {
    setMedioPago(medio);
    if (medio === 'Mixto') {
      setMontoEfectivo(montoPagoCalculado);
      setMontoTransferencia(0);
    }
  };

  const cerrarModalPagarFichas = () => {
    setCreditoPagoSeleccionado(null);
    setCantidadFichasPago(1);
    setMedioPago('Efectivo');
    setMontoEfectivo(0);
    setMontoTransferencia(0);
  };

  const handlePagarFichasVigentes = async () => {
    if (!creditoPagoSeleccionado || !puedeConfirmarPagoFichas) return;
    try {
      await abonarFichasVigentesMutation.mutateAsync({
        creditoId: creditoPagoSeleccionado.id,
        cantidadFichas: cantidadFichasPagoN,
        montoAbono: montoPagoCalculado,
        medio: medioPago,
        montoEfectivo: medioPago === 'Mixto' ? asNumber(montoEfectivo) : undefined,
        montoTransferencia: medioPago === 'Mixto' ? asNumber(montoTransferencia) : undefined,
      });
      toast.success('Pago de fichas registrado');
      setTicketPagoFichas({
        folio: creditoPagoSeleccionado.folio,
        cantidad: cantidadFichasPagoN,
        total: montoPagoCalculado,
      });
      cerrarModalPagarFichas();
      await creditosClienteQuery.refetch();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'No fue posible registrar el pago de fichas vigentes'));
    }
  };
  const imprimirTicketPagoFichas = () => {
    if (!ticketPagoFichas) return;
    const now = new Date();
    const html = buildTicketHtml({
      fecha: now.toLocaleDateString(),
      hora: now.toLocaleTimeString(),
      cliente: `${clienteSeleccionado?.nombre ?? ''} ${clienteSeleccionado?.apellido ?? ''}`.trim() || '-',
      folio: ticketPagoFichas.folio,
      concepto: 'Pago de fichas vigentes',
      ficha: `${ticketPagoFichas.cantidad} ficha(s)`,
      total: ticketPagoFichas.total,
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

  const rangoDesde = totalCount === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangoHasta = Math.min(page * PAGE_SIZE, totalCount);

  return (
    <div className="space-y-6">
      <ClientesHeader onNuevo={abrirNuevoCliente} />

      <ClientesSearchBar value={searchTerm} onChange={setSearchTerm} />

      <CobranzaZonaFiltroPanel
        user={user}
        puedeElegirZona={puedeElegirZona}
        zonas={zonas}
        zonasLoading={zonasLoading}
        zonaFiltro={zonaFiltro}
        onChangeZona={setZonaFiltro}
        esZonaDelUsuario={esZonaDelUsuario}
      />

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="text-sm text-textMuted">
          {clientesQuery.isLoading ? (
            <>Cargando…</>
          ) : totalCount > 0 ? (
            <>
              Mostrando <span className="font-semibold text-textDark">{rangoDesde}</span>–
              <span className="font-semibold text-textDark">{rangoHasta}</span> de{' '}
              <span className="font-semibold text-textDark">{totalCount}</span>
              <span className="mx-2 text-gray-300">·</span>
              Página <span className="font-semibold text-textDark">{page}</span>
            </>
          ) : (
            <>Sin resultados</>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="btn btn-light" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1 || clientesQuery.isLoading}>
            Anterior
          </button>
          <button type="button" className="btn btn-light" onClick={() => setPage((p) => p + 1)} disabled={!canGoNext || clientesQuery.isLoading}>
            Siguiente
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {clientesQuery.isLoading && <StatusPanel variant="loading" title="Cargando clientes" message="Consultando el servidor..." />}
        {clientesQuery.isError && <StatusPanel variant="error" title="No fue posible cargar clientes" message="Intenta nuevamente." />}
        {clientes.map((cliente) => (
          <div key={cliente.id} className="space-y-2">
            <ClienteCard
              cliente={cliente}
              puedeEditar={puedeEditar}
              puedeEliminar={puedeEliminar}
              onEditar={() => {
                setClienteDraft(clienteADraft(cliente));
                setIsModalOpen(true);
              }}
              onEliminar={() => setConfirmDelete(cliente)}
            />
            <button type="button" className="btn btn-light w-full" onClick={() => setClienteSeleccionado(cliente)}>
              Ver créditos
            </button>
          </div>
        ))}
        {!clientesQuery.isLoading && !clientesQuery.isError && clientes.length === 0 && (
          <StatusPanel
            variant="empty"
            title={buscarApi ? 'Sin coincidencias' : 'Sin clientes'}
            message={buscarApi ? 'Prueba con otro término de búsqueda.' : 'Crea tu primer cliente para empezar.'}
          />
        )}
      </div>

      {clienteSeleccionado && (
        <ModalShell
          open
          onClose={() => setClienteSeleccionado(null)}
          title="Créditos del cliente"
          subtitle={
            <>
              <span className="font-medium text-textDark">
                {clienteSeleccionado.nombre} {clienteSeleccionado.apellido}
              </span>
              <span className="text-slate-400"> · </span>
              <span>
                {clienteSeleccionado.negocio} · {clienteSeleccionado.zona}
              </span>
            </>
          }
          titleId="clientes-creditos-modal-titulo"
        >
          {creditosClienteQuery.isLoading && <StatusPanel variant="loading" title="Cargando créditos" message="Consultando el servidor..." />}
          {creditosClienteQuery.isError && <StatusPanel variant="error" title="No fue posible cargar créditos" message="Intenta nuevamente." />}
          {!creditosClienteQuery.isLoading && !creditosClienteQuery.isError && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">Vigentes</h3>
                {(creditosClienteQuery.data?.vigentes ?? []).length === 0 ? (
                  <p className="text-sm text-textMuted">Sin créditos vigentes.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {creditosClienteQuery.data?.vigentes.map((c) => (
                      <div key={c.id} className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 shadow-sm transition hover:border-slate-300 hover:bg-white">
                        <div className="flex items-start justify-between gap-2">
                          <div className="font-semibold text-textDark">{c.folio}</div>
                          <span className="badge badge-warning shrink-0">{c.estatus}</span>
                        </div>
                        <div className="mt-2 text-sm text-textMuted">
                          Total: ${c.total.toLocaleString()} · Pagado: ${c.pagado.toLocaleString()}
                        </div>
                        <div className={`mt-3 flex flex-col gap-2 ${puedePagarFichasVigentesCliente ? 'sm:flex-row' : ''}`}>
                          <button
                            type="button"
                            className={`btn btn-light w-full ${puedePagarFichasVigentesCliente ? 'sm:flex-1' : ''}`}
                            onClick={() => {
                              setClienteSeleccionado(null);
                              navigate(`/creditos/${c.id}`);
                            }}
                          >
                            Ver crédito
                          </button>
                          {puedePagarFichasVigentesCliente && (
                            <button type="button" className="btn btn-primary w-full sm:flex-1" onClick={() => abrirModalPagarFichas(c.id, c.folio)}>
                              Pagar fichas
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">Liquidados</h3>
                {(creditosClienteQuery.data?.liquidados ?? []).length === 0 ? (
                  <p className="text-sm text-textMuted">Sin créditos liquidados.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {creditosClienteQuery.data?.liquidados.map((c) => (
                      <div
                        key={c.id}
                        className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 text-left shadow-sm transition hover:border-slate-300 hover:bg-white"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="font-semibold text-textDark">{c.folio}</div>
                          <span className="badge badge-success shrink-0">{c.estatus}</span>
                        </div>
                        <div className="mt-2 text-sm text-textMuted">
                          Total: ${c.total.toLocaleString()} · Pagado: ${c.pagado.toLocaleString()}
                        </div>
                        <button
                          type="button"
                          className="btn btn-light mt-3 w-full"
                          onClick={() => {
                            setClienteSeleccionado(null);
                            navigate(`/creditos/${c.id}`);
                          }}
                        >
                          Ver crédito
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </ModalShell>
      )}

      <ClienteModal
        open={isModalOpen}
        value={clienteDraft}
        saving={guardandoCliente}
        zonas={zonasCobranza}
        zonasLoading={zonasCobranzaQuery.isLoading}
        onChange={setClienteDraft}
        onClose={cerrarModal}
        onSubmit={handleGuardarCliente}
      />

      {creditoPagoSeleccionado && (
        <ModalShell
          open
          onClose={cerrarModalPagarFichas}
          title="Pagar fichas vigentes"
          subtitle={creditoPagoSeleccionado.folio}
          maxWidthClassName="max-w-md"
          titleId="clientes-pago-fichas-modal-titulo"
        >
          <div className="space-y-4">
            {creditoPagoDetalleQuery.isLoading && <StatusPanel variant="loading" title="Cargando crédito" message="Obteniendo fichas vigentes..." />}
            {creditoPagoDetalleQuery.isError && <StatusPanel variant="error" title="No fue posible cargar el crédito" message="Intenta nuevamente." />}

            {!creditoPagoDetalleQuery.isLoading && !creditoPagoDetalleQuery.isError && (
              <>
                <div>
                  <label className="mb-1 block text-sm font-medium text-textDark">Cantidad de fichas a pagar</label>
                  <input
                    type="number"
                    min={1}
                    max={Math.max(1, maxFichasVigentes)}
                    className="input w-full"
                    value={numberInputDisplay(cantidadFichasPago)}
                    onChange={(e) => setCantidadFichasPago(parseNumberInput(e.target.value))}
                  />
                  <p className="mt-1 text-xs text-textMuted">Vigentes disponibles: {maxFichasVigentes}</p>
                  {!cantidadFichasValida && <p className="mt-1 text-xs text-red-600">La cantidad no puede ser mayor a las fichas vigentes.</p>}
                </div>

                <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <p className="text-xs uppercase tracking-wide text-textMuted">Monto a pagar</p>
                  <p className="text-2xl font-bold text-textDark">${montoPagoCalculado.toLocaleString()}</p>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-textDark">Tipo de pago</p>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Efectivo', 'Transferencia', 'Mixto'] as MedioPagoCobro[]).map((m) => (
                      <button
                        key={m}
                        type="button"
                        className={`btn ${medioPago === m ? 'btn-primary' : 'btn-light'}`}
                        onClick={() => seleccionarMedioPago(m)}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {medioPago === 'Mixto' && (
                  <div className="space-y-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-textDark">Efectivo</label>
                        <div className="relative">
                          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-textMuted">$</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            className="input w-full pl-7"
                            placeholder="0.00"
                            value={numberInputDisplay(montoEfectivo)}
                            onChange={(e) => setMontoEfectivo(parseNumberInput(e.target.value))}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-textDark">Transferencia</label>
                        <div className="relative">
                          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-textMuted">$</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            className="input w-full pl-7"
                            placeholder="0.00"
                            value={numberInputDisplay(montoTransferencia)}
                            onChange={(e) => setMontoTransferencia(parseNumberInput(e.target.value))}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-textMuted">Total capturado: <span className="font-semibold text-textDark">${totalMedioMixto.toLocaleString()}</span></p>
                      <p className={`text-xs ${medioValido ? 'text-emerald-600' : 'text-red-600'}`}>
                        Diferencia: ${Math.abs(diferenciaMixto).toLocaleString()}
                        {diferenciaMixto > 0 ? ' pendiente' : diferenciaMixto < 0 ? ' excedente' : ' exacto'}
                      </p>
                    </div>
                    {!medioValido && <p className="text-xs text-red-600">La suma de efectivo y transferencia debe coincidir con el monto a pagar.</p>}
                  </div>
                )}

                <button type="button" className="btn btn-primary w-full" disabled={!puedeConfirmarPagoFichas} onClick={handlePagarFichasVigentes}>
                  {abonarFichasVigentesMutation.isPending ? 'Procesando...' : 'Confirmar pago'}
                </button>
              </>
            )}
          </div>
        </ModalShell>
      )}

      <ConfirmDialog
        isOpen={Boolean(confirmDelete)}
        title="Eliminar cliente"
        message={`¿Estás seguro de eliminar a ${confirmDelete?.nombre} ${confirmDelete?.apellido}? Esta acción no se puede deshacer. Solo es posible si el cliente no tiene créditos registrados.`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        type="danger"
        loading={deleteMutation.isPending}
        onConfirm={handleEliminarCliente}
        onCancel={() => setConfirmDelete(null)}
      />

      {ticketPagoFichas && (
        <ModalShell
          open
          onClose={() => setTicketPagoFichas(null)}
          title="Pago registrado con éxito"
          subtitle={`${ticketPagoFichas.folio} · ${ticketPagoFichas.cantidad} ficha(s) · $${ticketPagoFichas.total.toLocaleString()}`}
          maxWidthClassName="max-w-sm"
          titleId="clientes-ticket-pago-modal-titulo"
          footer={
            <div className="flex flex-col gap-2 sm:flex-row">
              <button type="button" className="btn btn-primary w-full sm:flex-1" onClick={imprimirTicketPagoFichas}>
                Imprimir ticket
              </button>
              <button type="button" className="btn btn-light w-full sm:flex-1" onClick={() => setTicketPagoFichas(null)}>
                Cerrar
              </button>
            </div>
          }
        >
          <p className="text-sm text-textMuted">Puedes reimprimir el ticket más tarde desde el historial del crédito si lo necesitas.</p>
        </ModalShell>
      )}
    </div>
  );
};

export default Clientes;
