import { Trash2, UserPen } from 'lucide-react';
import type { ModuloDto } from '../../../../../../domain/seguridad/types';
import StatusPanel from '../../../../../../infrastructure/ui/components/StatusPanel';

type ModulosTableProps = {
  modulos: ModuloDto[];
  isLoading: boolean;
  isError: boolean;
  onEditar: (m: ModuloDto) => void;
  onEliminar: (m: ModuloDto) => void;
};

export const ModulosTable = ({ modulos, isLoading, isError, onEditar, onEliminar }: ModulosTableProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {isLoading && <StatusPanel variant="loading" title="Cargando módulos" message="Consultando el servidor..." className="m-4" />}
      {isError && <StatusPanel variant="error" title="No fue posible cargar módulos" message="Intenta nuevamente." className="m-4" />}
      {!isLoading && !isError && modulos.length === 0 && <StatusPanel variant="empty" title="Sin módulos" message="Crea un módulo para empezar." className="m-4" />}
      {!isLoading && !isError && modulos.length > 0 && (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/70 text-xs text-textMuted uppercase tracking-wide">
              <th className="py-3 px-4 text-left font-semibold">Nombre</th>
              <th className="py-3 px-4 text-left font-semibold">Clave</th>
              <th className="py-3 px-4 text-left font-semibold">Icono</th>
              <th className="py-3 px-4 text-center font-semibold">Orden</th>
              <th className="py-3 px-4 text-center font-semibold">Activo</th>
              <th className="py-3 px-4 text-right font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {modulos.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50/50">
                <td className="py-3 px-4 font-medium text-textDark">{m.nombre}</td>
                <td className="py-3 px-4 text-textMuted">{m.clave}</td>
                <td className="py-3 px-4 text-textMuted">{m.icono || '-'}</td>
                <td className="py-3 px-4 text-center">{m.orden}</td>
                <td className="py-3 px-4 text-center">
                  <span className={`badge ${m.activo ? 'badge-success' : 'badge-secondary'}`}>{m.activo ? 'Sí' : 'No'}</span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex justify-end gap-2">
                    <button type="button" className="btn btn-light flex items-center gap-2" onClick={() => onEditar(m)}>
                      <UserPen size={16} />
                      Editar
                    </button>
                    <button type="button" className="btn btn-danger flex items-center gap-2" onClick={() => onEliminar(m)}>
                      <Trash2 size={16} />
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

