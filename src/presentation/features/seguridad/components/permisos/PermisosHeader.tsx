import type { Guid } from '../../../../../domain/seguridad/types';

type PermisosHeaderProps = {
  perfiles: { id: Guid; nombre: string }[];
  selectedPerfilId: Guid | '';
  loadingPerfiles: boolean;
  onChangePerfilId: (value: Guid) => void;
};

export const PermisosHeader = ({ perfiles, selectedPerfilId, loadingPerfiles, onChangePerfilId }: PermisosHeaderProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Permisos</h1>
        <p className="text-sm text-textMuted">Asigna módulos, páginas y botones por perfil.</p>
      </div>
      <div className="flex items-center gap-2">
        <select className="form-input" value={selectedPerfilId} onChange={(e) => onChangePerfilId(e.target.value as Guid)} disabled={loadingPerfiles || perfiles.length === 0}>
          <option value="" disabled>
            Selecciona perfil
          </option>
          {perfiles.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

