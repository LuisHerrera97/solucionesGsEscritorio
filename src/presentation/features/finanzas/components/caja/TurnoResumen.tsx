import { numberInputDisplay, parseNumberInput, type NumberInputValue } from '../../../../../infrastructure/utils/numberInput';

type TurnoResumenProps = {
  totalCaja: number;
  totalReal: NumberInputValue;
  onChangeTotalReal: (value: NumberInputValue) => void;
  onCerrarTurno?: () => void;
  cerrando: boolean;
  diaTurnoLabel?: string;
};

export const TurnoResumen = ({
  totalCaja,
  totalReal,
  onChangeTotalReal,
  onCerrarTurno,
  cerrando,
  diaTurnoLabel,
}: TurnoResumenProps) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-1">Resumen de turno</h3>
      {diaTurnoLabel ? <p className="text-xs text-gray-500 mb-3">Movimientos del día {diaTurnoLabel} (fecha inicial del filtro)</p> : null}
      <div className="text-4xl font-bold text-primaryBlue mb-2">${totalCaja.toLocaleString()}</div>
      <p className="text-sm text-gray-500">Saldo actual en caja</p>

      <div className="mt-8 pt-6 border-t border-gray-100">
        <label className="block text-sm font-medium text-gray-700 mb-2">Realizar Corte</label>
        <div className="flex gap-4">
          <input
            type="number"
            placeholder="Total Real en Caja"
            className="flex-1 p-2 border rounded-lg"
            value={numberInputDisplay(totalReal)}
            onChange={(e) => onChangeTotalReal(parseNumberInput(e.target.value))}
          />
          {onCerrarTurno && (
            <button
              onClick={onCerrarTurno}
              disabled={cerrando || totalCaja <= 0}
              className="bg-primaryBlue hover:bg-primaryBlueDark text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              Corte de caja
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
