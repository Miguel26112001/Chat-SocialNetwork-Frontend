<script lang="ts">
import { defineComponent } from 'vue';
import { AuthService } from '@/iam/services/auth.service';
import { isAuthenticated } from '@/shared/services/token-storage';
import { useCurrentUser } from '@/shared/services/use-current-user';

export default defineComponent({
  name: 'TheHeader',
  props: {
    isDark: {
      type: Boolean,
      required: true
    },
    showActions: {
      type: Boolean,
      required: true
    }
  },
  emits: ['toggle-dark'],
  data() {
    return {
      authService: new AuthService(),
      currentUser: useCurrentUser()
    };
  },
  methods: {
    isAuthenticated(): boolean {
      return isAuthenticated();
    },
    async handleLogout(): Promise<void> {
      try {
        await this.authService.logout();
      } catch {
        // Aunque falle la revocación en el backend, se sale igual en local.
      } finally {
        this.currentUser.refresh();
        await this.$router.push({ name: 'login' });
        this.$toast.add({ severity: 'success', summary: 'Sesión cerrada', life: 3000 });
      }
    }
  }
});
</script>

<template>
  <header class="app-header" :class="{ 'app-header-public': !showActions }">
    <span class="header-brand">
      <span class="logo-mark"><i class="pi pi-comments"></i></span>
      <span class="logo-text">Chat Social</span>
    </span>
    <div v-if="showActions" class="flex align-items-center gap-1">
      <Button
        :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'"
        text
        rounded
        aria-label="Cambiar tema"
        @click="$emit('toggle-dark')"
      />
      <Button
        v-if="isAuthenticated()"
        icon="pi pi-sign-out"
        label="Salir"
        text
        @click="handleLogout"
      />
    </div>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 1.25rem;
  background: var(--cs-surface);
  border-bottom: 1px solid var(--cs-border);
  position: sticky;
  top: 0;
  z-index: 1000;
}

/* En rutas públicas (login/registro): solo la marca, centrada. */
.app-header-public {
  justify-content: center;
}

.header-brand {
  display: none;
  align-items: center;
  gap: 0.6rem;
}

.app-header-public .header-brand {
  display: flex;
}

.logo-mark {
  width: 2rem;
  height: 2rem;
  border-radius: 0.65rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--cs-primary);
  color: #fff;
}

.logo-text {
  font-weight: 700;
}

/* En móvil no hay sidebar: la marca vive en el header. */
@media (max-width: 767px) {
  .header-brand {
    display: flex;
  }
}
</style>
