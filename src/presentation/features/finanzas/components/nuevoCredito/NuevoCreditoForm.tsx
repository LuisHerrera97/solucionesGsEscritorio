import { useEffect, useState } from 'react';
import { numberInputDisplay, parseNumberInput, type NumberInputValue } from '../../../../../infrastructure/utils/numberInput';
import { ClienteSelectBusqueda } from './ClienteSelectBusqueda';

/** Evita 9.99999999991 en el input y en porcentaje mostrado. */
const formatTasaPctInput = (ratio: number) => {
  const pct = ratio * 100;
  if (!Number.isFinite(pct)) return '';
  return String(Number(pct.toFixed(4)));
};

type NuevoCreditoFormProps = {
  formId: string;
  selectedClienteId: string;
  monto: NumberInputValue;
  plazo: NumberInputValue;
  tipo: 'diario' | 'semanal' | 'mensual';
  permitirDomingo: boolean;
  aplicarFeriados: boolean;
  onChangeClienteId: (value: string) => void;
  onClienteEtiqueta?: (etiqueta: string) => void;
  onChangeMonto: (value: NumberInputValue) => void;
  onChangePlazo: (value: NumberInputValue) => void;
  onChangeTipo: (value: 'diario' | 'semanal' | 'mensual') => void;
  onChangePermitirDomingo: (value: boolean) => void;
  onChangeAplicarFeriados: (value: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  /** null = usar tasa por defecto del sistema para el tipo actual */
  tasaManual: number | null;
  tasaDefault: number;
  observacion: string;
  onChangeTasaManual: (value: number | null) => void;
  onChangeObservacion: (value: string) => void;
};

export const NuevoCreditoForm = ({
  formId,
  selectedClienteId,
  monto,
  plazo,
  tipo,
  permitirDomingo,
  aplicarFeriados,
  onChangeClienteId,
  onClienteEtiqueta,
  onChangeMonto,
  onChangePlazo,
  onChangeTipo,
  onChangePermitirDomingo,
  onChangeAplicarFeriados,
  onSubmit,
  submitting,
  tasaManual,
  tasaDefault,
  observacion,
  onChangeTasaManual,
  onChangeObservacion,
}: NuevoCreditoFormProps) => {
  const [tasaPctStr, setTasaPctStr] = useState(() => formatTasaPctInput(tasaManual ?? tasaDefault));

  useEffect(() => {
    setTasaPctStr(formatTasaPctInput(tasaManual ?? tasaDefault));
  }, [tasaDefault, tipo]);

  return (
    <form id={formId} onSubmit={onSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
      <ClienteSelectBusqueda
        value={selectedClienteId}
        onChange={onChangeClienteId}
        onClienteEtiqueta={onClienteEtiqueta}
        disabled={submitting}
        hint="Se muestran hasta 30 coincidencias. Refina la búsqueda si no ves al cliente."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="form-label">Monto solicitado</label>
          <input type="number" className="form-input" min={0} value={numberInputDisplay(monto)} onChange={(e) => onChangeMonto(parseNumberInput(e.target.value))} required />
        </div>
        <div>
          <label className="form-label">Plazo</label>
          <input type="number" className="form-input" min={1} value={numberInputDisplay(plazo)} onChange={(e) => onChangePlazo(parseNumberInput(e.target.value))} required />
          <p className="text-xs text-textMuted mt-1">
            {tipo === 'diario' ? 'Número de días hábiles' : (tipo === 'semanal' ? 'Número de semanas' : 'Número de meses')}
          </p>
        </div>
        <div>
          <label className="form-label">Tipo</label>
          <select className="form-select" value={tipo} onChange={(e) => onChangeTipo(e.target.value as 'diario' | 'semanal' | 'mensual')}>
            <option value="diario">Diario</option>
            <option value="semanal">Semanal</option>
            <option value="mensual">Mensual</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="form-label">Tasa de interés (%)</label>
          <input
            type="number"
            step="0.01"
            className="form-input"
            value={tasaPctStr}
            onChange={(e) => {
              const v = e.target.value;
              setTasaPctStr(v);
              if (v === '' || v === '-' || v === '.' || v === '-.') {
                onChangeTasaManual(null);
                return;
              }
              const n = Number(v);
              if (!Number.isFinite(n)) return;
              onChangeTasaManual(n / 100);
            }}
            onBlur={() => {
              const trimmed = tasaPctStr.trim();
              if (trimmed === '') {
                onChangeTasaManual(null);
                setTasaPctStr(formatTasaPctInput(tasaDefault));
                return;
              }
              const n = Number(trimmed);
              if (!Number.isFinite(n)) {
                onChangeTasaManual(null);
                setTasaPctStr(formatTasaPctInput(tasaDefault));
                return;
              }
              const ratio = n / 100;
              onChangeTasaManual(ratio);
              setTasaPctStr(formatTasaPctInput(ratio));
            }}
          />
          <p className="text-xs text-textMuted mt-1">Puedes modificar la tasa para este crédito específico.</p>
        </div>
        <div>
          <label className="form-label">Observación</label>
          <textarea className="form-input" rows={2} value={observacion} onChange={(e) => onChangeObservacion(e.target.value)} placeholder="Ej. Cliente preferente, reestructura, etc." />
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-2">
        <label className="flex items-center gap-2 text-sm text-textDark">
          <input type="checkbox" checked={permitirDomingo} onChange={(e) => onChangePermitirDomingo(e.target.checked)} />
          Permitir pagos en domingo
        </label>
        <label className="flex items-center gap-2 text-sm text-textDark">
          <input type="checkbox" checked={aplicarFeriados} onChange={(e) => onChangeAplicarFeriados(e.target.checked)} />
          Aplicar feriados (si cae en feriado, recorre al siguiente día)
        </label>
      </div>
    </form>
  );
};
