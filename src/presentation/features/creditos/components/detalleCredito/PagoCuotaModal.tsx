import { ArrowRightLeft, Banknote, CreditCard, X } from 'lucide-react';
import type { MedioPago } from '../../../../../domain/creditos/types';
import { asNumber, numberInputDisplay, parseNumberInput, type NumberInputValue } from '../../../../../infrastructure/utils/numberInput';

type PagoCuotaModalProps = {
  open: boolean;
  numFicha: number;
  monto: NumberInputValue;
  medio: MedioPago;
  montoEfectivo: NumberInputValue;
  montoTransferencia: NumberInputValue;
  saving: boolean;
  onClose: () => void;
  onChangeMonto?: (value: NumberInputValue) => void;
  maxMonto?: number;
  onChangeMedio: (value: MedioPago) => void;
  onChangeMontoEfectivo: (value: NumberInputValue) => void;
  onChangeMontoTransferencia: (value: NumberInputValue) => void;
  onConfirm: () => void;
};

export const PagoCuotaModal = ({
  open,
  numFicha,
  monto,
  medio,
  montoEfectivo,
  montoTransferencia,
  saving,
  onClose,
  onChangeMonto,
  maxMonto,
  onChangeMedio,
  onChangeMontoEfectivo,
  onChangeMontoTransferencia,
  onConfirm,
}: PagoCuotaModalProps) => {
  if (!open) return null;

  const montoN = asNumber(monto);
  const efN = asNumber(montoEfectivo);
  const trN = asNumber(montoTransferencia);
  
  const isCajaValid = medio === 'Mixto' ? Math.abs(efN + trN - montoN) <= 0.01 : true;
  const isWithinLimit = maxMonto != null ? montoN <= maxMonto + 0.01 : true;
  const canConfirm = montoN > 0 && isCajaValid && isWithinLimit && !saving;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4 transition-all animate-in fade-in duration-300 overflow-y-auto">
      <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] w-full max-w-[400px] overflow-hidden border border-gray-100/50 animate-in zoom-in-95 slide-in-from-bottom-2 duration-500 my-auto">
        
        <div className="relative pt-8 px-8 pb-4">
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-all hover:rotate-90 active:scale-90"
          >
            <X size={18} />
          </button>
          
          <div className="flex flex-col items-center text-center">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">Registrar Pago / Abono</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Ficha #{numFicha}</h2>
          </div>
        </div>

        <div className="px-8 pb-8 space-y-5">
          {/* Monto Display/Input */}
          <div className={`p-5 rounded-2xl border flex flex-col items-center text-center transition-colors ${!isWithinLimit ? 'bg-rose-50 border-rose-200' : 'bg-blue-50/50 border-blue-100'}`}>
            <span className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${!isWithinLimit ? 'text-rose-500' : 'text-blue-400'}`}>
              {onChangeMonto ? 'Monto del Adelanto' : 'Monto de la Ficha'}
            </span>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-black font-mono ${!isWithinLimit ? 'text-rose-400' : 'text-blue-400'}`}>$</span>
              {onChangeMonto ? (
                <input
                  type="number"
                  className={`bg-transparent text-4xl font-black font-mono tracking-tighter w-full text-center outline-none border-b-2 transition-colors ${!isWithinLimit ? 'text-rose-700 border-rose-200 focus:border-rose-500' : 'text-blue-700 border-blue-200 focus:border-blue-500'}`}
                  value={numberInputDisplay(monto)}
                  onChange={(e) => onChangeMonto(parseNumberInput(e.target.value))}
                  onFocus={(e) => e.target.select()}
                />
              ) : (
                <span className="text-4xl font-black text-blue-700 font-mono tracking-tighter">
                  {montoN.toLocaleString()}
                </span>
              )}
            </div>
            {maxMonto != null && (
              <span className={`text-[9px] font-black uppercase mt-2 tracking-widest ${!isWithinLimit ? 'text-rose-500 animate-bounce' : 'text-blue-400/60'}`}>
                {!isWithinLimit ? `Excede el máximo: $${maxMonto.toLocaleString()}` : `Máximo permitido: $${maxMonto.toLocaleString()}`}
              </span>
            )}
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
                    className="w-full text-center font-black text-sm bg-white rounded-xl py-2.5 border border-blue-100 focus:border-blue-500 outline-none text-blue-900"
                    value={numberInputDisplay(montoEfectivo)}
                    onChange={(e) => onChangeMontoEfectivo(parseNumberInput(e.target.value))}
                    onFocus={(e) => e.target.select()}
                  />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[9px] font-black text-blue-600/50 uppercase text-center block tracking-widest">Transferencia</span>
                  <input
                    type="number"
                    className="w-full text-center font-black text-sm bg-white rounded-xl py-2.5 border border-blue-100 focus:border-blue-500 outline-none text-blue-900"
                    value={numberInputDisplay(montoTransferencia)}
                    onChange={(e) => onChangeMontoTransferencia(parseNumberInput(e.target.value))}
                    onFocus={(e) => e.target.select()}
                  />
                </div>
              </div>
              <div className={`mt-3 text-[10px] text-center font-black uppercase tracking-widest transition-colors ${Math.abs(efN + trN - montoN) <= 0.01 ? 'text-emerald-600' : 'text-rose-600 animate-pulse'}`}>
                {Math.abs(efN + trN - montoN) <= 0.01 
                  ? `Validado: $${(efN + trN).toLocaleString()}` 
                  : `Diferencia: $${(montoN - (efN + trN)).toLocaleString()}`}
              </div>
            </div>
          )}
        </div>

        <div className="bg-slate-50 p-8 pt-6">
          <button 
            type="button" 
            className="w-full py-4 rounded-2xl bg-blue-600 text-white text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/30 disabled:opacity-30 active:scale-[0.98] group relative overflow-hidden" 
            disabled={!canConfirm}
            onClick={onConfirm}
          >
            <span className="relative z-10">{saving ? 'Procesando...' : 'Confirmar Pago'}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </button>
          
          <button 
            type="button" 
            className="w-full py-1 mt-3 text-[10px] font-black text-slate-300 hover:text-slate-500 transition-colors uppercase tracking-[0.3em]" 
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
