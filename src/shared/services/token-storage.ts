/**
 * Almacenamiento local de los tokens de sesión (Identity).
 * El access token vive en memoria del navegador; el refresh token
 * también (el backend solo guarda su hash, nunca el texto plano).
 */
const ACCESS_TOKEN_KEY = 'chat.access_token';
const REFRESH_TOKEN_KEY = 'chat.refresh_token';

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return getAccessToken() !== null;
}
