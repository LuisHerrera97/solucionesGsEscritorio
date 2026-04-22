import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import { API_BASE_URLS, API_ENDPOINTS_SEGURIDAD } from '../config/apiEndpoints';
import type { AutenticacionResponseDto } from '../../domain/seguridad/types';
import { LAST_ACTIVITY_AT_KEY, REFRESH_KEY, TOKEN_KEY, USER_KEY } from '../auth/storageKeys';
import type { ApiResponse } from '../../domain/shared/ApiResponse';
import { unwrapApiResponse } from './unwrapApiResponse';

const apiInstance = axios.create({
  baseURL: API_BASE_URLS.SERVER,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

apiInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshPromise: Promise<string> | null = null;

const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = localStorage.getItem(REFRESH_KEY);
  const rawUser = localStorage.getItem(USER_KEY);
  const userId = rawUser ? (JSON.parse(rawUser) as { id?: string } | null)?.id : null;

  if (!refreshToken || !userId) {
    throw new Error('Sesión expirada');
  }

  const url = `${API_BASE_URLS.SERVER.replace(/\/$/, '')}${API_ENDPOINTS_SEGURIDAD.REFRESH}`;
  const response = await axios.post<ApiResponse<AutenticacionResponseDto>>(
    url,
    { userId, refreshToken },
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      withCredentials: true,
    },
  );

  const data = unwrapApiResponse(response.data);
  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(REFRESH_KEY, data.refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(data.usuario));

  return data.token;
};

apiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status as number | undefined;
    const url = String(error.config?.url ?? '');
    const originalRequest = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !url.includes(API_ENDPOINTS_SEGURIDAD.LOGIN) &&
      !url.includes(API_ENDPOINTS_SEGURIDAD.REFRESH)
    ) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = refreshAccessToken().finally(() => {
            refreshPromise = null;
          });
        }

        const newToken = await refreshPromise;
        originalRequest.headers = {
          ...(originalRequest.headers ?? {}),
          Authorization: `Bearer ${newToken}`,
        };

        return apiInstance.request(originalRequest);
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(LAST_ACTIVITY_AT_KEY);
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default apiInstance;
export { TOKEN_KEY };
