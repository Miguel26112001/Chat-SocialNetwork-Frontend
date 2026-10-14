import type { NotificationItem } from '../model/notification.entity';

/**
 * Datos de demostración de notificaciones.
 * TODO(backend): sustituir por GET /api/v1/notifications cuando el
 * contexto Notifications exponga endpoints.
 */
const NOW = Date.now();
const MIN = 60_000;
const HOUR = 60 * MIN;

function isoAgo(ms: number): string {
  return new Date(NOW - ms).toISOString();
}

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    type: 'POST_LIKE',
    actorName: 'Bruno',
    text: 'le dio like a tu publicación',
    createdAt: isoAgo(15 * MIN),
    read: false
  },
  {
    id: 'n-2',
    type: 'NEW_FOLLOW',
    actorName: 'Carla',
    text: 'empezó a seguirte',
    createdAt: isoAgo(2 * HOUR),
    read: false
  },
  {
    id: 'n-3',
    type: 'POST_COMMENT',
    actorName: 'Ana',
    text: 'comentó: «Qué vistas. Necesito esa oficina.»',
    createdAt: isoAgo(5 * HOUR),
    read: false
  },
  {
    id: 'n-4',
    type: 'COMMENT_REPLY',
    actorName: 'Diego',
    text: 'respondió a tu comentario',
    createdAt: isoAgo(30 * HOUR),
    read: true
  }
];
