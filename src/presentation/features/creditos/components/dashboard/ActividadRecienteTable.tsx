import type { MovimientoCajaDto } from '../../../../../domain/creditos/caja/types';

type ActividadRecienteTableProps = {
  movimientos: MovimientoCajaDto[];
  isLoading: boolean;
  isError: boolean;
};

export const ActividadRecienteTable = ({ movimientos, isLoading, isError }: ActividadRecienteTableProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Actividad Reciente</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 text-gray-500 text-sm">
              <th className="pb-3 font-medium">Hora</th>
              <th className="pb-3 font-medium">Concepto</th>
              <th className="pb-3 font-medium">Monto</th>
              <th className="pb-3 font-medium">Tipo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-400">
                  Cargando movimientos...
                </td>
              </tr>
            )}
            {isError && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-red-600">
                  No fue posible cargar movimientos
                </td>
              </tr>
            )}
            {!isLoading &&
              !isError &&
              movimientos.slice(-10).reverse().map((mov, idx) => (
                <tr key={mov.id ?? `mov-${mov.fecha}-${mov.hora}-${idx}`} className="group hover:bg-gray-50 transition-colors">
                  <td className="py-3 text-sm text-gray-600">{mov.hora}</td>
                  <td className="py-3 text-sm font-medium text-gray-900">{mov.concepto}</td>
                  <td className="py-3 text-sm font-bold text-gray-900">${mov.total.toLocaleString()}</td>
                  <td className="py-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        mov.tipo === 'Ficha' ? 'bg-green-100 text-green-700' : mov.tipo === 'Gasto' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {mov.tipo}
                    </span>
                  </td>
                </tr>
              ))}
            {!isLoading && !isError && movimientos.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-400">
                  No hay movimientos en el rango de fechas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

