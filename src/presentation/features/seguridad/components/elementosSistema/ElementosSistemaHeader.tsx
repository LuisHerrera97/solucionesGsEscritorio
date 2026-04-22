import { Plus } from 'lucide-react';

export const ElementosSistemaHeader = ({ onNuevo, disabled }: { onNuevo: () => void; disabled: boolean }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Elementos del sistema</h1>
        <p className="text-sm text-textMuted">Administra módulos, páginas y botones que se usan en permisos y menú.</p>
      </div>
      <button type="button" className="btn btn-primary flex items-center gap-2" onClick={onNuevo} disabled={disabled}>
        <Plus size={18} />
        Nuevo
      </button>
    </div>
  );
};

