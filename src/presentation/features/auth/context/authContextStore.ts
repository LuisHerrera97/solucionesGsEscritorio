import { createContext } from 'react';
import type { AutenticacionRequestDto, ModuloDto, UsuarioDto } from '../../../../domain/seguridad/types';

export type AuthContextType = {
  user: UsuarioDto | null;
  isAuthenticated: boolean;
  menu: ModuloDto[] | null;
  isMenuLoading: boolean;
  canAccessPath: (pathname: string) => boolean;
  canBoton: (botonClave: string) => boolean;
  login: (payload: AutenticacionRequestDto) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
