import { X } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';

export type ModalShellProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: ReactNode;
  /** Contenido con scroll interno (cuerpo del modal). */
  children: ReactNode;
  /** Pie fijo (botones, etc.); no hace scroll con el cuerpo. */
  footer?: ReactNode;
  /** Clases Tailwind de ancho máx. Ej: max-w-md, max-w-2xl */
  maxWidthClassName?: string;
  /** Clases Tailwind de alto máx. del panel completo. */
  maxHeightClassName?: string;
  titleId?: string;
};

/**
 * Contenedor estándar para modales: overlay, alto máximo, cabecera con cierre,
 * cuerpo con scroll y pie opcional. Alineado visualmente con ClienteModal.
 */
export const ModalShell = ({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidthClassName = 'max-w-2xl',
  maxHeightClassName = 'max-h-[min(880px,calc(100dvh-2rem))]',
  titleId = 'modal-shell-titulo',
}: ModalShellProps) => {
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-slate-900/50 p-4 backdrop-blur-[3px] sm:p-6"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`flex w-full ${maxWidthClassName} ${maxHeightClassName} flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_25px_50px_-12px_rgba(15,23,42,0.22)] ring-1 ring-slate-900/5`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative shrink-0 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Cerrar"
          >
            <X size={20} strokeWidth={2} />
          </button>
          <h2 id={titleId} className="pr-10 text-lg font-semibold text-textDark">
            {title}
          </h2>
          {subtitle != null && subtitle !== '' && <div className="mt-1 text-sm text-textMuted">{subtitle}</div>}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4 sm:px-6 sm:py-5">{children}</div>

        {footer != null && <div className="shrink-0 border-t border-slate-100 bg-slate-50/50 px-5 py-4 sm:px-6">{footer}</div>}
      </div>
    </div>
  );
};
