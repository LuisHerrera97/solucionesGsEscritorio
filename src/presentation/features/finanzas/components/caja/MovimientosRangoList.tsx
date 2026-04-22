import { CreditCard } from 'lucide-react';
import type { MovimientoCajaDto } from '../../../../../domain/finanzas/caja/types';
import { formatCalendarDateFromApi } from '../../../../../shared/date/calendarDate';
import Spinner from '../../../../../infrastructure/ui/components/Spinner';

type MovimientosRangoListProps = {
  isLoading: boolean;
  movimientos: MovimientoCajaDto[];
};

export const MovimientosRangoList = ({ isLoading, movimientos }: MovimientosRangoListProps) => {
  const statusLabel = (status?: string | null) => {
    if (status === 'LIQUIDADO') return { text: 'Liquidado', cls: 'bg-blue-100 text-blue-700' };
    if (status === 'EN_CORTE') return { text: 'En corte', cls: 'bg-emerald-100 text-emerald-700' };
    if (status === 'PENDIENTE') return { text: 'Pendiente', cls: 'bg-amber-100 text-amber-700' };
    if (status === 'COBRADO') return { text: 'Cobrado', cls: 'bg-green-100 text-green-700' };
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96 overflow-y-auto">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Movimientos del rango</h3>
      <div className="space-y-4">
        {isLoading && (
          <div className="text-center text-gray-400 py-12">
            <div className="inline-flex items-center gap-2">
              <Spinner className="text-primaryBlue" />
              <span>Cargando...</span>
            </div>
          </div>
        )}
        {!isLoading &&
          movimientos
            .slice()
            .reverse()
            .map((mov, idx) => {
              const fecha = mov.fecha ? formatCalendarDateFromApi(mov.fecha, { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';
              const estatus = statusLabel(mov.estatusFichaFinanzas);
              return (
                <div
                  key={mov.id ?? `caja-${mov.fecha}-${mov.hora}-${idx}`}
                  className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${mov.total < 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                      <CreditCard size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{mov.concepto || mov.tipo}</p>
                      <p className="text-xs text-gray-500">
                        {fecha} {mov.hora} • {mov.tipo} • {mov.medio}
                      </p>
                      {estatus && (
                        <span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${estatus.cls}`}>
                          {estatus.text}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`font-semibold ${mov.total < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {mov.total < 0 ? '-' : '+'}${Math.abs(mov.total).toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
        {!isLoading && movimientos.length === 0 && <div className="text-center text-gray-400 py-12">No hay movimientos en el rango de fechas</div>}
      </div>
    </div>
  );
};
