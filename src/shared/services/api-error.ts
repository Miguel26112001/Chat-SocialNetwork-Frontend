import { AxiosError } from 'axios';

/**
 * Extrae el mensaje de error del backend (formato ErrorResponse:
 * { message, ... }). Casos especiales:
 *  - 429 (rate limiting del gateway): mensaje amigable con los segundos
 *    de espera del header Retry-After, en vez del texto técnico de axios.
 * Si no hay mensaje, devuelve el fallback.
 */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) {
    if (error.response?.status === 429) {
      return tooManyRequestsMessage(error);
    }
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

/**
 * Mensaje para 429 usando el header Retry-After (segundos) que envía
 * el gateway. Si no viene, mensaje genérico sin tecnicismos.
 */
function tooManyRequestsMessage(error: AxiosError): string {
  const headers = error.response?.headers;
  const raw: unknown =
    typeof headers?.get === 'function'
      ? headers.get('retry-after')
      : (headers as Record<string, unknown> | undefined)?.['retry-after'];
  const seconds = typeof raw === 'string' ? Number.parseInt(raw, 10) : NaN;
  if (Number.isFinite(seconds) && seconds > 0) {
    return `Demasiados intentos. Inténtalo de nuevo en ${seconds} segundo${seconds === 1 ? '' : 's'}.`;
  }
  return 'Demasiados intentos. Espera unos segundos e inténtalo de nuevo.';
}
