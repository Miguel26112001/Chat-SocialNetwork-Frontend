<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { RouteLocationRaw } from 'vue-router';

export interface MenuItem {
  label: string;
  icon: string;
  to: RouteLocationRaw;
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
  <aside
    class="surface-card border-right-1 border-surface-200 flex flex-column gap-1 p-3"
    :style="{ width: isCollapsed ? '4.5rem' : '16rem' }"
  >
    <Button
      :icon="isCollapsed ? 'pi pi-angle-right' : 'pi pi-angle-left'"
      text
      rounded
      aria-label="Colapsar menú"
      @click="$emit('toggle')"
    />
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
        :class="[
          'flex align-items-center gap-3 p-3 border-round-lg no-underline font-medium transition-colors',
          isActive ? 'bg-primary-100 text-primary-700' : 'text-700 hover:surface-hover'
        ]"
      >
        <i :class="[item.icon, 'text-xl']"></i>
        <span v-if="!isCollapsed">{{ item.label }}</span>
      </a>
    </router-link>
  </aside>
</template>
