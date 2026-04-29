import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  AlertCircle,
  ChevronDown,
  ClipboardList,
  DollarSign,
  FilePlus2,
  Home,
  LogOut,
  Scissors,
  Settings,
  Users,
  Wallet,
} from 'lucide-react';
import { useAuth } from '../features/auth/context/useAuth';

const Sidebar = ({
  mobileMenuOpen = false,
  onCloseMobileMenu,
}: {
  mobileMenuOpen?: boolean;
  onCloseMobileMenu?: () => void;
}) => {
  const { user, menu, logout } = useAuth();

  const getModuleIcon = (clave: string) => {
    const normalized = (clave ?? '').toUpperCase();
    if (normalized === 'GENERAL') return <Home size={16} />;
    if (normalized === 'CREDITOS') return <Wallet size={16} />;
    if (normalized === 'COBRANZA') return <ClipboardList size={16} />;
    if (normalized === 'SEGURIDAD') return <Settings size={16} />;
    return <Settings size={16} />;
  };

  const getPageIcon = (ruta: string) => {
    if (ruta === '/') return <Home size={20} />;
    if (ruta.startsWith('/clientes')) return <Users size={20} />;
    if (ruta.startsWith('/creditos/nuevo')) return <FilePlus2 size={20} />;
    if (ruta.startsWith('/creditos')) return <DollarSign size={20} />;
    if (ruta.startsWith('/movimientos')) return <ClipboardList size={20} />;
    if (ruta.startsWith('/pendientes')) return <AlertCircle size={20} />;
    if (ruta.startsWith('/cobranza')) return <ClipboardList size={20} />;
    if (ruta.startsWith('/cortes')) return <Scissors size={20} />;
    if (ruta.startsWith('/seguridad')) return <Settings size={20} />;
    if (ruta.startsWith('/general')) return <Settings size={20} />;
    return <Settings size={20} />;
  };

  const sections = (menu ?? [])
    .filter((m) => m.activo && m.tienePermiso)
    .map((m) => {
      const rutasVistas = new Set<string>();
      const items = (m.paginas ?? [])
        .filter((p) => p.activo && p.tienePermiso && p.enMenu !== false)
        .filter((p) => {
          const key = (p.ruta ?? '').trim();
          if (!key || rutasVistas.has(key)) return false;
          rutasVistas.add(key);
          return true;
        })
        .map((p) => ({
          icon: getPageIcon(p.ruta),
          label: p.nombre,
          path: p.ruta,
        }));
      return {
        title: m.nombre,
        icon: getModuleIcon(m.clave),
        items,
      };
    })
    .filter((s) => s.items.length > 0);

  const location = useLocation();

  const allItems = sections.flatMap((s) => s.items);
  const isItemActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    if (!location.pathname.startsWith(path)) return false;

    // Es activo si no hay otro item en el menú que sea una coincidencia más específica (más larga)
    return !allItems.some(
      (item) => item.path !== path && item.path.length > path.length && location.pathname.startsWith(item.path),
    );
  };

  const currentSectionTitle =
    sections.find((section) => section.items.some((item) => isItemActive(item.path)))?.title ?? null;
  const [manualOpenSection, setManualOpenSection] = useState<string | null>(null);
  const openSection = manualOpenSection ?? currentSectionTitle;

  return (
    <aside
      className={`print:hidden bg-white w-64 min-h-screen border-r border-gray-200 fixed md:relative inset-y-0 left-0 z-40 transform transition-transform duration-200 ease-out ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      } md:block`}
    >
      <div className="p-5 border-b border-gray-100">
        <h1 className="text-xl font-bold text-primaryBlue flex items-center gap-2">
          <DollarSign className="fill-primaryBlue text-white rounded-full bg-primaryBlue p-1" size={28} />
          <span>Financiera GS</span>
        </h1>
      </div>

      <nav className="mt-4 px-3 pb-28">
        <div className="mb-3">
          <NavLink
            to="/"
            onClick={() => {
              setManualOpenSection(null);
              onCloseMobileMenu?.();
            }}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors duration-150 ${
                isActive
                  ? 'bg-primaryBlue text-white font-medium shadow-sm'
                  : 'text-textMuted hover:bg-gray-100 hover:text-textDark'
              }`
            }
          >
            <Home size={20} />
            <span>Inicio</span>
          </NavLink>
        </div>
        {sections.map((section) => {
          const items = section.items.filter((i) => i.path !== '/');
          const isOpen = openSection === section.title;
          const hasActive = section.items.some((item) => isItemActive(item.path));
          return (
            <div key={section.title} className="mb-1">
              <button
                type="button"
                className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors duration-150 ${
                  hasActive
                    ? 'text-primaryBlue bg-primaryBlueLight/60'
                    : 'text-textMuted hover:bg-gray-50 hover:text-textDark'
                }`}
                onClick={() => setManualOpenSection(isOpen ? null : section.title)}
              >
                <span className="flex items-center gap-2">
                  {section.icon}
                  <span>{section.title}</span>
                </span>
                <ChevronDown
                  size={14}
                  className={`shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-textDark' : 'text-textMuted'
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-200 ease-out ${
                  isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <ul className="space-y-0.5 py-1">
                  {items.map((item) => (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        onClick={() => {
                          setManualOpenSection(null);
                          onCloseMobileMenu?.();
                        }}
                        className={() => {
                          const active = isItemActive(item.path);
                          return `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors duration-150 ${
                            active
                              ? 'bg-primaryBlue text-white font-medium shadow-sm'
                              : 'text-textMuted hover:bg-gray-100 hover:text-textDark'
                          }`;
                        }}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </nav>

      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-100 bg-white space-y-4">
        <div className="flex items-center gap-3 shrink-0">
          <div className="shrink-0 w-10 h-10 rounded-full bg-blue-50 text-primaryBlue flex items-center justify-center font-bold border border-blue-100 text-lg shadow-sm">
            {(user?.nombre?.[0] ?? 'U').toUpperCase()}
          </div>
          <div className="overflow-hidden min-w-0">
            <p className="text-sm font-bold text-textDark truncate leading-tight mb-0.5">
              {user ? `${user.nombre} ${user.apellidoPaterno}` : 'Usuario'}
            </p>
            <p className="text-[10px] text-textMuted truncate uppercase tracking-widest font-medium">
              {user?.nombrePerfil ?? 'Sin Perfil'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={logout}
          className="flex items-center justify-center gap-3 w-full py-2.5 px-4 text-[11px] font-bold uppercase tracking-widest text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-200 border border-red-100 hover:border-red-200 group active:scale-[0.98] shadow-sm hover:shadow"
        >
          <LogOut size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
