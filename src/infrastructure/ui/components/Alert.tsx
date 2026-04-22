import { useState } from 'react';
import { 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  XCircle, 
  X 
} from 'lucide-react';

interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export const Alert = ({ 
  type = 'info', 
  title, 
  message, 
  dismissible = false,
  onDismiss 
}: AlertProps) => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const styles = {
    success: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      text: 'text-emerald-800',
      icon: <CheckCircle2 className="text-emerald-500" size={20} />,
      btn: 'hover:bg-emerald-100'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-100',
      text: 'text-red-800',
      icon: <XCircle className="text-red-500" size={20} />,
      btn: 'hover:bg-red-100'
    },
    warning: {
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      text: 'text-amber-800',
      icon: <AlertCircle className="text-amber-500" size={20} />,
      btn: 'hover:bg-amber-100'
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      text: 'text-blue-800',
      icon: <Info className="text-blue-500" size={20} />,
      btn: 'hover:bg-blue-100'
    }
  };

  const current = styles[type];

  return (
    <div className={`flex items-start gap-4 p-4 rounded-xl border ${current.bg} ${current.border} ${current.text} transition-all duration-200 animate-in fade-in slide-in-from-top-2`}>
      <div className="flex-shrink-0 mt-0.5">
        {current.icon}
      </div>
      
      <div className="flex-1 min-w-0">
        {title && <h4 className="font-bold text-sm mb-1">{title}</h4>}
        <p className="text-sm leading-relaxed opacity-90">{message}</p>
      </div>

      {dismissible && (
        <button 
          onClick={() => {
            setVisible(false);
            onDismiss?.();
          }}
          className={`flex-shrink-0 p-1 rounded-lg transition-colors ${current.btn}`}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};
