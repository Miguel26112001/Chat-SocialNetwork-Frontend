import httpInstance from '@/shared/services/http.instance';
import { clearTokens, getRefreshToken, setTokens } from '@/shared/services/token-storage';
import type { AuthTokens } from '../model/auth-tokens.resource';
import type { LoginRequest } from '../model/login.request';
import type { RegisterRequest } from '../model/register.request';
import type { Session } from '../model/session.resource';
import type { User } from '../model/user.entity';

const BASE = 'auth';

/**
 * Servicio del ciclo de vida de la sesión (agregado RefreshToken del backend):
 * registro, login, logout, refresh y sesiones activas.
 */
export class AuthService {
  async register(request: RegisterRequest): Promise<User> {
    const response = await httpInstance.post<User>(`/${BASE}/register`, request);
    return response.data;
  }

  async login(request: LoginRequest): Promise<AuthTokens> {
    const response = await httpInstance.post<AuthTokens>(`/${BASE}/login`, request);
    setTokens(response.data.accessToken, response.data.refreshToken);
    return response.data;
  }

  async refreshSession(): Promise<AuthTokens> {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error('No hay refresh token almacenado');
    }
    const response = await httpInstance.post<AuthTokens>(`/${BASE}/refresh`, { refreshToken });
    setTokens(response.data.accessToken, response.data.refreshToken);
    return response.data;
  }

  async logout(): Promise<void> {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      await httpInstance.post(`/${BASE}/logout`, { refreshToken });
    }
    clearTokens();
  }

  async getSessions(): Promise<Session[]> {
    const response = await httpInstance.get<Session[]>(`/${BASE}/sessions`);
    return response.data;
  }
}
