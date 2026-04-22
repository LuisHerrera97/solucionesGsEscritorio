import { ChevronDown, ChevronUp } from 'lucide-react';
import type { CorteCajaDto } from '../../../../../domain/finanzas/cortes/types';
import { formatCalendarDateFromApi } from '../../../../../shared/date/calendarDate';

type CortesTableProps = {
  cortes: CorteCajaDto[];
  expandido: string | null;
  onToggleExpand: (id: string) => void;
};

export const CortesTable = ({ cortes, expandido, onToggleExpand }: CortesTableProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/80 text-left text-xs text-textMuted uppercase tracking-wide">
            <th className="py-3 px-4 font-semibold">Fecha</th>
            <th className="py-3 px-4 font-semibold">Hora</th>
            <th className="py-3 px-4 font-semibold text-right">Total teórico</th>
            <th className="py-3 px-4 font-semibold text-right">Total real</th>
            <th className="py-3 px-4 font-semibold text-right">Diferencia</th>
            <th className="py-3 px-4 w-10"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {cortes.flatMap((corte) => {
            const fechaFmt = formatCalendarDateFromApi(corte.fecha, { day: '2-digit', month: 'short', year: 'numeric' });
            const isOpen = expandido === corte.id;
            return [
              <tr key={corte.id} className="hover:bg-gray-50/50">
                <td className="py-3 px-4 font-medium text-textDark">{fechaFmt}</td>
                <td className="py-3 px-4 text-textMuted">{corte.hora}</td>
                <td className="py-3 px-4 text-right font-medium">${corte.totalTeorico.toLocaleString()}</td>
                <td className="py-3 px-4 text-right font-medium">${corte.totalReal.toLocaleString()}</td>
                <td className={`py-3 px-4 text-right font-medium ${corte.diferencia >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {corte.diferencia >= 0 ? '+' : ''}
                  {corte.diferencia.toLocaleString()}
                </td>
                <td className="py-3 px-4">
                  {(corte.movimientos?.length ?? 0) > 0 && (
                    <button
                      type="button"
                      className="p-1 rounded hover:bg-gray-200 text-textMuted"
                      onClick={() => onToggleExpand(isOpen ? '' : corte.id)}
                      aria-label={isOpen ? 'Cerrar' : 'Ver movimientos'}
                    >
                      {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  )}
                </td>
              </tr>,
              ...(isOpen && (corte.movimientos?.length ?? 0) > 0
                ? [
                    <tr key={`${corte.id}-detalle`}>
                      <td colSpan={6} className="bg-gray-50/50 p-4">
                        <p className="text-xs font-semibold text-textMuted uppercase mb-2">Movimientos del corte</p>
                        <ul className="space-y-1 text-sm">
                          {corte.movimientos.map((mov, idx) => (
                            <li key={mov.id ?? `${corte.id}-mov-${idx}`} className="flex justify-between py-1 border-b border-gray-100 last:border-0">
                              <span className="text-textMuted">
                                {mov.hora} · {mov.concepto ?? mov.tipo}
                              </span>
                              <span className="font-medium">${mov.total.toLocaleString()}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>,
                  ]
                : []),
            ];
          })}
        </tbody>
      </table>
    </div>
  );
};

