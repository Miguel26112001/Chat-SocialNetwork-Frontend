import httpInstance from '@/shared/services/http.instance';
import type { ChangePasswordRequest } from '../model/change-password.request';
import type { User } from '../model/user.entity';

const BASE = 'users';

/**
 * Servicio de cuentas (agregado User del backend):
 * consulta y gestión del propio usuario.
 */
export class UserService {
  async getMe(): Promise<User> {
    const response = await httpInstance.get<User>(`/${BASE}/me`);
    return response.data;
  }

  async getById(id: string): Promise<User> {
    const response = await httpInstance.get<User>(`/${BASE}/${id}`);
    return response.data;
  }

  async getByUsername(username: string): Promise<User> {
    const response = await httpInstance.get<User>(`/${BASE}/username/${username}`);
    return response.data;
  }

  async changePassword(request: ChangePasswordRequest): Promise<void> {
    await httpInstance.post(`/${BASE}/me/password`, request);
  }
}
