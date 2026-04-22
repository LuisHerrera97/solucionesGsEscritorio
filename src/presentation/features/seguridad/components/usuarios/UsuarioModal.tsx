import type { Guid, PerfilDto } from '../../../../../domain/seguridad/types';
import type { ZonaCobranzaDto } from '../../../../../domain/general/types';

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

type UsuarioModalProps = {
  mode: 'create' | 'edit';
  perfiles: PerfilDto[];
  zonas: ZonaCobranzaDto[];
  form: UsuarioFormState;
  onChangeForm: (next: UsuarioFormState) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  saving: boolean;
};

export const UsuarioModal = ({ mode, perfiles, zonas, form, onChangeForm, onClose, onSubmit, saving }: UsuarioModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-lg font-semibold mb-1">{mode === 'create' ? 'Nuevo usuario' : 'Editar usuario'}</h2>
        <p className="text-sm text-textMuted mb-4">Completa los datos del usuario.</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="form-label">Nombre</label>
              <input className="form-input" value={form.nombre} onChange={(e) => onChangeForm({ ...form, nombre: e.target.value })} />
            </div>
            <div>
              <label className="form-label">Usuario</label>
              <input className="form-input" value={form.usuarioAcceso} onChange={(e) => onChangeForm({ ...form, usuarioAcceso: e.target.value })} />
            </div>
            <div>
              <label className="form-label">Apellido paterno</label>
              <input className="form-input" value={form.apellidoPaterno} onChange={(e) => onChangeForm({ ...form, apellidoPaterno: e.target.value })} />
            </div>
            <div>
              <label className="form-label">Apellido materno</label>
              <input className="form-input" value={form.apellidoMaterno} onChange={(e) => onChangeForm({ ...form, apellidoMaterno: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="form-label">Perfil</label>
              <select className="form-input" value={form.idPerfil} onChange={(e) => onChangeForm({ ...form, idPerfil: e.target.value as Guid })}>
                {perfiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </select>
            </div>
            {mode === 'create' && (
              <div>
                <label className="form-label">Contraseña</label>
                <input className="form-input" type="password" value={form.contrasena} onChange={(e) => onChangeForm({ ...form, contrasena: e.target.value })} />
              </div>
            )}
          </div>

          <div>
            <label className="form-label">Zona de cobranza (opcional)</label>
            <select
              className="form-input"
              value={form.idZonaCobranza ?? ''}
              onChange={(e) => onChangeForm({ ...form, idZonaCobranza: e.target.value as Guid | '' })}
            >
              <option value="">Sin zona</option>
              {zonas.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-textDark">
              <input type="checkbox" checked={form.activo} onChange={(e) => onChangeForm({ ...form, activo: e.target.checked })} />
              Activo
            </label>
            <div className="flex gap-2">
              <button type="button" className="btn btn-light" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                Guardar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
