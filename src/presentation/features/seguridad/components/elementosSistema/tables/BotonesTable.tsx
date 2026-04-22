import { Trash2, UserPen } from 'lucide-react';
import type { BotonDto } from '../../../../../../domain/seguridad/types';
import StatusPanel from '../../../../../../infrastructure/ui/components/StatusPanel';

type BotonesTableProps = {
  botones: BotonDto[];
  isLoading: boolean;
  isError: boolean;
  onEditar: (b: BotonDto) => void;
  onEliminar: (b: BotonDto) => void;
};

export const BotonesTable = ({ botones, isLoading, isError, onEditar, onEliminar }: BotonesTableProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {isLoading && <StatusPanel variant="loading" title="Cargando botones" message="Consultando el servidor..." className="m-4" />}
      {isError && <StatusPanel variant="error" title="No fue posible cargar botones" message="Intenta nuevamente." className="m-4" />}
      {!isLoading && !isError && botones.length === 0 && <StatusPanel variant="empty" title="Sin botones" message="Crea un botón para empezar." className="m-4" />}
      {!isLoading && !isError && botones.length > 0 && (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/70 text-xs text-textMuted uppercase tracking-wide">
              <th className="py-3 px-4 text-left font-semibold">Nombre</th>
              <th className="py-3 px-4 text-left font-semibold">Clave</th>
              <th className="py-3 px-4 text-left font-semibold">Página</th>
              <th className="py-3 px-4 text-center font-semibold">Orden</th>
              <th className="py-3 px-4 text-center font-semibold">Activo</th>
              <th className="py-3 px-4 text-right font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {botones.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50/50">
                <td className="py-3 px-4 font-medium text-textDark">{b.nombre}</td>
                <td className="py-3 px-4 text-textMuted">{b.clave}</td>
                <td className="py-3 px-4 text-textMuted">{b.nombrePagina}</td>
                <td className="py-3 px-4 text-center">{b.orden}</td>
                <td className="py-3 px-4 text-center">
                  <span className={`badge ${b.activo ? 'badge-success' : 'badge-secondary'}`}>{b.activo ? 'Sí' : 'No'}</span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex justify-end gap-2">
                    <button type="button" className="btn btn-light flex items-center gap-2" onClick={() => onEditar(b)}>
                      <UserPen size={16} />
                      Editar
                    </button>
                    <button type="button" className="btn btn-danger flex items-center gap-2" onClick={() => onEliminar(b)}>
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

