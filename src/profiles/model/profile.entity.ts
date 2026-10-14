/**
 * Perfil público de un usuario.
 * Espejo de profiles.profiles (+ conteos de social.follows).
 */
export interface Profile {
  username: string;
  displayName: string;
  bio: string;
  isPrivate: boolean;
  followersCount: number;
  followingCount: number;
  /** Solo para otros usuarios: si yo lo sigo. */
  followedByMe: boolean;
}
