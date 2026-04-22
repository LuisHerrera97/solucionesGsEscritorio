import type { MovimientoCobranzaDto } from '../../../../../domain/cobranza/cobranza/types';
import { formatCalendarDateFromApi } from '../../../../../shared/date/calendarDate';

export const CobranzaMovimientoCard = ({ item }: { item: MovimientoCobranzaDto }) => {
  const fechaMovimiento = formatCalendarDateFromApi(item.fechaPago, { day: '2-digit', month: '2-digit', year: 'numeric' });
  const fechaLimite = item.fechaLimite
    ? formatCalendarDateFromApi(item.fechaLimite, { day: '2-digit', month: '2-digit', year: 'numeric' })
    : '-';

  return (
    <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex-1">
        <p className="text-sm font-semibold text-textDark">{item.clienteNombre || 'Cliente desconocido'}</p>
        <p className="text-xs text-textMuted">
          {item.clienteNegocio ? `${item.clienteNegocio} • ${item.creditoFolio || item.creditoId}` : item.creditoFolio || item.creditoId}
        </p>
        <p className="text-xs text-textMuted mt-1">Ficha #{item.numFicha} · Fecha límite: {fechaLimite}</p>
      </div>

      <div className="flex flex-row md:flex-col gap-4 text-sm min-w-[180px] justify-between md:justify-center">
        <div>
          <p className="text-xs text-textMuted">Fecha</p>
          <p className="font-medium text-textDark">{fechaMovimiento}</p>
        </div>
        <div>
          <p className="text-xs text-textMuted">Hora</p>
          <p className="font-medium text-textDark">{item.horaPago}</p>
        </div>
      </div>

      <div className="text-right space-y-1 min-w-[160px]">
        <p className="text-xs text-textMuted">
          Abono: <span className="font-semibold text-textDark">${(item.abono ?? 0).toLocaleString()}</span>
        </p>
        <p className="text-xs text-textMuted">
          Penalización: <span className="font-semibold text-textDark">${(item.mora ?? 0).toLocaleString()}</span>
        </p>
        <p className="text-xs text-textMuted">
          Pago total: <span className="font-bold text-gray-900">${(item.totalCobrado ?? 0).toLocaleString()}</span>
        </p>
      </div>
    </div>
  );
};
