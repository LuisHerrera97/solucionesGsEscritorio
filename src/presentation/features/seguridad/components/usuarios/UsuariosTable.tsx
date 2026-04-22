import { Trash2, UserPen, Key } from 'lucide-react';
import type { UsuarioDto } from '../../../../../domain/seguridad/types';

type UsuariosTableProps = {
  usuarios: UsuarioDto[];
  onEditar: (u: UsuarioDto) => void;
  onEliminar: (u: UsuarioDto) => void;
  onResetPassword: (u: UsuarioDto) => void;
  eliminando: boolean;
};

export const UsuariosTable = ({ usuarios, onEditar, onEliminar, onResetPassword, eliminando }: UsuariosTableProps) => {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-100 bg-gray-50/70 text-xs text-textMuted uppercase tracking-wide">
          <th className="py-3 px-4 text-left font-semibold">Usuario</th>
          <th className="py-3 px-4 text-left font-semibold">Nombre</th>
          <th className="py-3 px-4 text-left font-semibold">Perfil</th>
          <th className="py-3 px-4 text-center font-semibold">Activo</th>
          <th className="py-3 px-4 text-right font-semibold">Acciones</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        {usuarios.map((u) => (
          <tr key={u.id} className="hover:bg-gray-50/50">
            <td className="py-3 px-4 font-medium text-textDark">{u.usuarioAcceso}</td>
            <td className="py-3 px-4">{`${u.nombre} ${u.apellidoPaterno} ${u.apellidoMaterno}`.trim()}</td>
            <td className="py-3 px-4 text-textMuted">{u.nombrePerfil}</td>
            <td className="py-3 px-4 text-center">
              <span className={`badge ${u.activo ? 'badge-success' : 'badge-secondary'}`}>{u.activo ? 'Sí' : 'No'}</span>
            </td>
            <td className="py-3 px-4">
              <div className="flex justify-end gap-2 text-xs">
                <button type="button" className="btn btn-light hover:text-blue-600 flex items-center gap-1.5 py-1.5" onClick={() => onResetPassword(u)}>
                  <Key size={14} />
                  Pswrd
                </button>
                <button type="button" className="btn btn-light hover:text-orange-600 flex items-center gap-1.5 py-1.5" onClick={() => onEditar(u)}>
                  <UserPen size={14} />
                  Editar
                </button>
                <button type="button" className="btn btn-light hover:text-red-600 flex items-center gap-1.5 py-1.5" disabled={eliminando} onClick={() => onEliminar(u)}>
                  <Trash2 size={14} />
                  Eliminar
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

