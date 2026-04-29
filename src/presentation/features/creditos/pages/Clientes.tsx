import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { ConfirmDialog } from '../../../../infrastructure/ui/components/ConfirmDialog';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { Cliente } from '../../../../domain/creditos/types';
import { useDebouncedValue } from '../../../../infrastructure/hooks/useDebouncedValue';
import StatusPanel from '../../../../infrastructure/ui/components/StatusPanel';
import { getErrorMessage } from '../../../../infrastructure/utils/getErrorMessage';
import { useAuth } from '../../auth/context/useAuth';
import { useZonasCobranzaQuery } from '../../general/hooks/generalHooks';
import {
  useActualizarClienteMutation,
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

const PAGE_SIZE = 12;
const BUSCAR_DEBOUNCE_MS = 300;

const PERM_CLIENTE_TODAS_ZONAS = 'CLIENTE_TODAS_ZONAS';

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

  const clientesQuery = useClientesQuery({ page, pageSize: PAGE_SIZE, buscar: buscarApi, zonaId: zonaIdParam });
  const createMutation = useCrearClienteMutation();
  const updateMutation = useActualizarClienteMutation();
  const deleteMutation = useEliminarClienteMutation();
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

  const guardandoCliente = createMutation.isPending || updateMutation.isPending;

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">
                  {clienteSeleccionado.nombre} {clienteSeleccionado.apellido}
                </h2>
                <p className="text-sm text-textMuted">
                  {clienteSeleccionado.negocio} · {clienteSeleccionado.zona}
                </p>
              </div>
              <button type="button" className="btn btn-light" onClick={() => setClienteSeleccionado(null)}>
                Cerrar
              </button>
            </div>

            {creditosClienteQuery.isLoading && <StatusPanel variant="loading" title="Cargando créditos" message="Consultando el servidor..." />}
            {creditosClienteQuery.isError && <StatusPanel variant="error" title="No fue posible cargar créditos" message="Intenta nuevamente." />}
            {!creditosClienteQuery.isLoading && !creditosClienteQuery.isError && (
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 font-semibold text-textDark">Vigentes</h3>
                  {(creditosClienteQuery.data?.vigentes ?? []).length === 0 ? (
                    <p className="text-sm text-textMuted">Sin créditos vigentes.</p>
                  ) : (
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {creditosClienteQuery.data?.vigentes.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-left transition-colors hover:border-gray-200 hover:bg-gray-100"
                          onClick={() => {
                            setClienteSeleccionado(null);
                            navigate(`/creditos/${c.id}`);
                          }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="font-semibold text-textDark">{c.folio}</div>
                            <span className="badge badge-warning">{c.estatus}</span>
                          </div>
                          <div className="mt-2 text-sm text-textMuted">
                            Total: ${c.total.toLocaleString()} · Pagado: ${c.pagado.toLocaleString()}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="mb-2 font-semibold text-textDark">Liquidados</h3>
                  {(creditosClienteQuery.data?.liquidados ?? []).length === 0 ? (
                    <p className="text-sm text-textMuted">Sin créditos liquidados.</p>
                  ) : (
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {creditosClienteQuery.data?.liquidados.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-left transition-colors hover:border-gray-200 hover:bg-gray-100"
                          onClick={() => {
                            setClienteSeleccionado(null);
                            navigate(`/creditos/${c.id}`);
                          }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="font-semibold text-textDark">{c.folio}</div>
                            <span className="badge badge-success">{c.estatus}</span>
                          </div>
                          <div className="mt-2 text-sm text-textMuted">
                            Total: ${c.total.toLocaleString()} · Pagado: ${c.pagado.toLocaleString()}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
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
    </div>
  );
};

export default Clientes;
