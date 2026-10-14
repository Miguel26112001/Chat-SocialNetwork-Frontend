import { MOCK_CONVERSATIONS } from '../mock/conversations.mock';
import type { ChatMessage, Conversation } from '../model/conversation.entity';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Servicio de mensajería.
 * DEMO: opera sobre mocks en memoria. Sin WebSockets ni estados de
 * entrega: el envío añade el mensaje localmente.
 */
class ChatService {
  private conversations: Conversation[] = MOCK_CONVERSATIONS.map((chat) => ({
    ...chat,
    messages: chat.messages.map((message) => ({ ...message }))
  }));

  async getConversations(): Promise<Conversation[]> {
    await delay(400);
    return this.conversations.map((chat) => ({
      ...chat,
      messages: chat.messages.map((message) => ({ ...message }))
    }));
  }

  async sendMessage(conversationId: string, content: string): Promise<ChatMessage | null> {
    await delay(150);
    const chat = this.conversations.find((item) => item.id === conversationId);
    if (!chat) {
      return null;
    }
    const message: ChatMessage = {
      id: `m-${Date.now()}`,
      mine: true,
      content,
      createdAt: new Date().toISOString()
    };
    chat.messages.push(message);
    chat.lastMessage = content;
    chat.lastMessageAt = message.createdAt;
    return message;
  }

  async markAsRead(conversationId: string): Promise<void> {
    const chat = this.conversations.find((item) => item.id === conversationId);
    if (chat) {
      chat.unreadCount = 0;
    }
  }
}

export const chatService = new ChatService();
