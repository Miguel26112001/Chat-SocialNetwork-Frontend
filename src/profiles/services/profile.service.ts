import { MOCK_PROFILES } from '../mock/profiles.mock';
import type { Profile } from '../model/profile.entity';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Servicio de perfiles.
 * DEMO: opera sobre mocks con la firma del futuro servicio real
 * (GET perfil, POST follow/unfollow).
 */
class ProfileService {
  /**
   * Obtiene un perfil. Si es el propio usuario y aún no tiene perfil
   * (sin endpoint real), se sintetiza uno vacío pero coherente con
   * su cuenta de Identity.
   */
  async getProfile(username: string, currentUsername?: string): Promise<Profile | null> {
    await delay(400);
    const profile = MOCK_PROFILES[username];
    if (profile) {
      return { ...profile };
    }
    if (currentUsername && username === currentUsername) {
      return {
        username,
        displayName: username,
        bio: '',
        isPrivate: false,
        followersCount: 0,
        followingCount: 0,
        followedByMe: false
      };
    }
    return null;
  }

  async toggleFollow(username: string): Promise<Profile | null> {
    await delay(150);
    const profile = MOCK_PROFILES[username];
    if (!profile) {
      return null;
    }
    profile.followedByMe = !profile.followedByMe;
    profile.followersCount += profile.followedByMe ? 1 : -1;
    return { ...profile };
  }
}

export const profileService = new ProfileService();
