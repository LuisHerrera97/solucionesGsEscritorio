import { useState } from 'react';
import type { BotonDto, Guid, PaginaDto } from '../../../../../../domain/seguridad/types';
import { asNumber, numberInputDisplay, parseNumberInput, type NumberInputValue } from '../../../../../../infrastructure/utils/numberInput';

const emptyGuid = '00000000-0000-0000-0000-000000000000';

export const BotonForm = ({
  paginas,
  initial,
  onCancel,
  onSubmit,
}: {
  paginas: PaginaDto[];
  initial?: BotonDto;
  onCancel: () => void;
  onSubmit: (payload: BotonDto) => void | Promise<void>;
}) => {
  const [nombre, setNombre] = useState(initial?.nombre ?? '');
  const [clave, setClave] = useState(initial?.clave ?? '');
  const [idPagina, setIdPagina] = useState<Guid>((initial?.idPagina ?? paginas[0]?.id ?? ('' as Guid)) as Guid);
  const [orden, setOrden] = useState<NumberInputValue>(initial?.orden ?? 1);
  const [activo, setActivo] = useState<boolean>(initial?.activo ?? true);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !clave.trim() || !idPagina || orden === '' || asNumber(orden) <= 0) return;
    const pagina = paginas.find((p) => p.id === idPagina);
    onSubmit({
      id: initial?.id ?? emptyGuid,
      nombre: nombre.trim(),
      clave: clave.trim(),
      idPagina,
      nombrePagina: pagina?.nombre ?? initial?.nombrePagina ?? '',
      orden: asNumber(orden),
      activo,
      fechaCreacion: initial?.fechaCreacion ?? new Date().toISOString(),
      tienePermiso: initial?.tienePermiso ?? false,
    });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="form-label">Nombre</label>
          <input className="form-input" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </div>
        <div>
          <label className="form-label">Clave</label>
          <input className="form-input" value={clave} onChange={(e) => setClave(e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="form-label">Página</label>
          <select className="form-input" value={idPagina} onChange={(e) => setIdPagina(e.target.value as Guid)} disabled={paginas.length === 0}>
            {paginas.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label">Orden</label>
          <input type="number" min={1} className="form-input" value={numberInputDisplay(orden)} onChange={(e) => setOrden(parseNumberInput(e.target.value))} />
        </div>
      </div>
      <div className="flex items-center justify-between pt-1">
        <label className="flex items-center gap-2 text-sm text-textDark">
          <input type="checkbox" checked={activo} onChange={(e) => setActivo(e.target.checked)} />
          Activo
        </label>
        <div className="flex gap-2">
          <button type="button" className="btn btn-light" onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={!nombre.trim() || !clave.trim() || !idPagina || orden === '' || asNumber(orden) <= 0}>
            Guardar
          </button>
        </div>
      </div>
    </form>
  );
};

