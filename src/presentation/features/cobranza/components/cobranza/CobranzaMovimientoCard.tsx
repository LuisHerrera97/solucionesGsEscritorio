import { ChevronDown, ChevronRight } from 'lucide-react';
import type { CobranzaOperacionCardVm } from '../../../../../domain/cobranza/cobranza/types';
import { formatCalendarDateFromApi } from '../../../../../shared/date/calendarDate';

type CobranzaMovimientoCardProps = {
  item: CobranzaOperacionCardVm;
  expanded?: boolean;
  onToggleExpanded?: () => void;
  onReimprimir?: () => void;
  onDesaplicar?: () => void;
};

const puedeReversarTipo = (tipo?: string) => tipo === 'Ficha' || tipo === 'Penalización';

export const CobranzaMovimientoCard = ({ item, expanded, onToggleExpanded, onReimprimir, onDesaplicar }: CobranzaMovimientoCardProps) => {
  const fechaMovimiento = formatCalendarDateFromApi(item.fechaPago, { day: '2-digit', month: '2-digit', year: 'numeric' });
  const puedeDesaplicar = !item.revertido && !item.reversaDeId && puedeReversarTipo(item.tipo);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
      <div className="flex w-full min-w-0 flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <button type="button" className="btn btn-light px-2 py-1 text-[10px]" onClick={onToggleExpanded}>
              {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
            <p className="text-sm font-semibold text-textDark">{item.clienteNombre || 'Cliente desconocido'}</p>
          </div>
          <p className="text-xs text-textMuted">Crédito {item.creditoFolio || item.creditoId || '-'}</p>
          <p className="mt-1 text-xs text-textMuted">
            {item.detalles.length} movimiento(s)
            {item.detalles.length > 0 ? ` · Ficha(s): ${item.detalles.map((d) => `#${d.numFicha}`).join(', ')}` : ''}
          </p>
        </div>

        <div className="flex min-w-[180px] flex-row justify-between gap-4 text-sm md:flex-col md:justify-center">
          <div>
            <p className="text-xs text-textMuted">Fecha</p>
            <p className="font-medium text-textDark">{fechaMovimiento}</p>
          </div>
          <div>
            <p className="text-xs text-textMuted">Hora</p>
            <p className="font-medium text-textDark">{item.horaPago}</p>
          </div>
        </div>

        <div className="min-w-[160px] space-y-1 text-right">
          <p className="text-xs text-textMuted">
            Pago total: <span className="font-bold text-gray-900">${(item.totalCobrado ?? 0).toLocaleString()}</span>
          </p>
          {(onReimprimir || onDesaplicar) && (
            <div className="mt-2 flex justify-end gap-2">
              {onReimprimir && (
                <button type="button" className="btn btn-light px-2 py-1 text-[10px]" onClick={onReimprimir}>
                  Reimprimir
                </button>
              )}
              {onDesaplicar && puedeDesaplicar && (
                <button type="button" className="btn btn-light px-2 py-1 text-[10px]" onClick={onDesaplicar}>
                  Desaplicar
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {expanded && item.detalles.length > 0 && (
        <div className="w-full min-w-0 rounded-lg border border-gray-200 bg-white p-3">
          <p className="mb-2 text-xs font-semibold uppercase text-textMuted">Detalle de operación</p>
          <div className="space-y-2">
            {item.detalles.map((d) => (
              <div key={d.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-gray-50 px-2 py-1 text-xs">
                <span className="font-semibold text-textDark">Ficha #{d.numFicha}</span>
                <span className="text-textMuted">
                  {formatCalendarDateFromApi(d.fechaPago, { day: '2-digit', month: '2-digit', year: 'numeric' })} {d.horaPago}
                </span>
                <span className="font-bold text-textDark">Pago total: ${d.totalCobrado.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
