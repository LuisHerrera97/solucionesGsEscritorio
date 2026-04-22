import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, HelpCircle, X, Info } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: 'danger' | 'warning' | 'info' | 'success';
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  type = 'info',
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDialogProps) => {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      const timer = setTimeout(() => setVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
      const timer = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!mounted) return null;

  const iconMap = {
    danger: <XCircleCustom className="text-red-600" />,
    warning: <AlertCircle className="text-amber-600" size={24} />,
    info: <HelpCircle className="text-blue-600" size={24} />,
    success: <CheckCircle2 className="text-emerald-600" size={24} />,
  };

  const bgMap = {
    danger: 'bg-red-50',
    warning: 'bg-amber-50',
    info: 'bg-blue-50',
    success: 'bg-emerald-50',
  };

  const btnMap = {
    danger: 'bg-red-600 hover:bg-red-700 shadow-red-200',
    warning: 'bg-amber-600 hover:bg-amber-700 shadow-amber-200',
    info: 'bg-primaryBlue hover:bg-blue-700 shadow-blue-200',
    success: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200',
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300" 
        onClick={!loading ? onCancel : undefined} 
      />
      
      <div 
        className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transition-all duration-300 transform ${
          visible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4 opacity-0'
        }`}
      >
        <div className="p-8">
          <div className="flex flex-col items-center text-center">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${bgMap[type]} animate-in zoom-in duration-500`}>
              {iconMap[type] || <Info className="text-blue-600" size={28} />}
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {title}
            </h3>
            <p className="text-gray-500 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 px-8 py-5 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            disabled={loading}
            className="flex-1 px-6 py-3 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-50"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={loading}
            className={`flex-1 px-6 py-3 rounded-xl text-sm font-bold text-white shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 ${btnMap[type]}`}
            onClick={onConfirm}
          >
            {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

const XCircleCustom = ({ className }: { className?: string }) => (
  <div className={`relative ${className}`}>
    <X size={24} />
  </div>
);
