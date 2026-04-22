import type { AxiosError } from 'axios';

export type HttpError = {
  httpCode: number;
  message: string;
  raw?: unknown;
};

export const errorResponseAdapter = (error: unknown): HttpError => {
  const axiosError = error as AxiosError<unknown>;
  const status = axiosError.response?.status ?? 0;
  const data = axiosError.response?.data;

  const getDataMessage = (): string | undefined => {
    if (!data || typeof data !== 'object') return undefined;
    const record = data as Record<string, unknown>;
    const mensaje = record.mensaje ?? record.message ?? record.Message;
    return mensaje != null ? String(mensaje) : undefined;
  };

  const message =
    getDataMessage() ??
    (status === 401 ? 'Credenciales incorrectas o sesión expirada.' : undefined) ??
    (status === 403 ? 'No cuenta con permisos para realizar esta acción.' : undefined) ??
    (status === 404 ? 'No se encontró el recurso solicitado.' : undefined) ??
    (axiosError.message || 'Ocurrió un error al consumir el recurso solicitado');

  return {
    httpCode: status,
    message,
    raw: error,
  };
};
