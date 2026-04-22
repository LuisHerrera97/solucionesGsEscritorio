import type { AutenticacionResponseDto, UsuarioDto } from '../../domain/seguridad/types';
import { LAST_ACTIVITY_AT_KEY, REFRESH_KEY, TOKEN_KEY, USER_KEY } from './storageKeys';

export const sessionStorage = {
  saveLogin: (data: AutenticacionResponseDto) => {
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(REFRESH_KEY, data.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(data.usuario));
    localStorage.setItem(LAST_ACTIVITY_AT_KEY, String(Date.now()));
  },
  touchActivity: () => {
    localStorage.setItem(LAST_ACTIVITY_AT_KEY, String(Date.now()));
  },
  getLastActivityAt: (): number | null => {
    const raw = localStorage.getItem(LAST_ACTIVITY_AT_KEY);
    if (!raw) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(LAST_ACTIVITY_AT_KEY);
  },
  getToken: () => localStorage.getItem(TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_KEY),
  getUser: (): UsuarioDto | null => {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UsuarioDto;
    } catch {
      return null;
    }
  },
};
