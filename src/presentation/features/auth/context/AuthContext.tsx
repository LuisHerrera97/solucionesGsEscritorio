import { useCallback, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { AutenticacionRequestDto, ModuloDto, UsuarioDto } from '../../../../domain/seguridad/types';
import { useAppContainer } from '../../../../infrastructure/di/useAppContainer';
import { AuthContext } from './authContextStore';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { services, session } = useAppContainer();
  const [user, setUser] = useState<UsuarioDto | null>(() => session.getUser());

  const menuQuery = useQuery({
    queryKey: ['auth', 'menu', user?.idPerfil ?? ''],
    queryFn: () => services.seguridad.permisos.getMenu(user?.idPerfil as string),
    enabled: Boolean(user?.idPerfil),
    staleTime: 5 * 60 * 1000,
  });

  const menu = (menuQuery.data as ModuloDto[] | undefined) ?? null;

  const allowedPaginas = useMemo(() => {
    if (!menu) return [];
    const rutas: string[] = [];
    for (const m of menu) {
      for (const p of m.paginas ?? []) {
        if (p.activo && p.tienePermiso) rutas.push(p.ruta);
      }
    }
    return rutas;
  }, [menu]);

  const allowedBotones = useMemo(() => {
    if (!menu) return new Set<string>();
    const claves = new Set<string>();
    for (const m of menu) {
      for (const p of m.paginas ?? []) {
        for (const b of p.botones ?? []) {
          if (b.activo && b.tienePermiso) claves.add(b.clave);
        }
      }
    }
    return claves;
  }, [menu]);

  const canAccessPath = useCallback(
    (pathname: string) => {
      if (!pathname) return false;
      if (pathname === '/') return true;
      if (allowedPaginas.length === 0) return false;
      return allowedPaginas.some((ruta) => ruta === pathname || pathname.startsWith(`${ruta}/`));
    },
    [allowedPaginas],
  );

  const canBoton = useCallback((botonClave: string) => {
    if (!botonClave) return false;
    return allowedBotones.has(botonClave);
  }, [allowedBotones]);

  const login = useCallback(async (payload: AutenticacionRequestDto) => {
    const result = await services.seguridad.auth.loginAndStore(payload);
    setUser(result.usuario);
  }, [services.seguridad.auth]);

  const logout = useCallback(() => {
    services.seguridad.auth.logout();
    setUser(null);
  }, [services.seguridad.auth]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user && (session.getToken() || session.getRefreshToken())),
      menu,
      isMenuLoading: menuQuery.isLoading,
      canAccessPath,
      canBoton,
      login,
      logout,
    }),
    [user, session, menu, menuQuery.isLoading, canAccessPath, canBoton, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
