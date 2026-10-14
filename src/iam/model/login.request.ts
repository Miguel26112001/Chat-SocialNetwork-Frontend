/** Espejo de LoginRequest del backend (acepta username o email). */
export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}
