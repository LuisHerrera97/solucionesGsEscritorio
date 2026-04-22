import type { ZonaCobranzaDto } from '../../../../../domain/general/types';
import type { UsuarioDto } from '../../../../../domain/seguridad/types';

type CobranzaZonaFiltroPanelProps = {
  user: UsuarioDto | null;
  puedeElegirZona: boolean;
  zonas: ZonaCobranzaDto[];
  zonasLoading: boolean;
  zonaFiltro: string;
  onChangeZona: (value: string) => void;
  esZonaDelUsuario: boolean;
};

export const CobranzaZonaFiltroPanel = ({
  user,
  puedeElegirZona,
  zonas,
  zonasLoading,
  zonaFiltro,
  onChangeZona,
  esZonaDelUsuario,
}: CobranzaZonaFiltroPanelProps) => {
  if (!puedeElegirZona) return null;

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
        <label htmlFor="cobranza-zona-filtro" className="text-sm font-medium text-textDark">
          Zona de cobranza
        </label>
        <select
          id="cobranza-zona-filtro"
          className={`form-input max-w-md sm:w-72 ${esZonaDelUsuario ? 'ring-2 ring-primaryBlue/40 border-primaryBlue' : ''}`}
          value={zonaFiltro}
          disabled={zonasLoading}
          onChange={(e) => onChangeZona(e.target.value)}
        >
          <option value="">Todas las zonas</option>
          {zonas.map((z) => {
            const esMiZona = Boolean(user?.idZonaCobranza && z.id === user.idZonaCobranza);
            return (
              <option key={z.id} value={z.id}>
                {esMiZona ? `${z.nombre} — tu zona` : z.nombre}
              </option>
            );
          })}
        </select>
      </div>
      {esZonaDelUsuario && (
        <span className="inline-flex items-center rounded-full bg-primaryBlue/10 px-3 py-1 text-xs font-semibold text-primaryBlue">
          Vista filtrada a tu zona asignada
        </span>
      )}
      {zonaFiltro === '' && (
        <span className="text-xs text-textMuted sm:text-right">Mostrando datos de todas las zonas.</span>
      )}
    </div>
  );
};
