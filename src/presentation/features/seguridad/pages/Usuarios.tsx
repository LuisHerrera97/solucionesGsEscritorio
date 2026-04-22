import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { ConfirmDialog } from '../../../../infrastructure/ui/components/ConfirmDialog';
import type { Guid, UsuarioDto } from '../../../../domain/seguridad/types';
import StatusPanel from '../../../../infrastructure/ui/components/StatusPanel';
import { getErrorMessage } from '../../../../infrastructure/utils/getErrorMessage';
import {
  useActualizarUsuarioMutation,
  useCrearUsuarioMutation,
  useEliminarUsuarioMutation,
  usePerfilesQuery,
  useUsuariosQuery,
} from '../hooks/seguridadHooks';
import { useZonasCobranzaQuery } from '../../general/hooks/generalHooks';
import { UsuarioModal } from '../components/usuarios/UsuarioModal';
import { UsuariosHeader } from '../components/usuarios/UsuariosHeader';
import { UsuariosTable } from '../components/usuarios/UsuariosTable';
import { ResetPasswordModal } from '../components/usuarios/ResetPasswordModal';

type UsuarioFormState = {
  id?: Guid;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  usuarioAcceso: string;
  contrasena: string;
  activo: boolean;
  idPerfil: Guid;
  idZonaCobranza?: Guid | '';
};

const Usuarios = () => {
  const [busqueda, setBusqueda] = useState('');
  const [modal, setModal] = useState<{ mode: 'create' | 'edit'; usuarioId?: Guid } | null>(null);
  const [resetPasswordUsuario, setResetPasswordUsuario] = useState<UsuarioDto | null>(null);
  const [form, setForm] = useState<UsuarioFormState | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<UsuarioDto | null>(null);

  const perfilesQuery = usePerfilesQuery();
  const usuariosQuery = useUsuariosQuery();
  const zonasQuery = useZonasCobranzaQuery();

  const perfiles = useMemo(() => perfilesQuery.data ?? [], [perfilesQuery.data]);
  const usuarios = useMemo(() => usuariosQuery.data ?? [], [usuariosQuery.data]);
  const zonas = useMemo(() => zonasQuery.data ?? [], [zonasQuery.data]);

  const usuariosFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return usuarios;
    return usuarios.filter((u) => {
      const full = `${u.nombre} ${u.apellidoPaterno} ${u.apellidoMaterno}`.toLowerCase();
      return (
        u.usuarioAcceso.toLowerCase().includes(q) ||
        u.nombre.toLowerCase().includes(q) ||
        u.apellidoPaterno.toLowerCase().includes(q) ||
        u.apellidoMaterno.toLowerCase().includes(q) ||
        full.includes(q) ||
        (u.nombrePerfil ?? '').toLowerCase().includes(q)
      );
    });
  }, [usuarios, busqueda]);

  const createMutation = useCrearUsuarioMutation();
  const updateMutation = useActualizarUsuarioMutation();
  const removeMutation = useEliminarUsuarioMutation();

  const abrirCrear = () => {
    const primerPerfil = perfiles[0]?.id ?? ('' as Guid);
    setForm({
      nombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      usuarioAcceso: '',
      contrasena: '',
      activo: true,
      idPerfil: primerPerfil,
      idZonaCobranza: '',
    });
    setModal({ mode: 'create' });
  };

  const abrirEditar = (u: UsuarioDto) => {
    setForm({
      id: u.id,
      nombre: u.nombre,
      apellidoPaterno: u.apellidoPaterno,
      apellidoMaterno: u.apellidoMaterno,
      usuarioAcceso: u.usuarioAcceso,
      contrasena: '',
      activo: u.activo,
      idPerfil: u.idPerfil,
      idZonaCobranza: u.idZonaCobranza ?? '',
    });
    setModal({ mode: 'edit', usuarioId: u.id });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    if (!form.nombre.trim() || !form.apellidoPaterno.trim() || !form.usuarioAcceso.trim() || !form.idPerfil) return;
    if (modal?.mode === 'create' && !form.contrasena.trim()) return;

    if (modal?.mode === 'create') {
      try {
        await createMutation.mutateAsync({
          id: '00000000-0000-0000-0000-000000000000',
          nombre: form.nombre.trim(),
          apellidoPaterno: form.apellidoPaterno.trim(),
          apellidoMaterno: form.apellidoMaterno.trim(),
          usuarioAcceso: form.usuarioAcceso.trim(),
          contrasena: form.contrasena.trim(),
          activo: form.activo,
          fechaCreacion: new Date().toISOString(),
          ultimoAcceso: null,
          idPerfil: form.idPerfil,
          nombrePerfil: '',
          idZonaCobranza: form.idZonaCobranza ? (form.idZonaCobranza as Guid) : null,
          nombreZonaCobranza: '',
        });
        toast.success('Usuario creado');
        setModal(null);
      } catch (err: unknown) {
        toast.error(getErrorMessage(err, 'No fue posible crear el usuario'));
      }
      return;
    }

    const usuarioActual = usuarios.find((u) => u.id === form.id);
    if (!usuarioActual || !form.id) return;
    try {
      await updateMutation.mutateAsync({
        id: form.id,
        payload: {
          ...usuarioActual,
          nombre: form.nombre.trim(),
          apellidoPaterno: form.apellidoPaterno.trim(),
          apellidoMaterno: form.apellidoMaterno.trim(),
          usuarioAcceso: form.usuarioAcceso.trim(),

          activo: form.activo,
          idPerfil: form.idPerfil,
          idZonaCobranza: form.idZonaCobranza ? (form.idZonaCobranza as Guid) : null,
        },
      });
      toast.success('Usuario actualizado');
      setModal(null);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'No fue posible actualizar el usuario'));
    }
  };

  const loading = perfilesQuery.isLoading || usuariosQuery.isLoading || zonasQuery.isLoading;

  return (
    <div className="space-y-6">
      <UsuariosHeader busqueda={busqueda} onChangeBusqueda={setBusqueda} onNuevo={abrirCrear} disableNuevo={perfiles.length === 0} />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading && <StatusPanel variant="loading" title="Cargando usuarios" message="Consultando el servidor..." className="m-4" />}
        {!loading && usuariosQuery.isError && <StatusPanel variant="error" title="No fue posible cargar usuarios" message="Intenta nuevamente." className="m-4" />}
        {!loading && !usuariosQuery.isError && usuariosFiltrados.length === 0 && (
          <StatusPanel variant="empty" title="Sin usuarios" message="Crea un usuario para empezar." className="m-4" />
        )}
        {!loading && !usuariosQuery.isError && usuariosFiltrados.length > 0 && (
          <UsuariosTable
            usuarios={usuariosFiltrados}
            eliminando={removeMutation.isPending}
            onEditar={abrirEditar}
            onResetPassword={(u) => setResetPasswordUsuario(u)}
            onEliminar={(u) => setConfirmDelete(u)}
          />
        )}
      </div>

      {modal && form && (
        <UsuarioModal
          mode={modal.mode}
          perfiles={perfiles}
          zonas={zonas}
          form={form}
          onChangeForm={(next) => setForm(next)}
          onClose={() => setModal(null)}
          onSubmit={submit}
          saving={createMutation.isPending || updateMutation.isPending}
        />
      )}

      <ResetPasswordModal
        open={Boolean(resetPasswordUsuario)}
        usuario={resetPasswordUsuario}
        onClose={() => setResetPasswordUsuario(null)}
        onSuccess={() => setResetPasswordUsuario(null)}
      />

      <ConfirmDialog
        isOpen={Boolean(confirmDelete)}
        title="Eliminar usuario"
        message={`¿Estás seguro de eliminar al usuario "${confirmDelete?.usuarioAcceso}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        type="danger"
        loading={removeMutation.isPending}
        onConfirm={async () => {
          if (!confirmDelete) return;
          try {
            await removeMutation.mutateAsync(confirmDelete.id);
            toast.success('Usuario eliminado');
            setConfirmDelete(null);
          } catch (err: unknown) {
            toast.error(getErrorMessage(err, 'No fue posible eliminar el usuario'));
          }
        }}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};

export default Usuarios;
