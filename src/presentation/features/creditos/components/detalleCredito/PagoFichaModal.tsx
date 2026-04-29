import { ArrowRightLeft, Banknote, CreditCard, X } from 'lucide-react';
import type { MedioPago } from '../../../../../domain/creditos/types';
import { asNumber, numberInputDisplay, parseNumberInput, type NumberInputValue } from '../../../../../infrastructure/utils/numberInput';

type PagoFichaModalProps = {
  open: boolean;
  numFicha: number;
  pendiente: number;
  monto: NumberInputValue;
  mora: NumberInputValue;
  medio: MedioPago;
  montoEfectivo: NumberInputValue;
  montoTransferencia: NumberInputValue;
  saving: boolean;
  onClose: () => void;
  onChangeMonto: (value: NumberInputValue) => void;
  onChangeMora: (value: NumberInputValue) => void;
  onChangeMedio: (value: MedioPago) => void;
  onChangeMontoEfectivo: (value: NumberInputValue) => void;
  onChangeMontoTransferencia: (value: NumberInputValue) => void;
  onPay: () => void;
  onPenalize: () => void;
};

export const PagoFichaModal = ({
  open,
  numFicha,
  monto,
  mora,
  medio,
  montoEfectivo,
  montoTransferencia,
  saving,
  onClose,
  onChangeMora,
  onChangeMedio,
  onChangeMontoEfectivo,
  onChangeMontoTransferencia,
  onPay,
  onPenalize,
}: PagoFichaModalProps) => {
  if (!open) return null;

  const montoN = asNumber(monto);
  const moraN = asNumber(mora);
  const efN = asNumber(montoEfectivo);
  const trN = asNumber(montoTransferencia);
  const total = montoN + moraN;
  
  const isCajaValid = medio === 'Mixto' ? Math.abs(efN + trN - total) <= 0.01 : true;
  const canPay = (montoN > 0 || moraN > 0) && isCajaValid && !saving;
  const canPenalize = moraN > 0 && !saving;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all animate-in fade-in duration-300">
      <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] w-full max-w-[400px] overflow-hidden border border-gray-100/50 animate-in slide-in-from-bottom-8 duration-500">
        
        {/* Header */}
        <div className="relative pt-8 px-8 pb-4">
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-all hover:rotate-90 active:scale-90"
          >
            <X size={18} />
          </button>
          
          <div className="flex flex-col items-center text-center">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">Registro de Pago</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Ficha #{numFicha}</h2>
          </div>
        </div>

        <div className="px-8 pb-8 space-y-6">
          {/* Info de Abono (Solo Lectura) */}
          <div className="group relative">
            <div className="flex justify-between items-center mb-2 px-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Monto de la Cuota</span>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-50 text-[9px] font-black text-blue-600 uppercase border border-blue-100">
                <div className="w-1 h-1 rounded-full bg-blue-600 animate-pulse" />
                Fijo
              </span>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between group-hover:bg-slate-100/50 transition-colors">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900 font-mono tracking-tighter">${montoN.toLocaleString()}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">mxn</span>
              </div>
              <p className="text-[9px] text-slate-400 leading-tight text-right uppercase font-bold tracking-tighter">
                Pendiente<br/>Actual
              </p>
            </div>
          </div>

          {/* Penalización (Editable) */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">Mora / Penalización</label>
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors font-black text-lg">$</div>
              <input 
                type="number" 
                className="w-full bg-white border-2 border-slate-100 rounded-2xl py-5 pl-10 pr-6 text-xl font-black text-slate-900 focus:border-amber-400/50 focus:ring-[6px] focus:ring-amber-400/10 transition-all outline-none placeholder:text-slate-200" 
                min={0} 
                value={numberInputDisplay(mora)} 
                onChange={(e) => onChangeMora(parseNumberInput(e.target.value))} 
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Medio de Pago */}
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="h-px bg-slate-100 flex-1" />
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">Forma de pago</span>
              <div className="h-px bg-slate-100 flex-1" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {(['Efectivo', 'Transferencia', 'Mixto'] as MedioPago[]).map((m) => {
                const isActive = medio === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => onChangeMedio(m)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-300 ${
                      isActive 
                        ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-600/20 scale-105' 
                        : 'border-slate-50 bg-slate-50/50 text-slate-400 hover:border-slate-200 hover:bg-white active:scale-95'
                    }`}
                  >
                    {m === 'Efectivo' && <Banknote size={18} />}
                    {m === 'Transferencia' && <ArrowRightLeft size={18} />}
                    {m === 'Mixto' && <CreditCard size={18} />}
                    <span className="text-[9px] font-black uppercase mt-1.5 tracking-tighter">{m}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mixto Details */}
          {medio === 'Mixto' && (
            <div className="p-5 bg-blue-50/30 rounded-2xl border border-dashed border-blue-200 animate-in zoom-in-95 duration-300">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <span className="text-[9px] font-black text-blue-600/50 uppercase text-center block tracking-widest">Efectivo</span>
                  <input
                    type="number"
                    className="w-full text-center font-black text-sm bg-white rounded-xl py-2.5 border border-blue-100 focus:border-blue-500 outline-none text-blue-900 transition-all focus:shadow-sm"
                    value={numberInputDisplay(montoEfectivo)}
                    onChange={(e) => onChangeMontoEfectivo(parseNumberInput(e.target.value))}
                  />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[9px] font-black text-blue-600/50 uppercase text-center block tracking-widest">Transferencia</span>
                  <input
                    type="number"
                    className="w-full text-center font-black text-sm bg-white rounded-xl py-2.5 border border-blue-100 focus:border-blue-500 outline-none text-blue-900 transition-all focus:shadow-sm"
                    value={numberInputDisplay(montoTransferencia)}
                    onChange={(e) => onChangeMontoTransferencia(parseNumberInput(e.target.value))}
                  />
                </div>
              </div>
              <div className={`mt-3 text-[10px] text-center font-black uppercase tracking-widest transition-colors ${Math.abs(efN + trN - total) <= 0.01 ? 'text-emerald-600' : 'text-rose-600 animate-pulse'}`}>
                {Math.abs(efN + trN - total) <= 0.01 
                  ? `Total validado: $${(efN + trN).toLocaleString()}` 
                  : `Faltante: $${(total - (efN + trN)).toLocaleString()}`}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="bg-slate-50 p-8 pt-6 space-y-4">
          <div className="flex justify-between items-end pb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Total sugerido a cobrar</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-900 font-mono tracking-tighter">${total.toLocaleString()}</span>
              <span className="text-[10px] font-black text-slate-400 uppercase">mxn</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              type="button" 
              className="py-4 rounded-2xl bg-white border-2 border-slate-200 text-slate-600 text-[11px] font-black uppercase tracking-widest hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50 transition-all disabled:opacity-30 active:scale-[0.98] shadow-sm" 
              disabled={!canPenalize}
              onClick={onPenalize}
            >
              Penalizar
            </button>
            <button 
              type="button" 
              className="py-4 rounded-2xl bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/30 disabled:opacity-30 active:scale-[0.98] overflow-hidden group relative" 
              disabled={!canPay}
              onClick={onPay}
            >
              <span className="relative z-10">{saving ? 'Procesando...' : 'Pagar Ficha'}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </button>
          </div>
          
          <button 
            type="button" 
            className="w-full py-1 text-[10px] font-black text-slate-300 hover:text-slate-500 transition-colors uppercase tracking-[0.3em]" 
            onClick={onClose}
          >
            Cancelar operación
          </button>
        </div>
      </div>
    </div>
  );
};

