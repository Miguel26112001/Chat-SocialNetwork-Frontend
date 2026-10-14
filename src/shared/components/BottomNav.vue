<script lang="ts">
import { defineComponent } from 'vue';

interface NavItem {
  label: string;
  icon: string;
  routeName: string;
}

export default defineComponent({
  name: 'BottomNav',
  data() {
    return {
      items: [
        { label: 'Inicio', icon: 'pi pi-home', routeName: 'home' },
        { label: 'Explorar', icon: 'pi pi-search', routeName: 'explore' },
        { label: 'Mensajes', icon: 'pi pi-envelope', routeName: 'messages' },
        { label: 'Perfil', icon: 'pi pi-user', routeName: 'my-profile' }
      ] as NavItem[]
    };
  },
  methods: {
    isActive(routeName: string): boolean {
      return this.$route.name === routeName;
    },
    go(routeName: string): void {
      void this.$router.push({ name: routeName });
    }
  }
});
</script>

<template>
  <nav class="bottom-nav" aria-label="Navegación principal">
    <button
      v-for="item in items"
      :key="item.routeName"
      class="bottom-nav-item"
      :class="{ 'bottom-nav-active': isActive(item.routeName) }"
      :aria-current="isActive(item.routeName) ? 'page' : undefined"
      @click="go(item.routeName)"
    >
      <i :class="item.icon"></i>
      <span>{{ item.label }}</span>
    </button>
  </nav>
</template>

<style scoped>
.bottom-nav {
  display: none;
}

@media (max-width: 767px) {
  .bottom-nav {
    display: flex;
    position: sticky;
    bottom: 0;
    z-index: 1000;
    background: var(--cs-surface);
    border-top: 1px solid var(--cs-border);
    padding: 0.4rem 0.25rem calc(0.4rem + env(safe-area-inset-bottom));
  }

  .bottom-nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.15rem;
    background: none;
    border: none;
    padding: 0.4rem 0;
    cursor: pointer;
    color: var(--cs-text-muted);
    font-size: 0.7rem;
    font-weight: 500;
  }

  .bottom-nav-item i {
    font-size: 1.25rem;
  }

  .bottom-nav-active {
    color: var(--cs-primary);
  }
}
</style>
