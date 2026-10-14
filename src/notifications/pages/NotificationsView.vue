<script lang="ts">
import { defineComponent } from 'vue';
import AppAvatar from '@/shared/components/AppAvatar.vue';
import EmptyState from '@/shared/components/EmptyState.vue';
import { MOCK_NOTIFICATIONS } from '@/notifications/mock/notifications.mock';
import type { NotificationItem } from '@/notifications/model/notification.entity';
import { timeAgo } from '@/shared/services/time-ago';

const TYPE_ICON: Record<NotificationItem['type'], string> = {
  NEW_FOLLOW: 'pi pi-user-plus',
  POST_LIKE: 'pi pi-heart-fill',
  POST_COMMENT: 'pi pi-comment',
  COMMENT_REPLY: 'pi pi-reply'
};

export default defineComponent({
  name: 'NotificationsView',
  components: { AppAvatar, EmptyState },
  data() {
    return {
      notifications: MOCK_NOTIFICATIONS.map((item) => ({ ...item }))
    };
  },
  computed: {
    unreadCount(): number {
      return this.notifications.filter((item) => !item.read).length;
    }
  },
  methods: {
    formatTime(iso: string): string {
      return timeAgo(iso);
    },
    iconFor(type: NotificationItem['type']): string {
      return TYPE_ICON[type];
    },
    markAllAsRead(): void {
      this.notifications.forEach((item) => {
        item.read = true;
      });
    }
  }
});
</script>

<template>
  <div class="flex flex-column gap-3">
    <div class="flex align-items-center justify-content-between gap-2">
      <div>
        <h1 class="text-2xl font-bold m-0">Notificaciones</h1>
        <p class="cs-muted m-0 mt-1">
          {{ unreadCount === 0 ? 'Estás al día.' : `Tienes ${unreadCount} sin leer.` }}
        </p>
      </div>
      <Button
        v-if="unreadCount > 0"
        label="Marcar leídas"
        text
        size="small"
        icon="pi pi-check-double"
        @click="markAllAsRead"
      />
    </div>

    <EmptyState
      v-if="notifications.length === 0"
      icon="pi pi-bell"
      title="Sin notificaciones"
      text="Cuando alguien interactúe contigo, lo verás aquí."
    />

    <div v-else class="cs-card notifications-list">
      <div
        v-for="item in notifications"
        :key="item.id"
        class="notification-row flex align-items-center gap-3 py-3"
        :class="{ 'notification-unread': !item.read }"
      >
        <span class="notification-icon border-circle inline-flex align-items-center justify-content-center"><i :class="iconFor(item.type)"></i></span>
        <AppAvatar :name="item.actorName" size="small" />
        <p class="notification-text m-0 flex-grow-1">
          <strong>{{ item.actorName }}</strong> {{ item.text }}
          <span class="cs-muted"> · {{ formatTime(item.createdAt) }}</span>
        </p>
        <span v-if="!item.read" class="unread-dot border-circle flex-shrink-0" aria-label="Sin leer"></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.notifications-list {
  padding: 0.5rem 1.25rem;
}

.notification-row {
  padding: 0.9rem 0;
}

.notification-row + .notification-row {
  border-top: 1px solid var(--cs-border);
}

.notification-unread {
  font-weight: 500;
}

.notification-icon {
  width: 2rem;
  height: 2rem;
  background: var(--p-surface-100);
  color: var(--cs-primary);
  font-size: 0.9rem;
}

.my-app-dark .notification-icon {
  background: var(--p-surface-800);
}

.notification-text {
  font-size: 0.9rem;
}

.unread-dot {
  width: 0.6rem;
  height: 0.6rem;
  background: var(--cs-primary);
}
</style>
