import type { Profile } from '../model/profile.entity';

/**
 * Datos de demostración de perfiles.
 * TODO(backend): sustituir por GET /api/v1/profiles/{username} y
 * los endpoints de follows cuando existan.
 */
export const MOCK_PROFILES: Record<string, Profile> = {
  ana_dev: {
    username: 'ana_dev',
    displayName: 'Ana',
    bio: 'Desarrolladora full-stack. Construyendo Chat Social.',
    isPrivate: false,
    followersCount: 128,
    followingCount: 96,
    followedByMe: false
  },
  bruno_q: {
    username: 'bruno_q',
    displayName: 'Bruno',
    bio: 'Fotógrafo aficionado. Cazador de atardeceres.',
    isPrivate: false,
    followersCount: 342,
    followingCount: 210,
    followedByMe: true
  },
  carla_m: {
    username: 'carla_m',
    displayName: 'Carla',
    bio: 'Diseñadora UX. Defiendo el modo oscuro.',
    isPrivate: true,
    followersCount: 89,
    followingCount: 104,
    followedByMe: false
  },
  diego_r: {
    username: 'diego_r',
    displayName: 'Diego',
    bio: 'Ingeniero de datos. Hablo de pipelines y de café.',
    isPrivate: false,
    followersCount: 57,
    followingCount: 63,
    followedByMe: false
  }
};

export const MOCK_SUGGESTIONS: Profile[] = [
  MOCK_PROFILES['bruno_q']!,
  MOCK_PROFILES['carla_m']!,
  MOCK_PROFILES['diego_r']!
];

export const MOCK_TRENDS: Array<{ tag: string; posts: number }> = [
  { tag: '#NuevoDiseño', posts: 1284 },
  { tag: '#ModoOscuro', posts: 862 },
  { tag: '#ChatSocial', posts: 645 },
  { tag: '#Fotografía', posts: 431 }
];
