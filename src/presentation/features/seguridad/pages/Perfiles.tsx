import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { ConfirmDialog } from '../../../../infrastructure/ui/components/ConfirmDialog';
import type { Guid, PerfilDto } from '../../../../domain/seguridad/types';
import StatusPanel from '../../../../infrastructure/ui/components/StatusPanel';
import { getErrorMessage } from '../../../../infrastructure/utils/getErrorMessage';
import { asNumber, type NumberInputValue } from '../../../../infrastructure/utils/numberInput';
import {
  useActualizarPerfilMutation,
  useCrearPerfilMutation,
  useEliminarPerfilMutation,
  usePerfilesQuery,
} from '../hooks/seguridadHooks';
import { PerfilModal } from '../components/perfiles/PerfilModal';
import { PerfilesHeader } from '../components/perfiles/PerfilesHeader';
import { PerfilesTable } from '../components/perfiles/PerfilesTable';

type PerfilFormState = {
  id?: Guid;
  nombre: string;
  clave: string;
  orden: NumberInputValue;
  activo: boolean;
};

const Perfiles = () => {
  const [busqueda, setBusqueda] = useState('');
  const [modal, setModal] = useState<{ mode: 'create' | 'edit'; id?: Guid } | null>(null);
  const [form, setForm] = useState<PerfilFormState | null>(null);

  const [confirmDelete, setConfirmDelete] = useState<PerfilDto | null>(null);

  const perfilesQuery = usePerfilesQuery();

  const perfiles = useMemo(() => perfilesQuery.data ?? [], [perfilesQuery.data]);
  const perfilesFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return perfiles.slice().sort((a, b) => a.orden - b.orden);
    return perfiles
      .filter((p) => p.nombre.toLowerCase().includes(q) || p.clave.toLowerCase().includes(q))
      .sort((a, b) => a.orden - b.orden);
  }, [perfiles, busqueda]);

  const createMutation = useCrearPerfilMutation();
  const updateMutation = useActualizarPerfilMutation();
  const removeMutation = useEliminarPerfilMutation();

  const abrirCrear = () => {
    setForm({ nombre: '', clave: '', orden: perfiles.length + 1, activo: true });
    setModal({ mode: 'create' });
  };

  const abrirEditar = (p: PerfilDto) => {
    setForm({ id: p.id, nombre: p.nombre, clave: p.clave, orden: p.orden, activo: p.activo });
    setModal({ mode: 'edit', id: p.id });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modal || !form) return;
    if (!form.nombre.trim() || !form.clave.trim() || form.orden === '' || asNumber(form.orden) <= 0) return;

    if (modal.mode === 'create') {
      try {
        await createMutation.mutateAsync({
          id: '00000000-0000-0000-0000-000000000000',
          nombre: form.nombre.trim(),
          clave: form.clave.trim(),
          orden: asNumber(form.orden),
          activo: form.activo,
          fechaCreacion: new Date().toISOString(),
        });
        toast.success('Perfil creado');
        setModal(null);
      } catch (err: unknown) {
        toast.error(getErrorMessage(err, 'No fue posible crear el perfil'));
      }
      return;
    }

    const perfilActual = perfiles.find((p) => p.id === form.id);
    if (!perfilActual || !form.id) return;
    try {
      await updateMutation.mutateAsync({
        id: form.id,
        payload: { ...perfilActual, nombre: form.nombre.trim(), clave: form.clave.trim(), orden: asNumber(form.orden), activo: form.activo },
      });
      toast.success('Perfil actualizado');
      setModal(null);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'No fue posible actualizar el perfil'));
    }
  };

  return (
    <div className="space-y-6">
      <PerfilesHeader busqueda={busqueda} onChangeBusqueda={setBusqueda} onNuevo={abrirCrear} />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {perfilesQuery.isLoading && <StatusPanel variant="loading" title="Cargando perfiles" message="Consultando el servidor..." className="m-4" />}
        {perfilesQuery.isError && <StatusPanel variant="error" title="No fue posible cargar perfiles" message="Intenta nuevamente." className="m-4" />}
        {!perfilesQuery.isLoading && !perfilesQuery.isError && perfilesFiltrados.length === 0 && (
          <StatusPanel variant="empty" title="Sin perfiles" message="Crea un perfil para empezar." className="m-4" />
        )}
        {!perfilesQuery.isLoading && !perfilesQuery.isError && perfilesFiltrados.length > 0 && (
          <PerfilesTable
            perfiles={perfilesFiltrados}
            eliminando={removeMutation.isPending}
            onEditar={abrirEditar}
            onEliminar={(p) => setConfirmDelete(p)}
          />
        )}
      </div>

      {modal && form && (
        <PerfilModal
          mode={modal.mode}
          form={form}
          onChangeForm={(next) => setForm(next)}
          onClose={() => setModal(null)}
          onSubmit={submit}
          saving={createMutation.isPending || updateMutation.isPending}
        />
      )}

      <ConfirmDialog
        isOpen={Boolean(confirmDelete)}
        title="Eliminar perfil"
        message={`¿Estás seguro de eliminar el perfil "${confirmDelete?.nombre}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        type="danger"
        loading={removeMutation.isPending}
        onConfirm={async () => {
          if (!confirmDelete) return;
          try {
            await removeMutation.mutateAsync(confirmDelete.id);
            toast.success('Perfil eliminado');
            setConfirmDelete(null);
          } catch (err: unknown) {
            toast.error(getErrorMessage(err, 'No fue posible eliminar el perfil'));
          }
        }}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};

export default Perfiles;
