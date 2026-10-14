/**
 * Mensaje de una conversación.
 * El backend aún no expone mensajería: sin flags de leído/entregado
 * (solo se muestran si el backend los soporta en el futuro).
 */
export interface ChatMessage {
  id: string;
  mine: boolean;
  content: string;
  createdAt: string;
}

/**
 * Conversación con un contacto.
 */
export interface Conversation {
  id: string;
  username: string;
  displayName: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  messages: ChatMessage[];
}
