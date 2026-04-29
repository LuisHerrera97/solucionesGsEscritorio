import { Calendar } from 'lucide-react';

type DashboardHeaderProps = {
  fechaDesde: string;
  fechaHasta: string;
  onChangeFechaDesde: (value: string) => void;
  onChangeFechaHasta: (value: string) => void;
};

export const DashboardHeader = ({ fechaDesde, fechaHasta, onChangeFechaDesde, onChangeFechaHasta }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <h1 className="text-2xl font-bold text-gray-800">Panel Principal</h1>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2">
          <Calendar size={18} className="text-gray-500" />
          <input type="date" value={fechaDesde} onChange={(e) => onChangeFechaDesde(e.target.value)} className="text-sm border-0 p-0 focus:ring-0" />
          <span className="text-gray-400">a</span>
          <input type="date" value={fechaHasta} onChange={(e) => onChangeFechaHasta(e.target.value)} className="text-sm border-0 p-0 focus:ring-0" />
        </div>
        <p className="text-sm text-gray-500">{new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
    </div>
  );
};

