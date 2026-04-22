import { Calendar } from 'lucide-react';

type CortesFiltersProps = {
  fechaInicio: string;
  fechaFin: string;
  onChangeFechaInicio: (value: string) => void;
  onChangeFechaFin: (value: string) => void;
};

export const CortesFilters = ({ fechaInicio, fechaFin, onChangeFechaInicio, onChangeFechaFin }: CortesFiltersProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="form-label text-xs uppercase text-textMuted">Desde</label>
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-textMuted" />
            <input type="date" className="form-input w-auto min-w-[160px]" value={fechaInicio} onChange={(e) => onChangeFechaInicio(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="form-label text-xs uppercase text-textMuted">Hasta</label>
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-textMuted" />
            <input type="date" className="form-input w-auto min-w-[160px]" value={fechaFin} onChange={(e) => onChangeFechaFin(e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  );
};

