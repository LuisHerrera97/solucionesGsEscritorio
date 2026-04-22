import { Plus } from 'lucide-react';
import { useAuth } from '../../../auth/context/useAuth';

type ClientesHeaderProps = {
  onNuevo: () => void;
};

export const ClientesHeader = ({ onNuevo }: ClientesHeaderProps) => {
  const { canBoton } = useAuth();
  const canCrear = canBoton('CLIENTE_CREAR');
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-800">Clientes</h1>
      {canCrear && (
        <button onClick={onNuevo} className="bg-primaryBlue hover:bg-primaryBlueDark text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus size={20} />
          Nuevo Cliente
        </button>
      )}
    </div>
  );
};
