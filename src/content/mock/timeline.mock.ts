import type { Post, PostComment } from '../model/post.entity';

/**
 * Datos de demostración del feed.
 * TODO(backed): sustituir por GET /api/v1/timeline cuando el contexto
 * Content exponga endpoints. La forma de Post ya es espejo del contrato.
 */
const NOW = Date.now();
const MIN = 60_000;
const HOUR = 60 * MIN;

function isoAgo(ms: number): string {
  return new Date(NOW - ms).toISOString();
}

export const MOCK_POSTS: Post[] = [
  {
    id: 'post-1',
    author: { username: 'ana_dev', displayName: 'Ana' },
    content:
      'Estrenando el nuevo feed de Chat Social. Minimalista, rápido y sin ruido. ¿Qué os parece el nuevo diseño?',
    visibility: 'PUBLIC',
    likeCount: 24,
    commentCount: 2,
    likedByMe: false,
    createdAt: isoAgo(35 * MIN)
  },
  {
    id: 'post-2',
    author: { username: 'bruno_q', displayName: 'Bruno' },
    content: 'Atardecer desde la oficina. A veces hay que parar y mirar por la ventana.',
    imageUrl: 'https://picsum.photos/seed/chatsocial1/800/450',
    visibility: 'PUBLIC',
    likeCount: 58,
    commentCount: 1,
    likedByMe: true,
    createdAt: isoAgo(3 * HOUR)
  },
  {
    id: 'post-3',
    author: { username: 'carla_m', displayName: 'Carla' },
    content:
      'Recordatorio: el modo oscuro también cuida vuestros ojos. Está en el header, icono de luna.',
    visibility: 'PUBLIC',
    likeCount: 12,
    commentCount: 0,
    likedByMe: false,
    createdAt: isoAgo(7 * HOUR)
  },
  {
    id: 'post-4',
    author: { username: 'diego_r', displayName: 'Diego' },
    content: '¿Alguien más probando los mensajes? La vista lado a lado en escritorio es comodísima.',
    imageUrl: 'https://picsum.photos/seed/chatsocial2/800/450',
    visibility: 'PUBLIC',
    likeCount: 31,
    commentCount: 1,
    likedByMe: false,
    createdAt: isoAgo(26 * HOUR)
  }
];

export const MOCK_COMMENTS: Record<string, PostComment[]> = {
  'post-1': [
    {
      id: 'c-1',
      author: { username: 'bruno_q', displayName: 'Bruno' },
      content: 'Mucho más limpio que antes. El espaciado se nota.',
      createdAt: isoAgo(20 * MIN)
    },
    {
      id: 'c-2',
      author: { username: 'carla_m', displayName: 'Carla' },
      content: 'De acuerdo, por fin un feed que se puede leer.',
      createdAt: isoAgo(5 * MIN)
    }
  ],
  'post-2': [
    {
      id: 'c-3',
      author: { username: 'ana_dev', displayName: 'Ana' },
      content: 'Qué vistas. Necesito esa oficina.',
      createdAt: isoAgo(1 * HOUR)
    }
  ],
  'post-4': [
    {
      id: 'c-4',
      author: { username: 'carla_m', displayName: 'Carla' },
      content: 'Sí, y en móvil la navegación entre lista y chat va muy fluida.',
      createdAt: isoAgo(20 * HOUR)
    }
  ]
};
