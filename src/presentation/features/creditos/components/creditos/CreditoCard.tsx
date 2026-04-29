import { FileText } from 'lucide-react';
import type { CreditoApi } from '../../../../../application/creditos/creditosAppService';

type CreditoCardProps = {
  credito: CreditoApi;
  onVerDetalles: () => void;
  onPagarFichas?: () => void;
};

export const CreditoCard = ({ credito, onVerDetalles, onPagarFichas }: CreditoCardProps) => {
  const progreso = (credito.pagado / credito.total) * 100;

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="p-2.5 sm:p-3 bg-blue-50 text-blue-600 rounded-full shrink-0">
          <FileText size={22} className="sm:w-6 sm:h-6 w-[22px] h-[22px]" />
        </div>
        <div className="min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
            {credito.clienteNombre} {credito.clienteApellido}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 truncate">
            Folio: {credito.folio} · {credito.tipo.toUpperCase()}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 sm:gap-4 sm:flex-nowrap">
        <div className="text-left sm:text-right space-y-0.5 order-2 sm:order-1">
          <p className="text-xl sm:text-2xl font-bold text-gray-900">${credito.total.toLocaleString()}</p>
          <p className="text-xs sm:text-sm text-gray-500">Saldo: ${(credito.total - credito.pagado).toLocaleString()}</p>
        </div>

        <div className="flex-1 min-w-[100px] sm:w-32 order-3 sm:order-2">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progreso</span>
            <span>{Math.round(progreso)}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-primaryBlue rounded-full" style={{ width: `${progreso}%` }} />
          </div>
        </div>

        <div className="flex flex-col gap-2 shrink-0 order-1 sm:order-3 w-full sm:w-auto">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium text-center w-fit ${
              credito.estatus === 'Activo'
                ? 'bg-green-100 text-green-700'
                : credito.estatus === 'Liquidado'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-orange-100 text-orange-700'
            }`}
          >
            {credito.estatus}
          </span>
          <button type="button" className="text-sm text-primaryBlue hover:underline py-1 text-left sm:text-center whitespace-nowrap min-w-0 w-fit" onClick={onVerDetalles}>
            Ver detalles
          </button>
          {onPagarFichas && credito.estatus === 'Activo' && (
            <button type="button" className="text-sm text-primaryBlue hover:underline py-1 text-left sm:text-center whitespace-nowrap min-w-0 w-fit" onClick={onPagarFichas}>
              Pagar fichas
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
