import { AxiosError } from 'axios';

/**
 * Extrae el mensaje de error del backend (formato ErrorResponse:
 * { message, ... }). Si no hay mensaje, devuelve el fallback.
 */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as { message?: unknown } | undefined;
    if (typeof data?.message === 'string' && data.message.length > 0) {
      return data.message;
    }
    if (error.message) {
      return error.message;
    }
  }
  return fallback;
}
