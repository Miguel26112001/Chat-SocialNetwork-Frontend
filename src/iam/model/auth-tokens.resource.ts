/**
 * Par de tokens emitido por login o refresh.
 * Espejo de AuthTokens del backend. El refreshToken en texto plano
 * solo existe aquí (en la BD del backend queda únicamente su hash).
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
}
