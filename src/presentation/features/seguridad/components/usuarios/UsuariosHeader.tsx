import { Plus } from 'lucide-react';

type UsuariosHeaderProps = {
  busqueda: string;
  onChangeBusqueda: (value: string) => void;
  onNuevo: () => void;
  disableNuevo: boolean;
};

export const UsuariosHeader = ({ busqueda, onChangeBusqueda, onNuevo, disableNuevo }: UsuariosHeaderProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Usuarios</h1>
        <p className="text-sm text-textMuted">Administra usuarios del sistema y asigna perfiles.</p>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          className="form-input max-w-xs"
          placeholder="Buscar usuario o perfil"
          value={busqueda}
          onChange={(e) => onChangeBusqueda(e.target.value)}
        />
        <button type="button" className="btn btn-primary flex items-center gap-2" onClick={onNuevo} disabled={disableNuevo}>
          <Plus size={18} />
          Nuevo
        </button>
      </div>
    </div>
  );
};

