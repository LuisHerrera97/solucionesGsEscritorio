import { useState } from 'react';
import type { Guid, ModuloDto, PaginaDto } from '../../../../../../domain/seguridad/types';
import { asNumber, numberInputDisplay, parseNumberInput, type NumberInputValue } from '../../../../../../infrastructure/utils/numberInput';

const emptyGuid = '00000000-0000-0000-0000-000000000000';

export const PaginaForm = ({
  modulos,
  initial,
  onCancel,
  onSubmit,
}: {
  modulos: ModuloDto[];
  initial?: PaginaDto;
  onCancel: () => void;
  onSubmit: (payload: PaginaDto) => void | Promise<void>;
}) => {
  const [nombre, setNombre] = useState(initial?.nombre ?? '');
  const [clave, setClave] = useState(initial?.clave ?? '');
  const [ruta, setRuta] = useState(initial?.ruta ?? '');
  const [idModulo, setIdModulo] = useState<Guid>((initial?.idModulo ?? modulos[0]?.id ?? ('' as Guid)) as Guid);
  const [orden, setOrden] = useState<NumberInputValue>(initial?.orden ?? 1);
  const [activo, setActivo] = useState<boolean>(initial?.activo ?? true);
  const [enMenu, setEnMenu] = useState<boolean>(initial?.enMenu ?? true);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !clave.trim() || !ruta.trim() || !idModulo || orden === '' || asNumber(orden) <= 0) return;
    const modulo = modulos.find((m) => m.id === idModulo);
    onSubmit({
      id: initial?.id ?? emptyGuid,
      nombre: nombre.trim(),
      clave: clave.trim(),
      ruta: ruta.trim(),
      idModulo,
      nombreModulo: modulo?.nombre ?? initial?.nombreModulo ?? '',
      orden: asNumber(orden),
      activo,
      enMenu,
      fechaCreacion: initial?.fechaCreacion ?? new Date().toISOString(),
      tienePermiso: initial?.tienePermiso ?? false,
      botones: initial?.botones ?? [],
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
          <label className="form-label">Ruta</label>
          <input className="form-input" value={ruta} onChange={(e) => setRuta(e.target.value)} placeholder="/usuarios" />
        </div>
        <div>
          <label className="form-label">Módulo</label>
          <select className="form-input" value={idModulo} onChange={(e) => setIdModulo(e.target.value as Guid)} disabled={modulos.length === 0}>
            {modulos.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="form-label">Orden</label>
          <input type="number" min={1} className="form-input" value={numberInputDisplay(orden)} onChange={(e) => setOrden(parseNumberInput(e.target.value))} />
        </div>
        <div className="flex flex-col gap-2 pt-5">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={activo} onChange={(e) => setActivo(e.target.checked)} />
            <span className="text-sm text-textDark">Activo</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={enMenu} onChange={(e) => setEnMenu(e.target.checked)} />
            <span className="text-sm text-textDark">Mostrar en menú</span>
          </label>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" className="btn btn-light" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={!nombre.trim() || !clave.trim() || !ruta.trim() || !idModulo || orden === '' || asNumber(orden) <= 0}>
          Guardar
        </button>
      </div>
    </form>
  );
};

