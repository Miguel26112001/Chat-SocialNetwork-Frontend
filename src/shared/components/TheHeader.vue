<script lang="ts">
import { defineComponent } from 'vue';
import { AuthService } from '@/iam/services/auth.service';
import { isAuthenticated } from '@/shared/services/token-storage';

export default defineComponent({
  name: 'TheHeader',
  props: {
    isDark: {
      type: Boolean,
      required: true
    },
    showMenuButton: {
      type: Boolean,
      required: true
    }
  },
  emits: ['menu-click', 'toggle-dark'],
  data() {
    return {
      authService: new AuthService()
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
        await this.$router.push({ name: 'login' });
        this.$toast.add({ severity: 'success', summary: 'Sesión cerrada', life: 3000 });
      }
    }
  }
});
</script>

<template>
  <header class="flex align-items-center justify-content-between px-4 py-3 surface-card border-bottom-1 border-surface-200">
    <div class="flex align-items-center gap-3">
      <Button
        v-if="showMenuButton"
        icon="pi pi-bars"
        text
        rounded
        aria-label="Abrir menú"
        @click="$emit('menu-click')"
      />
      <span class="text-xl font-bold">Chat Social</span>
    </div>
    <div class="flex align-items-center gap-2">
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
