import { X } from 'lucide-react';
import { asNumber, numberInputDisplay, parseNumberInput, type NumberInputValue } from '../../../../../infrastructure/utils/numberInput';

type PenalizacionModalProps = {
  open: boolean;
  numFicha: number;
  mora: NumberInputValue;
  saving: boolean;
  onClose: () => void;
  onChangeMora: (value: NumberInputValue) => void;
  onConfirm: () => void;
};

export const PenalizacionModal = ({
  open,
  numFicha,
  mora,
  saving,
  onClose,
  onChangeMora,
  onConfirm,
}: PenalizacionModalProps) => {
  if (!open) return null;

  const montoN = asNumber(mora);
  const canConfirm = montoN > 0 && !saving;

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
            <span className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mb-1">Registrar Penalización</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Ficha #{numFicha}</h2>
          </div>
        </div>

        <div className="px-8 pb-8 space-y-6">
          {/* Monto Input (Editable) */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">Monto de Penalización</label>
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors font-black text-xl">$</div>
              <input 
                type="number" 
                className="w-full bg-white border-2 border-slate-100 rounded-2xl py-5 pl-10 pr-6 text-xl font-black text-slate-900 focus:border-amber-400/50 focus:ring-[6px] focus:ring-amber-400/10 transition-all outline-none placeholder:text-slate-200" 
                min={0} 
                value={numberInputDisplay(mora)} 
                onChange={(e) => onChangeMora(parseNumberInput(e.target.value))} 
                onFocus={(e) => e.target.select()}
                placeholder="0.00"
                autoFocus
              />
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-8 pt-6">
          <button 
            type="button" 
            className="w-full py-4 rounded-2xl bg-amber-600 text-white text-xs font-black uppercase tracking-widest hover:bg-amber-700 transition-all shadow-xl shadow-amber-500/30 disabled:opacity-30 active:scale-[0.98] group relative overflow-hidden" 
            disabled={!canConfirm}
            onClick={onConfirm}
          >
            <span className="relative z-10">{saving ? 'Procesando...' : 'Aplicar Penalización'}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
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
