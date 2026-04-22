import { Trash2 } from 'lucide-react';
import type { ZonaCobranzaDto } from '../../../../../domain/general/types';

type ZonasCobranzaTableProps = {
  zonas: ZonaCobranzaDto[];
  isLoading: boolean;
  isError: boolean;
  onToggleActivo: (zona: ZonaCobranzaDto) => void;
  onUpdateOrden: (zona: ZonaCobranzaDto, orden: number) => void;
  onDelete: (zona: ZonaCobranzaDto) => void;
  isMutating: boolean;
  isDeleting: boolean;
};

export const ZonasCobranzaTable = ({
  zonas,
  isLoading,
  isError,
  onToggleActivo,
  onUpdateOrden,
  onDelete,
  isMutating,
  isDeleting,
}: ZonasCobranzaTableProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">Listado</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Zona</th>
              <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Orden</th>
              <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Activo</th>
              <th className="text-right py-3 px-6 text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={4} className="py-8 px-6 text-sm text-gray-500">
                  Cargando...
                </td>
              </tr>
            )}
            {isError && (
              <tr>
                <td colSpan={4} className="py-8 px-6 text-sm text-red-600">
                  No fue posible cargar las zonas
                </td>
              </tr>
            )}
            {!isLoading && !isError && zonas.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 px-6 text-sm text-gray-500">
                  Sin zonas registradas
                </td>
              </tr>
            )}
            {zonas.map((zona) => (
              <tr key={zona.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6">
                  <div className="text-sm font-medium text-gray-800">{zona.nombre}</div>
                  <div className="text-xs text-gray-500">{new Date(zona.fechaCreacion).toLocaleDateString()}</div>
                </td>
                <td className="py-4 px-6">
                  <input
                    type="number"
                    defaultValue={zona.orden}
                    className="w-24 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primaryBlue/20 focus:border-primaryBlue"
                    onBlur={(e) => onUpdateOrden(zona, Number(e.target.value))}
                  />
                </td>
                <td className="py-4 px-6">
                  <button
                    type="button"
                    onClick={() => onToggleActivo(zona)}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      zona.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}
                    disabled={isMutating}
                  >
                    {zona.activo ? 'Activo' : 'Inactivo'}
                  </button>
                </td>
                <td className="py-4 px-6 text-right">
                  <button
                    type="button"
                    onClick={() => onDelete(zona)}
                    className="inline-flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                    disabled={isDeleting}
                  >
                    <Trash2 size={16} />
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

