import type { Guid } from '../../../../../domain/seguridad/types';
import { asNumber, numberInputDisplay, parseNumberInput, type NumberInputValue } from '../../../../../infrastructure/utils/numberInput';

type PerfilFormState = {
  id?: Guid;
  nombre: string;
  clave: string;
  orden: NumberInputValue;
  activo: boolean;
};

type PerfilModalProps = {
  mode: 'create' | 'edit';
  form: PerfilFormState;
  onChangeForm: (next: PerfilFormState) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  saving: boolean;
};

export const PerfilModal = ({ mode, form, onChangeForm, onClose, onSubmit, saving }: PerfilModalProps) => {
  const disabled =
    saving || !form.nombre.trim() || !form.clave.trim() || form.orden === '' || Number.isNaN(asNumber(form.orden)) || asNumber(form.orden) <= 0;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-lg font-semibold mb-1">{mode === 'create' ? 'Nuevo perfil' : 'Editar perfil'}</h2>
        <p className="text-sm text-textMuted mb-4">Define el perfil que usarán los usuarios.</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="form-label">Nombre</label>
              <input className="form-input" value={form.nombre} onChange={(e) => onChangeForm({ ...form, nombre: e.target.value })} />
            </div>
            <div>
              <label className="form-label">Clave</label>
              <input className="form-input" value={form.clave} onChange={(e) => onChangeForm({ ...form, clave: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="form-label">Orden</label>
              <input
                type="number"
                min={1}
                className="form-input"
                value={numberInputDisplay(form.orden)}
                onChange={(e) => onChangeForm({ ...form, orden: parseNumberInput(e.target.value) })}
              />
            </div>
            <div className="flex items-center gap-2 pt-7">
              <input type="checkbox" checked={form.activo} onChange={(e) => onChangeForm({ ...form, activo: e.target.checked })} />
              <span className="text-sm text-textDark">Activo</span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" className="btn btn-light" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={disabled}>
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

