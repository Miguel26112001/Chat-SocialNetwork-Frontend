import httpInstance from '@/shared/services/http.instance';
import type { ChangePasswordRequest } from '../model/change-password.request';
import type { User } from '../model/user.entity';

const BASE = 'users';

/**
 * Servicio de cuentas (agregado User del backend):
 * consulta y gestión de cuentas.
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

  async getByEmail(email: string): Promise<User> {
    const response = await httpInstance.get<User>(`/${BASE}/email/${email}`);
    return response.data;
  }

  async changePassword(request: ChangePasswordRequest): Promise<void> {
    await httpInstance.post(`/${BASE}/me/password`, request);
  }

  async deactivateMe(): Promise<void> {
    await httpInstance.post(`/${BASE}/me/deactivate`);
  }

  async activateMe(): Promise<void> {
    await httpInstance.post(`/${BASE}/me/activate`);
  }

  async promoteUser(id: string): Promise<void> {
    await httpInstance.post(`/${BASE}/${id}/promote`);
  }

  async demoteUser(id: string): Promise<void> {
    await httpInstance.post(`/${BASE}/${id}/demote`);
  }
}
