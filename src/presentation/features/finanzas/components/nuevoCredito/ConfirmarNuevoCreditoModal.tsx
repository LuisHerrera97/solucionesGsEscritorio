import type { NumberInputValue } from '../../../../../infrastructure/utils/numberInput';
import { asNumber } from '../../../../../infrastructure/utils/numberInput';
import { NuevoCreditoResumen } from './NuevoCreditoResumen';

type TipoCredito = 'diario' | 'semanal' | 'mensual';

type ConfirmarNuevoCreditoModalProps = {
  open: boolean;
  /** Texto del selector de cliente (nombre, negocio, etc.) */
  clienteNombre: string;
  tipo: TipoCredito;
  monto: NumberInputValue;
  plazo: NumberInputValue;
  tasa: number;
  interesTotal: number;
  total: number;
  cuota: number;
  saving: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const tipoEtiqueta = (tipo: TipoCredito) =>
  tipo === 'diario' ? 'Crédito diario' : tipo === 'semanal' ? 'Crédito semanal' : 'Crédito mensual';

const plazoEtiqueta = (tipo: TipoCredito, plazo: NumberInputValue) => {
  const n = asNumber(plazo);
  const unidad = tipo === 'diario' ? 'días hábiles' : tipo === 'semanal' ? 'semanas' : 'meses';
  return `${n.toLocaleString()} ${unidad}`;
};

export const ConfirmarNuevoCreditoModal = ({
  open,
  clienteNombre,
  tipo,
  monto,
  plazo,
  tasa,
  interesTotal,
  total,
  cuota,
  saving,
  onClose,
  onConfirm,
}: ConfirmarNuevoCreditoModalProps) => {
  if (!open) return null;
  const montoN = asNumber(monto);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="confirmar-credito-titulo">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-5 border-b border-gray-100">
          <h2 id="confirmar-credito-titulo" className="text-lg font-semibold text-textDark">
            Detalles del crédito
          </h2>
          <p className="text-sm text-textMuted">Revisa la información antes de crear el crédito.</p>
          <dl className="grid grid-cols-1 gap-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-textMuted shrink-0">Cliente</dt>
              <dd className="font-semibold text-textDark text-right break-words max-w-[min(100%,18rem)]">
                {clienteNombre.trim() || '—'}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-textMuted shrink-0">Tipo</dt>
              <dd className="font-semibold text-textDark text-right">{tipoEtiqueta(tipo)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-textMuted shrink-0">Monto</dt>
              <dd className="font-semibold text-textDark text-right">${montoN.toLocaleString()}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-textMuted shrink-0">Plazo</dt>
              <dd className="font-semibold text-textDark text-right">{plazoEtiqueta(tipo, plazo)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-textMuted shrink-0">Interés</dt>
              <dd className="font-semibold text-textDark text-right">{(tasa * 100).toFixed(2)}%</dd>
            </div>
          </dl>
        </div>
        <div className="p-6 pt-0">
          <NuevoCreditoResumen tipo={tipo} monto={monto} tasa={tasa} interesTotal={interesTotal} total={total} cuota={cuota} />
        </div>
        <div className="flex justify-end gap-3 p-6 pt-0">
          <button type="button" className="btn btn-light" onClick={onClose} disabled={saving}>
            Cancelar
          </button>
          <button type="button" className="btn btn-primary" onClick={onConfirm} disabled={saving}>
            {saving ? 'Creando...' : 'Confirmar y crear'}
          </button>
        </div>
      </div>
    </div>
  );
};
