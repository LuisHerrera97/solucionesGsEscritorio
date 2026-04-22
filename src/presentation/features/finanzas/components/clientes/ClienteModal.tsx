import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, Search, UserRound, X } from 'lucide-react';
import type { Cliente } from '../../../../../domain/finanzas/types';

export type ClienteDraft = Omit<Cliente, 'id'> & { id?: string };

type ClienteModalProps = {
  open: boolean;
  value: ClienteDraft;
  saving: boolean;
  zonas: string[];
  zonasLoading?: boolean;
  onChange: (value: ClienteDraft) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
};

const inputClass =
  'w-full rounded-2xl border border-slate-200/90 bg-slate-50/40 px-4 py-3 text-[15px] text-slate-800 shadow-inner shadow-white/50 placeholder:text-slate-400 transition-all duration-200 hover:border-slate-300 hover:bg-white focus:border-primaryBlue focus:bg-white focus:outline-none focus:ring-4 focus:ring-primaryBlue/15';

const selectClass =
  `${inputClass} cursor-pointer appearance-none pr-11`;

const sectionTitleClass =
  'mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500';

const sectionAccent = (
  <span className="h-1 w-6 rounded-full bg-gradient-to-r from-primaryBlue to-sky-400" aria-hidden />
);

export const ClienteModal = ({ open, value, saving, zonas, zonasLoading, onChange, onClose, onSubmit }: ClienteModalProps) => {
  const [zonaMenuAbierto, setZonaMenuAbierto] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const esEdicion = Boolean(value.id);

  useEffect(() => {
    if (!open) {
      setZonaMenuAbierto(false);
      setSearchTerm('');
    }
  }, [open]);

  const filteredZonas = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return zonas;
    return zonas.filter((z) => z.toLowerCase().includes(q));
  }, [searchTerm, zonas]);

  if (!open) return null;

  const estatusOpciones: Cliente['estatus'][] = ['Activo', 'Inactivo', 'En Revisión'];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[3px]"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="flex max-h-[min(92vh,840px)] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/60 bg-white shadow-[0_25px_50px_-12px_rgba(15,23,42,0.25)] ring-1 ring-slate-900/5 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cliente-modal-titulo"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="relative shrink-0 overflow-hidden border-b border-slate-100 bg-gradient-to-br from-sky-50/90 via-white to-white px-6 pb-6 pt-7 sm:px-8">
          <div className="pointer-events-none absolute -right-16 -top-24 h-56 w-56 rounded-full bg-sky-200/30 blur-3xl" aria-hidden />
          <div className="pointer-events-none absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-primaryBlue/5 blur-2xl" aria-hidden />

          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-xl p-2 text-slate-400 transition hover:bg-white/80 hover:text-slate-700 hover:shadow-sm sm:right-5 sm:top-5"
            aria-label="Cerrar"
          >
            <X size={20} strokeWidth={2} />
          </button>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primaryBlue to-sky-600 text-white shadow-lg shadow-primaryBlue/25">
              <UserRound size={28} strokeWidth={1.75} />
            </div>
            <div className="min-w-0 flex-1 pr-10 sm:pr-0">
              <h2 id="cliente-modal-titulo" className="text-2xl font-bold tracking-tight text-slate-900">
                {esEdicion ? 'Editar cliente' : 'Nuevo cliente'}
              </h2>
              <p className="mt-1.5 max-w-md text-sm leading-relaxed text-slate-600">
                {esEdicion
                  ? 'Actualiza la información del acreditado. Los cambios se reflejan de inmediato en el sistema.'
                  : 'Registra los datos del acreditado. Podrás asignarle créditos una vez guardado.'}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="custom-scrollbar flex-1 overflow-y-auto px-6 py-7 sm:px-8">
            {/* Identificación */}
            <div className="mb-8">
              <h3 className={sectionTitleClass}>
                {sectionAccent}
                Identificación
              </h3>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="cliente-nombre" className="mb-2 block text-sm font-medium text-slate-700">
                    Nombre
                  </label>
                  <input
                    id="cliente-nombre"
                    type="text"
                    placeholder="Ej. María"
                    className={inputClass}
                    required
                    autoComplete="given-name"
                    value={value.nombre}
                    onChange={(e) => onChange({ ...value, nombre: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="cliente-apellido" className="mb-2 block text-sm font-medium text-slate-700">
                    Apellido
                  </label>
                  <input
                    id="cliente-apellido"
                    type="text"
                    placeholder="Ej. Pérez"
                    className={inputClass}
                    required
                    autoComplete="family-name"
                    value={value.apellido}
                    onChange={(e) => onChange({ ...value, apellido: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Ubicación y actividad */}
            <div className="mb-8">
              <h3 className={sectionTitleClass}>
                {sectionAccent}
                Ubicación y actividad
              </h3>
              <div className="space-y-5">
                <div>
                  <label htmlFor="cliente-direccion" className="mb-2 block text-sm font-medium text-slate-700">
                    Dirección
                  </label>
                  <input
                    id="cliente-direccion"
                    type="text"
                    placeholder="Calle, número, colonia…"
                    className={inputClass}
                    required
                    autoComplete="street-address"
                    value={value.direccion}
                    onChange={(e) => onChange({ ...value, direccion: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="cliente-negocio" className="mb-2 block text-sm font-medium text-slate-700">
                    Negocio u ocupación
                  </label>
                  <input
                    id="cliente-negocio"
                    type="text"
                    placeholder="Ej. Tienda de abarrotes, mecánico…"
                    className={inputClass}
                    required
                    value={value.negocio}
                    onChange={(e) => onChange({ ...value, negocio: e.target.value })}
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <span className="mb-2 block text-sm font-medium text-slate-700">Zona de cobranza</span>
                    <div className="relative">
                      <button
                        type="button"
                        disabled={zonasLoading}
                        className={`flex w-full items-center justify-between rounded-2xl border border-slate-200/90 bg-slate-50/40 px-4 py-3 text-left text-[15px] shadow-inner shadow-white/50 transition-all duration-200 hover:border-slate-300 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 ${
                          zonaMenuAbierto ? 'border-primaryBlue bg-white ring-4 ring-primaryBlue/15' : ''
                        }`}
                        onClick={() => !zonasLoading && setZonaMenuAbierto(!zonaMenuAbierto)}
                      >
                        <span className={value.zona ? 'text-slate-800' : 'text-slate-400'}>
                          {zonasLoading ? 'Cargando zonas…' : value.zona || 'Selecciona una zona'}
                        </span>
                        <ChevronDown
                          size={20}
                          className={`shrink-0 text-slate-400 transition-transform duration-200 ${zonaMenuAbierto ? 'rotate-180' : ''}`}
                        />
                      </button>

                      {zonaMenuAbierto && (
                        <div className="absolute z-30 mt-2 max-h-56 w-full overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl ring-1 ring-slate-900/5 animate-in fade-in slide-in-from-top-1 duration-150">
                          <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/50 px-3 py-2">
                            <Search size={16} className="shrink-0 text-slate-400" />
                            <input
                              type="text"
                              className="h-9 w-full border-0 bg-transparent text-sm outline-none placeholder:text-slate-400"
                              placeholder="Filtrar zonas…"
                              autoFocus
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Escape') setZonaMenuAbierto(false);
                              }}
                            />
                          </div>
                          <div className="max-h-48 overflow-auto py-1">
                            {filteredZonas.length === 0 ? (
                              <div className="px-4 py-4 text-center text-sm text-slate-500">No hay coincidencias</div>
                            ) : (
                              filteredZonas.map((zona) => (
                                <button
                                  key={zona}
                                  type="button"
                                  className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-sky-50 hover:text-primaryBlue ${
                                    value.zona === zona ? 'bg-sky-50/80 font-semibold text-primaryBlue' : 'text-slate-700'
                                  }`}
                                  onClick={() => {
                                    onChange({ ...value, zona });
                                    setZonaMenuAbierto(false);
                                    setSearchTerm('');
                                  }}
                                >
                                  {zona}
                                </button>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="cliente-estatus" className="mb-2 block text-sm font-medium text-slate-700">
                      Estatus
                    </label>
                    <div className="relative">
                      <select
                        id="cliente-estatus"
                        className={selectClass}
                        value={value.estatus}
                        onChange={(e) => onChange({ ...value, estatus: e.target.value as Cliente['estatus'] })}
                      >
                        {estatusOpciones.map((op) => (
                          <option key={op} value={op}>
                            {op}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className="pointer-events-none absolute right-3.5 top-1/2 size-5 -translate-y-1/2 text-slate-400"
                        aria-hidden
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pie */}
          <div className="flex shrink-0 justify-end gap-3 border-t border-slate-100 bg-gradient-to-t from-slate-50/95 to-white px-6 py-4 sm:px-8">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="min-w-[148px] rounded-2xl bg-gradient-to-b from-primaryBlue to-sky-700 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primaryBlue/30 transition hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
              disabled={saving}
            >
              {saving ? 'Guardando…' : esEdicion ? 'Guardar cambios' : 'Guardar cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
