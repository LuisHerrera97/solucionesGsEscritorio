import { Building2, MapPin, Pencil, Trash2 } from 'lucide-react';
import type { Cliente } from '../../../../../domain/finanzas/types';

type ClienteCardProps = {
  cliente: Cliente;
  onEditar?: () => void;
  onEliminar?: () => void;
  puedeEditar?: boolean;
  puedeEliminar?: boolean;
};

export const ClienteCard = ({ cliente, onEditar, onEliminar, puedeEditar, puedeEliminar }: ClienteCardProps) => {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-slate-800">
            {cliente.nombre} {cliente.apellido}
          </h3>
          <p className="mt-0.5 truncate text-sm text-slate-500">{cliente.negocio}</p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
            cliente.estatus === 'Activo'
              ? 'bg-emerald-50 text-emerald-700'
              : cliente.estatus === 'Inactivo'
                ? 'bg-rose-50 text-rose-700'
                : 'bg-amber-50 text-amber-800'
          }`}
        >
          {cliente.estatus}
        </span>
      </div>
      <div className="space-y-2 text-sm text-slate-600">
        <p className="flex gap-2">
          <MapPin size={16} className="mt-0.5 shrink-0 text-slate-400" aria-hidden />
          <span>{cliente.direccion}</span>
        </p>
        <p className="flex gap-2">
          <Building2 size={16} className="mt-0.5 shrink-0 text-slate-400" aria-hidden />
          <span>{cliente.zona}</span>
        </p>
      </div>

      {(puedeEditar || puedeEliminar) && (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
          {puedeEditar && (
            <button
              type="button"
              onClick={onEditar}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-primaryBlue shadow-sm transition hover:bg-slate-50 min-[380px]:flex-none"
            >
              <Pencil size={14} />
              Editar
            </button>
          )}
          {puedeEliminar && (
            <button
              type="button"
              onClick={onEliminar}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-700 shadow-sm transition hover:bg-rose-50 min-[380px]:flex-none"
            >
              <Trash2 size={14} />
              Eliminar
            </button>
          )}
        </div>
      )}
    </div>
  );
};
