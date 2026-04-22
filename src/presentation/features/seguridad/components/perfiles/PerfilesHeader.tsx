import { Plus } from 'lucide-react';

type PerfilesHeaderProps = {
  busqueda: string;
  onChangeBusqueda: (value: string) => void;
  onNuevo: () => void;
};

export const PerfilesHeader = ({ busqueda, onChangeBusqueda, onNuevo }: PerfilesHeaderProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Perfiles</h1>
        <p className="text-sm text-textMuted">Administra perfiles que se asignan a los usuarios.</p>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          className="form-input max-w-xs"
          placeholder="Buscar por nombre o clave"
          value={busqueda}
          onChange={(e) => onChangeBusqueda(e.target.value)}
        />
        <button type="button" className="btn btn-primary flex items-center gap-2" onClick={onNuevo}>
          <Plus size={18} />
          Nuevo
        </button>
      </div>
    </div>
  );
};

