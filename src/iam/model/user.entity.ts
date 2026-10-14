/**
 * Cuenta de usuario (Identity).
 * Espejo de UserDto del backend.
 */
export interface User {
  id: string;
  username: string;
  email: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
