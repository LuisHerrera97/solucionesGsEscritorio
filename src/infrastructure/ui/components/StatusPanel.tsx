import { AlertCircle } from 'lucide-react';
import Spinner from './Spinner';

type StatusPanelProps = {
  title?: string;
  message?: string;
  variant: 'loading' | 'error' | 'empty';
  className?: string;
};

const StatusPanel = ({ title, message, variant, className }: StatusPanelProps) => {
  const defaults =
    variant === 'loading'
      ? { title: 'Cargando...', message: 'Espera un momento.' }
      : variant === 'error'
        ? { title: 'Ocurrió un error', message: 'No fue posible cargar la información.' }
        : { title: 'Sin resultados', message: 'No hay información para mostrar.' };

  const resolvedTitle = title ?? defaults.title;
  const resolvedMessage = message ?? defaults.message;

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className ?? ''}`}>
      <div className="flex items-start gap-3">
        {variant === 'loading' && <Spinner className="text-primaryBlue mt-0.5" />}
        {variant === 'error' && <AlertCircle size={18} className="text-red-600 mt-0.5" />}
        <div className="min-w-0">
          <div className="text-sm font-semibold text-textDark">{resolvedTitle}</div>
          <div className="text-sm text-textMuted mt-0.5">{resolvedMessage}</div>
        </div>
      </div>
    </div>
  );
};

export default StatusPanel;
