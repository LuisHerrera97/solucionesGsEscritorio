import { useState } from 'react';
import { toast } from 'react-toastify';
import { Save } from 'lucide-react';
import type { AsignarPermisosRequestDto, Guid, ModuloDto } from '../../../../../domain/seguridad/types';
import { getErrorMessage } from '../../../../../infrastructure/utils/getErrorMessage';
import { useSetPermisosMutation } from '../../hooks/seguridadHooks';

const toggleAll = (modulo: ModuloDto, checked: boolean): ModuloDto => ({
  ...modulo,
  tienePermiso: checked,
  paginas: (modulo.paginas ?? []).map((p) => ({
    ...p,
    tienePermiso: checked,
    botones: (p.botones ?? []).map((b) => ({ ...b, tienePermiso: checked })),
  })),
});

export const PermisosEditor = ({ perfilId, menu }: { perfilId: Guid; menu: ModuloDto[] }) => {
  const [menuState, setMenuState] = useState<ModuloDto[]>(() => menu);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const setPermisosMutation = useSetPermisosMutation(perfilId);

  const onToggleModulo = (id: Guid, checked: boolean) => {
    setMenuState((prev) => prev.map((m) => (m.id === id ? toggleAll(m, checked) : m)));
  };

  const onTogglePagina = (idModulo: Guid, idPagina: Guid, checked: boolean) => {
    setMenuState((prev) =>
      prev.map((m) => {
        if (m.id !== idModulo) return m;
        const paginas = (m.paginas ?? []).map((p) => {
          if (p.id !== idPagina) return p;
          return { ...p, tienePermiso: checked, botones: (p.botones ?? []).map((b) => ({ ...b, tienePermiso: checked })) };
        });
        const anyPagina = paginas.some((p) => p.tienePermiso);
        return { ...m, tienePermiso: anyPagina, paginas };
      }),
    );
  };

  const onToggleBoton = (idModulo: Guid, idPagina: Guid, idBoton: Guid, checked: boolean) => {
    setMenuState((prev) =>
      prev.map((m) => {
        if (m.id !== idModulo) return m;
        const paginas = (m.paginas ?? []).map((p) => {
          if (p.id !== idPagina) return p;
          const botones = (p.botones ?? []).map((b) => (b.id === idBoton ? { ...b, tienePermiso: checked } : b));
          const anyBoton = botones.some((b) => b.tienePermiso);
          return { ...p, tienePermiso: anyBoton, botones };
        });
        const anyPagina = paginas.some((p) => p.tienePermiso);
        return { ...m, tienePermiso: anyPagina, paginas };
      }),
    );
  };

  const guardar = async () => {
    const modulosPermitidos: Guid[] = [];
    const paginasPermitidas: Guid[] = [];
    const botonesPermitidos: Guid[] = [];

    for (const m of menuState) {
      if (m.tienePermiso) modulosPermitidos.push(m.id);
      for (const p of m.paginas ?? []) {
        if (p.tienePermiso) paginasPermitidas.push(p.id);
        for (const b of p.botones ?? []) {
          if (b.tienePermiso) botonesPermitidos.push(b.id);
        }
      }
    }

    const payload: AsignarPermisosRequestDto = {
      idPerfil: perfilId,
      modulosPermitidos,
      paginasPermitidas,
      botonesPermitidos,
    };

    try {
      await setPermisosMutation.mutateAsync(payload);
      toast.success('Permisos guardados');
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'No fue posible guardar los permisos'));
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn btn-light" onClick={() => setMenuState((prev) => prev.map((m) => toggleAll(m, true)))}>
          Seleccionar todo
        </button>
        <button type="button" className="btn btn-light" onClick={() => setMenuState((prev) => prev.map((m) => toggleAll(m, false)))}>
          Quitar todo
        </button>
        <button type="button" className="btn btn-light" onClick={() => setExpanded((prev) => Object.fromEntries(menuState.map((m) => [m.id, !Object.values(prev).some(Boolean)])))}>
          Expandir / Contraer
        </button>
        <button type="button" className="btn btn-primary flex items-center gap-2" onClick={guardar} disabled={setPermisosMutation.isPending}>
          <Save size={18} />
          Guardar
        </button>
      </div>

      <div className="space-y-2">
        {menuState.map((m) => {
          const isOpen = expanded[m.id] ?? true;
          return (
            <div key={m.id} className="rounded-lg border border-gray-100">
              <div className="flex items-center justify-between px-3 py-2 bg-gray-50/70">
                <label className="flex items-center gap-2 text-sm font-semibold text-textDark">
                  <input type="checkbox" checked={m.tienePermiso} onChange={(e) => onToggleModulo(m.id, e.target.checked)} />
                  {m.nombre} <span className="text-xs font-normal text-textMuted">({m.clave})</span>
                </label>
                <button type="button" className="text-xs text-primaryBlue hover:underline" onClick={() => setExpanded((p) => ({ ...p, [m.id]: !isOpen }))}>
                  {isOpen ? 'Ocultar' : 'Ver'}
                </button>
              </div>

              {isOpen && (
                <div className="p-3 space-y-2">
                  {(m.paginas ?? []).map((p) => (
                    <div key={p.id} className="rounded-md border border-gray-100 p-3">
                      <label className="flex items-center gap-2 text-sm font-medium text-textDark">
                        <input type="checkbox" checked={p.tienePermiso} onChange={(e) => onTogglePagina(m.id, p.id, e.target.checked)} />
                        {p.nombre} <span className="text-xs font-normal text-textMuted">({p.clave})</span>
                        <span className="text-xs text-textMuted">· {p.ruta}</span>
                        {p.enMenu === false && (
                          <span className="text-xs font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">No menú</span>
                        )}
                      </label>
                      {(p.botones ?? []).length > 0 && (
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 pl-5">
                          {(p.botones ?? []).map((b) => (
                            <label key={b.id} className="flex items-center gap-2 text-sm text-textMuted">
                              <input type="checkbox" checked={b.tienePermiso} onChange={(e) => onToggleBoton(m.id, p.id, b.id, e.target.checked)} />
                              {b.nombre} <span className="text-xs text-gray-400">({b.clave})</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {(m.paginas ?? []).length === 0 && <div className="text-sm text-textMuted px-1">Este módulo no tiene páginas registradas.</div>}
                </div>
              )}
            </div>
          );
        })}

        {menuState.length === 0 && <div className="text-sm text-textMuted">No hay módulos registrados.</div>}
      </div>
    </div>
  );
};

