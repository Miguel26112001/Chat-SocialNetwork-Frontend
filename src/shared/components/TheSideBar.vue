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
  <aside class="sidebar" :class="{ 'sidebar-collapsed': isCollapsed }" aria-label="Navegación principal">
    <div class="sidebar-logo">
      <span class="logo-mark"><i class="pi pi-comments"></i></span>
      <span v-if="!isCollapsed" class="logo-text">Chat Social</span>
    </div>
    <nav class="sidebar-nav">
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
          :class="['sidebar-link', { 'sidebar-link-active': isActive }]"
        >
          <span class="sidebar-link-icon">
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
      class="sidebar-toggle"
      @click="$emit('toggle')"
    />
  </aside>
</template>

<style scoped>
.sidebar {
  width: 15rem;
  min-width: 15rem;
  min-height: 100vh;
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.25rem 0.75rem;
  background: var(--cs-surface);
  border-right: 1px solid var(--cs-border);
}

.sidebar-collapsed {
  width: 4.5rem;
  min-width: 4.5rem;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.25rem 0.6rem 1rem;
}

.logo-mark {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--cs-primary);
  color: #fff;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.logo-text {
  font-weight: 700;
  font-size: 1.05rem;
  white-space: nowrap;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  flex-grow: 1;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.65rem 0.75rem;
  border-radius: 0.75rem;
  color: var(--cs-text);
  font-weight: 500;
  font-size: 0.95rem;
  text-decoration: none;
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
  position: relative;
  font-size: 1.15rem;
  display: inline-flex;
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

.sidebar-toggle {
  align-self: flex-start;
}
</style>
