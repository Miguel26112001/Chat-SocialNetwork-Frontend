<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { RouteLocationRaw } from 'vue-router';

export interface MenuItem {
  label: string;
  icon: string;
  to: RouteLocationRaw;
  badge?: number;
}

export default defineComponent({
  name: 'TheSideBar',
  props: {
    isCollapsed: {
      type: Boolean,
      required: true
    },
    menuItems: {
      type: Array as PropType<MenuItem[]>,
      required: true
    }
  },
  emits: ['toggle']
});
</script>

<template>
  <aside class="sidebar hidden md:flex flex-column gap-2" :class="{ 'sidebar-collapsed': isCollapsed }" aria-label="Navegación principal">
    <div class="sidebar-logo flex align-items-center">
      <span class="logo-mark border-circle inline-flex align-items-center justify-content-center"><i class="pi pi-comments"></i></span>
      <span v-if="!isCollapsed" class="logo-text font-bold white-space-nowrap">Chat Social</span>
    </div>
    <nav class="sidebar-nav flex flex-column flex-grow-1">
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
          :title="item.label"
          :aria-current="isActive ? 'page' : undefined"
          :class="['sidebar-link flex align-items-center no-underline', { 'sidebar-link-active': isActive }]"
        >
          <span class="sidebar-link-icon relative inline-flex">
            <i :class="item.icon"></i>
            <Badge v-if="item.badge && item.badge > 0" :value="item.badge" severity="info" />
          </span>
          <span v-if="!isCollapsed">{{ item.label }}</span>
        </a>
      </router-link>
    </nav>
    <Button
      :icon="isCollapsed ? 'pi pi-angle-right' : 'pi pi-angle-left'"
      text
      rounded
      aria-label="Colapsar menú"
      class="align-self-start"
      @click="$emit('toggle')"
    />
  </aside>
</template>

<style scoped>
.sidebar {
  width: 15rem;
  min-width: 15rem;
  height: 100vh;
  overflow-y: auto;
  position: sticky;
  top: 0;
  padding: 1.25rem 0.75rem;
  background: var(--cs-surface);
  border-right: 1px solid var(--cs-border);
}

.sidebar-collapsed {
  width: 4.5rem;
  min-width: 4.5rem;
}

.sidebar-logo {
  gap: 0.65rem;
  padding: 0.25rem 0.6rem 1rem;
}

.logo-mark {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.75rem;
  background: var(--cs-primary);
  color: #fff;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.logo-text {
  font-size: 1.05rem;
}

.sidebar-nav {
  gap: 0.15rem;
}

.sidebar-link {
  gap: 0.8rem;
  padding: 0.65rem 0.75rem;
  border-radius: 0.75rem;
  color: var(--cs-text);
  font-weight: 500;
  font-size: 0.95rem;
}

.sidebar-link:hover {
  background: var(--p-surface-100);
  text-decoration: none;
}

.my-app-dark .sidebar-link:hover {
  background: var(--p-surface-800);
}

.sidebar-link-active {
  background: var(--p-surface-100);
  color: var(--cs-primary);
  font-weight: 600;
}

.my-app-dark .sidebar-link-active {
  background: var(--p-surface-800);
}

.sidebar-link-icon {
  font-size: 1.15rem;
}

.sidebar-link-icon :deep(.p-badge) {
  position: absolute;
  top: -0.5rem;
  right: -0.7rem;
  font-size: 0.65rem;
  min-width: 1.1rem;
  height: 1.1rem;
  line-height: 1.1rem;
}
</style>
