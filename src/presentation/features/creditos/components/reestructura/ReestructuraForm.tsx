import { asNumber, numberInputDisplay, parseNumberInput, type NumberInputValue } from '../../../../../infrastructure/utils/numberInput';
import { useAuth } from '../../../auth/context/useAuth';

type ReestructuraFormProps = {
  saldoPendiente: number;
  montoExtra: NumberInputValue;
  plazo: NumberInputValue;
  plazoFallback: number;
  onChangeMontoExtra: (value: NumberInputValue) => void;
  onChangePlazo: (value: NumberInputValue) => void;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
};

export const ReestructuraForm = ({
  saldoPendiente,
  montoExtra,
  plazo,
  plazoFallback,
  onChangeMontoExtra,
  onChangePlazo,
  onCancel,
  onSubmit,
  submitting,
}: ReestructuraFormProps) => {
  const { canBoton } = useAuth();
  const canReestructurar = canBoton('CREDITO_REESTRUCTURAR');
  const montoExtraSafe = Math.max(0, asNumber(montoExtra));
  const plazoInput = plazo === '' ? '' : plazo || plazoFallback;
  const nuevoMonto = saldoPendiente + montoExtraSafe;

  return (
    <form onSubmit={onSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="form-label">Monto extra a agregar al crédito ($)</label>
            <input type="number" className="form-input" min={0} value={numberInputDisplay(montoExtra)} onChange={(e) => onChangeMontoExtra(parseNumberInput(e.target.value))} />
            <p className="text-xs text-textMuted mt-1">Opcional. Suma este monto al saldo pendiente para el nuevo crédito.</p>
          </div>
          <div>
            <label className="form-label">Nuevo plazo (número de fichas)</label>
            <input type="number" className="form-input" min={1} value={numberInputDisplay(plazoInput)} onChange={(e) => onChangePlazo(parseNumberInput(e.target.value))} required />
          </div>
        </div>
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-textDark">Resumen de la reestructura</h2>
          <p className="text-sm text-textMuted">Saldo pendiente (abonos ya aplicados): ${saldoPendiente.toLocaleString()}</p>
          <p className="text-sm text-textMuted">Monto extra: ${montoExtraSafe.toLocaleString()}</p>
          <p className="text-sm font-semibold text-textDark">
            Monto del nuevo crédito: <span className="text-lg">${nuevoMonto.toLocaleString()}</span>
          </p>
          <p className="text-xs text-textMuted">
            Al confirmar, este crédito quedará como &quot;Reestructurado&quot; y se creará un nuevo crédito con el monto y plazo indicados (incl. interés).
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button type="button" className="btn btn-light" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={!canReestructurar || submitting}>
          {submitting ? 'Procesando...' : 'Confirmar reestructura'}
        </button>
      </div>
    </form>
  );
};
