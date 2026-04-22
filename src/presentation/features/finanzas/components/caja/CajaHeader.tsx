import { Calendar } from 'lucide-react';

type CajaHeaderProps = {
  fechaDesde: string;
  fechaHasta: string;
  onChangeFechaDesde: (value: string) => void;
  onChangeFechaHasta: (value: string) => void;

};

export const CajaHeader = ({
  fechaDesde,
  fechaHasta,
  onChangeFechaDesde,
  onChangeFechaHasta,

}: CajaHeaderProps) => {
  return (
    <div className="flex flex-wrap justify-between items-center gap-4">
      <h1 className="text-2xl font-bold text-gray-800">Caja</h1>
      <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2">
        <Calendar size={18} className="text-gray-500" />
        <input type="date" value={fechaDesde} onChange={(e) => onChangeFechaDesde(e.target.value)} className="text-sm border-0 p-0 focus:ring-0" />
        <span className="text-gray-400">a</span>
        <input type="date" value={fechaHasta} onChange={(e) => onChangeFechaHasta(e.target.value)} className="text-sm border-0 p-0 focus:ring-0" />
      </div>

    </div>
  );
};
