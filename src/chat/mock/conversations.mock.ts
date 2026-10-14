import type { Conversation } from '../model/conversation.entity';

/**
 * Datos de demostración de mensajería.
 * TODO(backend): sustituir por endpoints de chat (aún sin diseñar).
 * Sin WebSockets: el envío añade el mensaje localmente.
 */
const NOW = Date.now();
const MIN = 60_000;
const HOUR = 60 * MIN;

function isoAgo(ms: number): string {
  return new Date(NOW - ms).toISOString();
}

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'chat-ana',
    username: 'ana_dev',
    displayName: 'Ana',
    lastMessage: '¿Viste el nuevo feed? Quedó genial',
    lastMessageAt: isoAgo(12 * MIN),
    unreadCount: 2,
    messages: [
      { id: 'm-1', mine: false, content: 'Hola, ¿ya probaste el rediseño?', createdAt: isoAgo(40 * MIN) },
      { id: 'm-2', mine: true, content: 'Sí, justo lo estoy revisando ahora', createdAt: isoAgo(32 * MIN) },
      { id: 'm-3', mine: false, content: '¿Viste el nuevo feed? Quedó genial', createdAt: isoAgo(12 * MIN) }
    ]
  },
  {
    id: 'chat-bruno',
    username: 'bruno_q',
    displayName: 'Bruno',
    lastMessage: 'Te paso las fotos esta noche',
    lastMessageAt: isoAgo(3 * HOUR),
    unreadCount: 0,
    messages: [
      { id: 'm-4', mine: true, content: 'Esas fotos del atardecer están increíbles', createdAt: isoAgo(5 * HOUR) },
      { id: 'm-5', mine: false, content: 'Gracias. Te paso las fotos esta noche', createdAt: isoAgo(3 * HOUR) }
    ]
  },
  {
    id: 'chat-carla',
    username: 'carla_m',
    displayName: 'Carla',
    lastMessage: 'El modo oscuro es lo mejor que nos pasó',
    lastMessageAt: isoAgo(26 * HOUR),
    unreadCount: 0,
    messages: [
      { id: 'm-6', mine: false, content: 'El modo oscuro es lo mejor que nos pasó', createdAt: isoAgo(26 * HOUR) }
    ]
  }
];
