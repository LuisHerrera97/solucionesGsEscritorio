import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { ConfirmDialog } from '../../../../infrastructure/ui/components/ConfirmDialog';
import type { BotonDto, ModuloDto, PaginaDto } from '../../../../domain/seguridad/types';
import { getErrorMessage } from '../../../../infrastructure/utils/getErrorMessage';
import {
  useActualizarBotonMutation,
  useActualizarModuloMutation,
  useActualizarPaginaMutation,
  useBotonesQuery,
  useCrearBotonMutation,
  useCrearModuloMutation,
  useCrearPaginaMutation,
  useEliminarBotonMutation,
  useEliminarModuloMutation,
  useEliminarPaginaMutation,
  useModulosQuery,
  usePaginasQuery,
} from '../hooks/seguridadHooks';
import { ElementosSistemaHeader } from '../components/elementosSistema/ElementosSistemaHeader';
import { ElementosSistemaModal } from '../components/elementosSistema/ElementosSistemaModal';
import { ElementosSistemaTabs } from '../components/elementosSistema/ElementosSistemaTabs';
import { BotonForm } from '../components/elementosSistema/forms/BotonForm';
import { ModuloForm } from '../components/elementosSistema/forms/ModuloForm';
import { PaginaForm } from '../components/elementosSistema/forms/PaginaForm';
import { BotonesTable } from '../components/elementosSistema/tables/BotonesTable';
import { ModulosTable } from '../components/elementosSistema/tables/ModulosTable';
import { PaginasTable } from '../components/elementosSistema/tables/PaginasTable';

type Tab = 'modulos' | 'paginas' | 'botones';

const ElementosSistema = () => {
  const [tab, setTab] = useState<Tab>('modulos');

  const modulosQuery = useModulosQuery();
  const paginasQuery = usePaginasQuery();
  const botonesQuery = useBotonesQuery();

  const modulos = useMemo(() => modulosQuery.data ?? [], [modulosQuery.data]);
  const paginas = useMemo(() => paginasQuery.data ?? [], [paginasQuery.data]);
  const botones = useMemo(() => botonesQuery.data ?? [], [botonesQuery.data]);

  const [modal, setModal] = useState<
    | { tipo: 'modulo'; mode: 'create' | 'edit'; item?: ModuloDto }
    | { tipo: 'pagina'; mode: 'create' | 'edit'; item?: PaginaDto }
    | { tipo: 'boton'; mode: 'create' | 'edit'; item?: BotonDto }
    | null
  >(null);

  const createModuloMutation = useCrearModuloMutation();
  const updateModuloMutation = useActualizarModuloMutation();
  const removeModuloMutation = useEliminarModuloMutation();
  const createPaginaMutation = useCrearPaginaMutation();
  const updatePaginaMutation = useActualizarPaginaMutation();
  const removePaginaMutation = useEliminarPaginaMutation();
  const createBotonMutation = useCrearBotonMutation();
  const updateBotonMutation = useActualizarBotonMutation();
  const removeBotonMutation = useEliminarBotonMutation();

  const abrirNuevo = () => {
    if (tab === 'modulos') setModal({ tipo: 'modulo', mode: 'create' });
    if (tab === 'paginas') setModal({ tipo: 'pagina', mode: 'create' });
    if (tab === 'botones') setModal({ tipo: 'boton', mode: 'create' });
  };

  const titulo = useMemo(() => {
    if (tab === 'modulos') return 'Módulos';
    if (tab === 'paginas') return 'Páginas';
    return 'Botones';
  }, [tab]);

  const ordenadoModulos = useMemo(() => modulos.slice().sort((a, b) => a.orden - b.orden), [modulos]);
  const ordenadoPaginas = useMemo(() => paginas.slice().sort((a, b) => a.orden - b.orden), [paginas]);
  const ordenadoBotones = useMemo(() => botones.slice().sort((a, b) => a.orden - b.orden), [botones]);

  const [confirmDelete, setConfirmDelete] = useState<{
    tipo: 'modulo' | 'pagina' | 'boton';
    id: string;
    nombre: string;
  } | null>(null);

  const busy =
    modulosQuery.isLoading ||
    paginasQuery.isLoading ||
    botonesQuery.isLoading ||
    createModuloMutation.isPending ||
    updateModuloMutation.isPending ||
    removeModuloMutation.isPending ||
    createPaginaMutation.isPending ||
    updatePaginaMutation.isPending ||
    removePaginaMutation.isPending ||
    createBotonMutation.isPending ||
    updateBotonMutation.isPending ||
    removeBotonMutation.isPending;

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;

    try {
      if (confirmDelete.tipo === 'modulo') {
        await removeModuloMutation.mutateAsync(confirmDelete.id);
        toast.success('Módulo eliminado');
      } else if (confirmDelete.tipo === 'pagina') {
        await removePaginaMutation.mutateAsync(confirmDelete.id);
        toast.success('Página eliminada');
      } else if (confirmDelete.tipo === 'boton') {
        await removeBotonMutation.mutateAsync(confirmDelete.id);
        toast.success('Botón eliminado');
      }
      setConfirmDelete(null);
    } catch (err: unknown) {
      const msgMap = {
        modulo: 'No fue posible eliminar el módulo',
        pagina: 'No fue posible eliminar la página',
        boton: 'No fue posible eliminar el botón',
      };
      toast.error(getErrorMessage(err, msgMap[confirmDelete.tipo]));
    }
  };

  return (
    <div className="space-y-6">
      <ElementosSistemaHeader onNuevo={abrirNuevo} disabled={busy} />
      <ElementosSistemaTabs tab={tab} onChange={setTab} />

      {tab === 'modulos' && (
        <ModulosTable
          modulos={ordenadoModulos}
          isLoading={modulosQuery.isLoading}
          isError={modulosQuery.isError}
          onEditar={(m) => setModal({ tipo: 'modulo', mode: 'edit', item: m })}
          onEliminar={(m) => setConfirmDelete({ tipo: 'modulo', id: m.id, nombre: m.nombre })}
        />
      )}

      {tab === 'paginas' && (
        <PaginasTable
          paginas={ordenadoPaginas}
          isLoading={paginasQuery.isLoading}
          isError={paginasQuery.isError}
          onEditar={(p) => setModal({ tipo: 'pagina', mode: 'edit', item: p })}
          onEliminar={(p) => setConfirmDelete({ tipo: 'pagina', id: p.id, nombre: p.nombre })}
        />
      )}

      {tab === 'botones' && (
        <BotonesTable
          botones={ordenadoBotones}
          isLoading={botonesQuery.isLoading}
          isError={botonesQuery.isError}
          onEditar={(b) => setModal({ tipo: 'boton', mode: 'edit', item: b })}
          onEliminar={(b) => setConfirmDelete({ tipo: 'boton', id: b.id, nombre: b.nombre })}
        />
      )}

      <ElementosSistemaModal
        open={Boolean(modal)}
        title={`${modal?.mode === 'create' ? 'Nuevo' : 'Editar'} ${modal?.tipo === 'modulo' ? 'módulo' : modal?.tipo === 'pagina' ? 'página' : 'botón'}`}
        subtitle={titulo}
        onClose={() => setModal(null)}
      >
        {modal?.tipo === 'modulo' && (
          <ModuloForm
            initial={modal.item}
            onCancel={() => setModal(null)}
            onSubmit={async (payload) => {
              try {
                if (modal.mode === 'create') {
                  await createModuloMutation.mutateAsync(payload);
                  toast.success('Módulo creado');
                } else {
                  await updateModuloMutation.mutateAsync({ id: payload.id, payload });
                  toast.success('Módulo actualizado');
                }
                setModal(null);
              } catch (err: unknown) {
                toast.error(getErrorMessage(err, modal.mode === 'create' ? 'No fue posible crear el módulo' : 'No fue posible actualizar el módulo'));
              }
            }}
          />
        )}
        {modal?.tipo === 'pagina' && (
          <PaginaForm
            modulos={ordenadoModulos}
            initial={modal.item}
            onCancel={() => setModal(null)}
            onSubmit={async (payload) => {
              try {
                if (modal.mode === 'create') {
                  await createPaginaMutation.mutateAsync(payload);
                  toast.success('Página creada');
                } else {
                  await updatePaginaMutation.mutateAsync({ id: payload.id, payload });
                  toast.success('Página actualizada');
                }
                setModal(null);
              } catch (err: unknown) {
                toast.error(getErrorMessage(err, modal.mode === 'create' ? 'No fue posible crear la página' : 'No fue posible actualizar la página'));
              }
            }}
          />
        )}
        {modal?.tipo === 'boton' && (
          <BotonForm
            paginas={ordenadoPaginas}
            initial={modal.item}
            onCancel={() => setModal(null)}
            onSubmit={async (payload) => {
              try {
                if (modal.mode === 'create') {
                  await createBotonMutation.mutateAsync(payload);
                  toast.success('Botón creado');
                } else {
                  await updateBotonMutation.mutateAsync({ id: payload.id, payload });
                  toast.success('Botón actualizado');
                }
                setModal(null);
              } catch (err: unknown) {
                toast.error(getErrorMessage(err, modal.mode === 'create' ? 'No fue posible crear el botón' : 'No fue posible actualizar el botón'));
              }
            }}
          />
        )}
      </ElementosSistemaModal>

      <ConfirmDialog
        isOpen={Boolean(confirmDelete)}
        title={`Eliminar ${confirmDelete?.tipo === 'modulo' ? 'módulo' : confirmDelete?.tipo === 'pagina' ? 'página' : 'botón'}`}
        message={`¿Estás seguro de eliminar "${confirmDelete?.nombre}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        type="danger"
        loading={busy}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};

export default ElementosSistema;
