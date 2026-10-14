/**
 * Sesión activa del usuario ("mis dispositivos").
 * Espejo de SessionDto del backend: nunca expone el token ni su hash.
 */
export interface Session {
  id: string;
  createdAt: string;
  expiresAt: string;
}
