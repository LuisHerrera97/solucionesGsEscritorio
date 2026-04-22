import { useState } from 'react';
import { Key, X, Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import { getErrorMessage } from '../../../../../infrastructure/utils/getErrorMessage';
import { UsuarioService } from '../../../../../infrastructure/servicios/api/seguridad/UsuarioService';
import type { UsuarioDto } from '../../../../../domain/seguridad/types';

type ResetPasswordModalProps = {
  open: boolean;
  onClose: () => void;
  usuario: UsuarioDto | null;
  onSuccess: () => void;
};

export const ResetPasswordModal = ({ open, onClose, usuario, onSuccess }: ResetPasswordModalProps) => {
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!open || !usuario) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nuevaContrasena) {
      toast.error('La nueva contraseña es requerida');
      return;
    }

    if (nuevaContrasena !== confirmarContrasena) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      await UsuarioService.resetPasswordAdmin(usuario.id, { nuevaContrasena });
      toast.success('Contraseña restablecida correctamente');
      setNuevaContrasena('');
      setConfirmarContrasena('');
      onSuccess();
      onClose();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'No fue posible restablecer la contraseña'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Key size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Restablecer Contraseña</h2>
              <p className="text-xs text-gray-500">Para: {usuario.nombre} ({usuario.usuarioAcceso})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Nueva Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={nuevaContrasena}
                onChange={(e) => setNuevaContrasena(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm pr-10"
                placeholder="********"
                autoFocus
                disabled={loading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Confirmar Contraseña
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmarContrasena}
              onChange={(e) => setConfirmarContrasena(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
              placeholder="********"
              disabled={loading}
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-md shadow-blue-200 flex items-center justify-center gap-2 transition-all active:scale-95"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Guardando...
                </>
              ) : (
                'Restablecer'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
