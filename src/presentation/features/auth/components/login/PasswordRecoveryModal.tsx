import { useState } from 'react';
import { toast } from 'react-toastify';

type PasswordRecoveryModalProps = {
  open: boolean;
  onClose: () => void;
};

export const PasswordRecoveryModal = ({ open, onClose }: PasswordRecoveryModalProps) => {
  const [usuarioAcceso, setUsuarioAcceso] = useState('');
  const [codigo, setCodigo] = useState('');
  const [nueva, setNueva] = useState('');

  if (!open) return null;

  const solicitar = async () => {
    toast.error('La recuperación de contraseña ha sido deshabilitada.');
  };

  const restablecer = async () => {
    toast.error('El restablecimiento de contraseña ha sido deshabilitado.');
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-semibold">Recuperar contraseña</h2>
            <p className="text-sm text-textMuted">Solicita un código y define una nueva contraseña.</p>
          </div>
          <button type="button" className="btn btn-light" onClick={onClose}>
            Cerrar
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="form-label">Usuario</label>
            <input className="form-input" value={usuarioAcceso} onChange={(e) => setUsuarioAcceso(e.target.value)} />
          </div>

          <button type="button" className="btn btn-light w-full" onClick={solicitar} disabled={!usuarioAcceso.trim()}>
            Solicitar código
          </button>


          <div>
            <label className="form-label">Código</label>
            <input className="form-input" value={codigo} onChange={(e) => setCodigo(e.target.value)} />
          </div>

          <div>
            <label className="form-label">Nueva contraseña</label>
            <input className="form-input" type="password" value={nueva} onChange={(e) => setNueva(e.target.value)} />
          </div>

          <button
            type="button"
            className="btn btn-primary w-full"
            onClick={restablecer}
            disabled={!usuarioAcceso.trim() || !codigo.trim() || !nueva.trim()}
          >
            Restablecer contraseña
          </button>
        </div>
      </div>
    </div>
  );
};

