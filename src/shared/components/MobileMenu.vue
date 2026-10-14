<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { MenuItem } from '@/shared/components/TheSideBar.vue';

export default defineComponent({
  name: 'MobileMenu',
  props: {
    menuItems: {
      type: Array as PropType<MenuItem[]>,
      required: true
    }
  },
  emits: ['close'],
  mounted() {
    document.addEventListener('keydown', this.handleKeydown);
    document.body.style.overflow = 'hidden';
  },
  unmounted() {
    document.removeEventListener('keydown', this.handleKeydown);
    document.body.style.overflow = '';
  },
  methods: {
    handleKeydown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        this.$emit('close');
      }
    }
  }
});
</script>

<template>
  <div class="mobile-menu">
    <div class="mobile-backdrop" @click="$emit('close')" aria-hidden="true"></div>
    <nav id="mobile-menu" class="mobile-panel" aria-label="Menú principal">
      <router-link
        v-for="item in menuItems"
        :key="item.label"
        :to="item.to"
        custom
        v-slot="{ href, navigate, isActive }"
      >
        <a
          :href="href"
          @click="navigate"
          :aria-current="isActive ? 'page' : undefined"
          :class="['mobile-link', { 'mobile-link-active': isActive }]"
        >
          <i :class="item.icon"></i>
          <span>{{ item.label }}</span>
          <Badge v-if="item.badge && item.badge > 0" :value="item.badge" severity="info" class="ml-auto" />
        </a>
      </router-link>
    </nav>
  </div>
</template>

<style scoped>
/* Solo móvil: en escritorio la navegación vive en el sidebar. */
.mobile-menu,
.mobile-backdrop,
.mobile-panel {
  display: none;
}

@media (max-width: 767px) {
  .mobile-menu {
    display: block;
  }

  .mobile-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 998;
    background: rgba(15, 23, 42, 0.45);
    animation: mobile-backdrop-in 0.18s ease-out;
  }

  .mobile-panel {
    display: block;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 999;
    background: var(--cs-surface);
    border-bottom: 1px solid var(--cs-border);
    border-radius: 0 0 1rem 1rem;
    box-shadow: var(--cs-shadow-md);
    padding: 0.5rem 0.75rem 0.75rem;
    animation: mobile-panel-in 0.18s ease-out;
  }

  .mobile-link {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    padding: 0.7rem 0.75rem;
    border-radius: 0.75rem;
    color: var(--cs-text);
    font-weight: 500;
    text-decoration: none;
  }

  .mobile-link-active {
    background: var(--p-surface-100);
    color: var(--cs-primary);
    font-weight: 600;
  }

  .my-app-dark .mobile-link-active {
    background: var(--p-surface-800);
  }
}

@keyframes mobile-backdrop-in {
  from {
    opacity: 0;
  }
}

@keyframes mobile-panel-in {
  from {
    opacity: 0;
    transform: translateY(-0.75rem);
  }
}

@media (prefers-reduced-motion: reduce) {
  .mobile-backdrop,
  .mobile-panel {
    animation: none;
  }
}
</style>
