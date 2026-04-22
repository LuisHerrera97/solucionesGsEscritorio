import { Lock, User } from 'lucide-react';
import Spinner from '../../../../../infrastructure/ui/components/Spinner';

type LoginFormProps = {
  usuarioAcceso: string;
  contrasena: string;
  loading: boolean;
  onChangeUsuarioAcceso: (value: string) => void;
  onChangeContrasena: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export const LoginForm = ({
  usuarioAcceso,
  contrasena,
  loading,
  onChangeUsuarioAcceso,
  onChangeContrasena,
  onSubmit,
}: LoginFormProps) => {
  return (
    <form className="mt-8 space-y-4" onSubmit={onSubmit}>
      <div>
        <label className="block text-sm font-medium text-gray-700">Usuario</label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <User size={18} />
          </div>
          <input
            value={usuarioAcceso}
            onChange={(e) => onChangeUsuarioAcceso(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primaryBlue/20 focus:border-primaryBlue"
            placeholder="usuario"
            autoComplete="username"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Contraseña</label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Lock size={18} />
          </div>
          <input
            type="password"
            value={contrasena}
            onChange={(e) => onChangeContrasena(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primaryBlue/20 focus:border-primaryBlue"
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
        </div>
      </div>

      <button type="submit" disabled={loading} className="w-full btn btn-primary py-2.5 disabled:opacity-60 disabled:cursor-not-allowed">
        <span className="inline-flex items-center justify-center gap-2">
          {loading && <Spinner className="text-white" size={18} />}
          <span>{loading ? 'Entrando...' : 'Entrar'}</span>
        </span>
      </button>
    </form>
  );
};

