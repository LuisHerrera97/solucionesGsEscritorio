import { Plus } from 'lucide-react';
import { numberInputDisplay, parseNumberInput, type NumberInputValue } from '../../../../../infrastructure/utils/numberInput';

type NuevaZonaFormProps = {
  nombre: string;
  orden: NumberInputValue;
  loading: boolean;
  onChangeNombre: (value: string) => void;
  onChangeOrden: (value: NumberInputValue) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export const NuevaZonaForm = ({ nombre, orden, loading, onChangeNombre, onChangeOrden, onSubmit }: NuevaZonaFormProps) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <form onSubmit={onSubmit} className="flex flex-col md:flex-row gap-3 md:items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">Nueva zona</label>
          <input
            value={nombre}
            onChange={(e) => onChangeNombre(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primaryBlue/20 focus:border-primaryBlue"
            placeholder="Ej: Centro"
          />
        </div>
        <div className="w-full md:w-40">
          <label className="block text-sm font-medium text-gray-700 mb-2">Orden</label>
          <input
            type="number"
            value={numberInputDisplay(orden)}
            onChange={(e) => onChangeOrden(parseNumberInput(e.target.value))}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primaryBlue/20 focus:border-primaryBlue"
          />
        </div>
        <button type="submit" className="btn btn-primary px-5 py-2.5 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed" disabled={loading || !nombre.trim()}>
          <Plus size={18} />
          Agregar
        </button>
      </form>
    </div>
  );
};

