import type { PendienteCobroDto } from '../../../../../domain/cobranza/pendientes/types';
import { formatCalendarDateFromApi } from '../../../../../shared/date/calendarDate';

const money = (n: number) => n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });

export const PendienteCard = ({
  item,
  onIrAlCredito,
}: {
  item: PendienteCobroDto;
  onIrAlCredito: (item: PendienteCobroDto) => void;
}) => {
  const fecha = formatCalendarDateFromApi(item.fechaLimite, { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex-1">
        <p className="text-sm font-semibold text-textDark">{item.clienteNombre}</p>
        <p className="text-xs text-textMuted">
          {item.clienteNegocio} • {item.creditoFolio || item.creditoId}
        </p>
        <p className="text-xs text-textMuted mt-1">
          Ficha #{item.numFicha} · Fecha límite: {fecha}
        </p>
        <span
          className={`inline-flex mt-2 px-2 py-1 rounded-full text-xs font-medium ${
            item.estado === 'Vencida' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
          }`}
        >
          {item.estado}
        </span>
      </div>

      <div className="text-right space-y-1 min-w-[170px]">
        <p className="text-xs text-textMuted">
          Total ficha: <span className="font-semibold text-textDark">${money(item.totalFicha)}</span>
        </p>
        <p className="text-xs text-textMuted">
          Abonado: <span className="font-semibold text-textDark">${money(item.abonoAcumulado)}</span>
        </p>
        <p className="text-xs text-textMuted">
          Pendiente: <span className="font-bold text-gray-900">${money(item.pendiente)}</span>
        </p>
        <button type="button" className="btn btn-primary text-xs px-3 py-2 mt-2 w-full md:w-auto" onClick={() => onIrAlCredito(item)}>
          Ir al crédito
        </button>
      </div>
    </div>
  );
};
