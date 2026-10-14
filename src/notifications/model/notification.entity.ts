/**
 * Notificación de la bandeja.
 * Espejo de notifications.notifications (tipos NEW_FOLLOW, POST_LIKE,
 * POST_COMMENT, COMMENT_REPLY).
 */
export interface NotificationItem {
  id: string;
  type: 'NEW_FOLLOW' | 'POST_LIKE' | 'POST_COMMENT' | 'COMMENT_REPLY';
  actorName: string;
  text: string;
  createdAt: string;
  read: boolean;
}
