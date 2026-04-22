import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Menu } from 'lucide-react';
import { AppSearchInput } from '../../infrastructure/ui/components/AppSearchInput';

const Navbar = ({ onOpenMobileMenu }: { onOpenMobileMenu?: () => void }) => {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');

  const irABuscarClientes = () => {
    const q = busqueda.trim();
    if (!q) {
      navigate('/clientes');
      return;
    }
    navigate(`/clientes?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="print:hidden bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          onClick={onOpenMobileMenu}
          aria-label="Abrir menú de navegación"
        >
          <Menu size={24} className="text-gray-600" />
        </button>
        <AppSearchInput
          value={busqueda}
          onChange={setBusqueda}
          onEnter={irABuscarClientes}
          placeholder="Buscar clientes (Enter)"
          aria-label="Buscar clientes"
          wrapperClassName="relative hidden md:block w-72"
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="p-2 rounded-full text-gray-400 cursor-not-allowed"
          disabled
          title="Notificaciones no disponibles por ahora"
          aria-disabled="true"
        >
          <Bell size={20} />
        </button>
        <div className="md:hidden w-8 h-8 rounded-full bg-primaryBlue text-white flex items-center justify-center font-bold text-sm">
          A
        </div>
      </div>
    </header>
  );
};

export default Navbar;

