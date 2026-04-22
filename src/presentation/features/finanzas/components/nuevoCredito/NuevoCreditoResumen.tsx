import { DollarSign } from 'lucide-react';
import { asNumber, type NumberInputValue } from '../../../../../infrastructure/utils/numberInput';

type NuevoCreditoResumenProps = {
  tipo: 'diario' | 'semanal' | 'mensual';
  monto: NumberInputValue;
  tasa: number;
  interesTotal: number;
  total: number;
  cuota: number;
};

export const NuevoCreditoResumen = ({ tipo, monto, tasa, interesTotal, total, cuota }: NuevoCreditoResumenProps) => {
  const montoN = asNumber(monto);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primaryBlueLight flex items-center justify-center text-primaryBlue">
          <DollarSign size={22} />
        </div>
        <div>
          <p className="text-sm font-medium text-textMuted">Resumen del crédito</p>
          <p className="text-lg font-semibold text-textDark">
            {tipo === 'diario' ? 'Crédito diario' : (tipo === 'semanal' ? 'Crédito semanal' : 'Crédito mensual')}
          </p>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-textMuted">Monto</span>
          <span className="font-semibold text-textDark">${montoN.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-textMuted">Interés ({(tasa * 100).toFixed(2)}%)</span>
          <span className="font-semibold text-textDark">${interesTotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between border-t border-gray-100 pt-2">
          <span className="text-textMuted">Total a pagar</span>
          <span className="font-bold text-textDark">${total.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-textMuted">
            {tipo === 'diario' ? 'Pago diario' : (tipo === 'semanal' ? 'Pago semanal' : 'Pago mensual')}
          </span>
          <span className="font-bold text-primaryBlue">${cuota.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

