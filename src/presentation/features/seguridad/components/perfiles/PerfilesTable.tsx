import { Trash2, UserPen } from 'lucide-react';
import type { PerfilDto } from '../../../../../domain/seguridad/types';

type PerfilesTableProps = {
  perfiles: PerfilDto[];
  onEditar: (p: PerfilDto) => void;
  onEliminar: (p: PerfilDto) => void;
  eliminando: boolean;
};

export const PerfilesTable = ({ perfiles, onEditar, onEliminar, eliminando }: PerfilesTableProps) => {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-100 bg-gray-50/70 text-xs text-textMuted uppercase tracking-wide">
          <th className="py-3 px-4 text-left font-semibold">Nombre</th>
          <th className="py-3 px-4 text-left font-semibold">Clave</th>
          <th className="py-3 px-4 text-center font-semibold">Orden</th>
          <th className="py-3 px-4 text-center font-semibold">Activo</th>
          <th className="py-3 px-4 text-right font-semibold">Acciones</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        {perfiles.map((p) => (
          <tr key={p.id} className="hover:bg-gray-50/50">
            <td className="py-3 px-4 font-medium text-textDark">{p.nombre}</td>
            <td className="py-3 px-4 text-textMuted">{p.clave}</td>
            <td className="py-3 px-4 text-center">{p.orden}</td>
            <td className="py-3 px-4 text-center">
              <span className={`badge ${p.activo ? 'badge-success' : 'badge-secondary'}`}>{p.activo ? 'Sí' : 'No'}</span>
            </td>
            <td className="py-3 px-4">
              <div className="flex justify-end gap-2">
                <button type="button" className="btn btn-light flex items-center gap-2" onClick={() => onEditar(p)}>
                  <UserPen size={16} />
                  Editar
                </button>
                <button type="button" className="btn btn-danger flex items-center gap-2" disabled={eliminando} onClick={() => onEliminar(p)}>
                  <Trash2 size={16} />
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

