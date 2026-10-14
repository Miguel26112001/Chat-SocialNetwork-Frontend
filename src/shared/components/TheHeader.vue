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
    },
    menuOpen: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  emits: ['toggle-dark', 'menu-click'],
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
  <header class="app-header flex align-items-center" :class="{ 'app-header-public': !showActions }">
    <Button
      v-if="showActions"
      :icon="menuOpen ? 'pi pi-times' : 'pi pi-bars'"
      text
      rounded
      class="menu-button"
      :aria-expanded="menuOpen"
      aria-controls="mobile-menu"
      aria-label="Abrir menú"
      @click="$emit('menu-click')"
    />
    <span class="header-brand">
      <span class="logo-mark border-circle inline-flex align-items-center justify-content-center"><i class="pi pi-comments"></i></span>
      <span class="font-bold">Chat Social</span>
    </span>
    <div v-if="showActions" class="header-actions flex align-items-center ml-auto gap-1">
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
  padding: 0.6rem 1.25rem;
  background: var(--cs-surface);
  border-bottom: 1px solid var(--cs-border);
  position: sticky;
  top: 0;
  z-index: 1000;
}

/* Las acciones siempre van a la derecha, haya marca visible o no. */

/* Botón hamburguesa: solo móvil (en escritorio está el sidebar). */
.menu-button {
  display: none;
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
  background: var(--cs-primary);
  color: #fff;
}

/* En móvil no hay sidebar: marca + hamburguesa en el header. */
@media (max-width: 767px) {
  .header-brand {
    display: flex;
  }

  .menu-button {
    display: inline-flex;
  }
}
</style>
