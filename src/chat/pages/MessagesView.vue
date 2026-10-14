<script lang="ts">
import { defineComponent } from 'vue';
import AppAvatar from '@/shared/components/AppAvatar.vue';
import EmptyState from '@/shared/components/EmptyState.vue';
import LoadingList from '@/shared/components/LoadingList.vue';
import { chatService } from '@/chat/services/chat.service';
import type { Conversation } from '@/chat/model/conversation.entity';
import { timeAgo } from '@/shared/services/time-ago';

export default defineComponent({
  name: 'MessagesView',
  components: { AppAvatar, EmptyState, LoadingList },
  data() {
    return {
      conversations: [] as Conversation[],
      activeId: null as string | null,
      loading: false,
      draft: ''
    };
  },
  computed: {
    activeChat(): Conversation | null {
      return this.conversations.find((chat) => chat.id === this.activeId) ?? null;
    },
    showList(): boolean {
      // En móvil se muestra la lista o el chat, nunca ambos.
      // En escritorio siempre se ven lado a lado (CSS).
      return this.activeId === null;
    }
  },
  methods: {
    formatTime(iso: string): string {
      return timeAgo(iso);
    },
    formatHour(iso: string): string {
      return new Date(iso).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
    },
    async fetchConversations(): Promise<void> {
      this.loading = true;
      try {
        this.conversations = await chatService.getConversations();
        // En móvil se arranca en la lista; en escritorio, con el primer chat abierto.
        const isDesktop = window.matchMedia('(min-width: 768px)').matches;
        if (isDesktop && !this.activeId && this.conversations.length > 0) {
          this.activeId = this.conversations[0]!.id;
        }
      } finally {
        this.loading = false;
      }
    },
    selectChat(id: string): void {
      this.activeId = id;
      void chatService.markAsRead(id);
      const chat = this.conversations.find((item) => item.id === id);
      if (chat) {
        chat.unreadCount = 0;
      }
    },
    backToList(): void {
      this.activeId = null;
    },
    async sendMessage(): Promise<void> {
      const content = this.draft.trim();
      if (!content || !this.activeId) {
        return;
      }
      const message = await chatService.sendMessage(this.activeId, content);
      if (message) {
        this.draft = '';
        this.scrollToBottom();
      }
    },
    scrollToBottom(): void {
      this.$nextTick(() => {
        const thread = this.$refs.thread as HTMLElement | undefined;
        if (thread) {
          thread.scrollTop = thread.scrollHeight;
        }
      });
    }
  },
  mounted() {
    void this.fetchConversations();
  }
});
</script>

<template>
  <div class="flex flex-column gap-3 messages-page">
    <div>
      <h1 class="text-2xl font-bold m-0">Mensajes</h1>
      <p class="cs-muted m-0 mt-1">Tus conversaciones.</p>
    </div>

    <LoadingList v-if="loading" :rows="3" />

    <EmptyState
      v-else-if="conversations.length === 0"
      icon="pi pi-envelope"
      title="Sin conversaciones"
      text="Cuando inicies un chat con alguien, aparecerá aquí."
    />

    <div v-else class="cs-card messages-layout flex">
      <!-- Lista de conversaciones -->
      <div class="chat-list overflow-y-auto md:block" :class="{ 'hidden': !showList }">
        <button
          v-for="chat in conversations"
          :key="chat.id"
          class="chat-item flex align-items-center w-full cursor-pointer text-left"
          :class="{ 'chat-item-active': chat.id === activeId }"
          @click="selectChat(chat.id)"
        >
          <AppAvatar :name="chat.displayName" size="normal" />
          <span class="min-w-0 flex-grow-1 text-left">
            <span class="chat-item-top flex justify-content-between align-items-baseline gap-2">
              <span class="font-semibold">{{ chat.displayName }}</span>
              <span class="cs-muted text-sm">{{ formatTime(chat.lastMessageAt) }}</span>
            </span>
            <span class="cs-muted chat-preview block white-space-nowrap overflow-hidden text-overflow-ellipsis">{{ chat.lastMessage }}</span>
          </span>
          <Badge v-if="chat.unreadCount > 0" :value="chat.unreadCount" severity="info" />
        </button>
      </div>

      <!-- Hilo activo -->
      <div v-if="activeChat" class="chat-thread flex-grow-1 flex-column min-w-0 md:flex" :class="showList ? 'hidden' : 'flex'">
        <div class="thread-header flex align-items-center">
          <Button
            icon="pi pi-arrow-left"
            text
            rounded
            class="thread-back"
            aria-label="Volver a conversaciones"
            @click="backToList"
          />
          <AppAvatar :name="activeChat.displayName" size="small" />
          <span class="font-semibold">{{ activeChat.displayName }}</span>
          <span class="cs-muted text-sm">@{{ activeChat.username }}</span>
        </div>

        <div ref="thread" class="thread-messages flex-grow-1 overflow-y-auto flex flex-column gap-2">
          <div
            v-for="message in activeChat.messages"
            :key="message.id"
            class="message-row flex"
            :class="{ 'message-mine justify-content-end': message.mine }"
          >
            <div class="message-bubble">
              <p class="message-text m-0">{{ message.content }}</p>
              <span class="message-hour block text-right">{{ formatHour(message.createdAt) }}</span>
            </div>
          </div>
        </div>

        <form @submit.prevent="sendMessage" class="thread-input flex gap-2">
          <InputText
            v-model="draft"
            placeholder="Escribe un mensaje..."
            class="flex-grow-1"
            aria-label="Escribe un mensaje"
          />
          <Button icon="pi pi-send" rounded :disabled="!draft.trim()" aria-label="Enviar mensaje" type="submit" />
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.messages-layout {
  min-height: 32rem;
  max-height: calc(100vh - 14rem);
  overflow: hidden;
}

.chat-list {
  width: 20rem;
  min-width: 20rem;
  border-right: 1px solid var(--cs-border);
}

.chat-item {
  gap: 0.75rem;
  padding: 0.9rem 1rem;
  background: none;
  border: none;
  border-bottom: 1px solid var(--cs-border);
  color: inherit;
  font: inherit;
}

.chat-item:hover {
  background: var(--p-surface-100);
}

.my-app-dark .chat-item:hover {
  background: var(--p-surface-800);
}

.chat-item-active {
  background: var(--p-surface-100);
}

.my-app-dark .chat-item-active {
  background: var(--p-surface-800);
}

.chat-preview {
  font-size: 0.85rem;
}

.thread-back {
  display: none;
}

.thread-header {
  gap: 0.6rem;
  padding: 0.9rem 1rem;
  border-bottom: 1px solid var(--cs-border);
}

.thread-messages {
  padding: 1rem;
}

.message-mine {
  justify-content: flex-end;
}

.message-bubble {
  max-width: 75%;
  background: var(--p-surface-100);
  border-radius: 4px 14px 14px 14px;
  padding: 0.6rem 0.9rem;
}

.message-mine .message-bubble {
  background: var(--cs-primary);
  border-radius: 14px 4px 14px 14px;
}

.message-mine .message-text,
.message-mine .message-hour {
  color: #fff;
}

.my-app-dark .message-row:not(.message-mine) .message-bubble {
  background: var(--p-surface-800);
}

.message-text {
  font-size: 0.92rem;
  line-height: 1.5;
  overflow-wrap: anywhere;
}

.message-hour {
  font-size: 0.72rem;
  color: var(--cs-text-muted);
  margin-top: 0.2rem;
}

.thread-input {
  padding: 0.9rem 1rem;
  border-top: 1px solid var(--cs-border);
}

/* Móvil: lista o hilo, nunca ambos (clases hidden/md de PrimeFlex). */
@media (max-width: 767px) {
  .messages-layout {
    max-height: calc(100vh - 16rem);
  }

  .chat-list {
    width: 100%;
    min-width: 0;
    border-right: none;
  }

  .chat-thread {
    width: 100%;
  }

  .thread-back {
    display: inline-flex;
  }
}
</style>
