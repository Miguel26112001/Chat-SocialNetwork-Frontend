<script lang="ts">
import { defineComponent } from 'vue';
import TheSideBar, { type MenuItem } from '@/shared/components/TheSideBar.vue';
import TheHeader from '@/shared/components/TheHeader.vue';
import { isAuthenticated } from '@/shared/services/token-storage';

export default defineComponent({
  name: 'App',
  components: { TheSideBar, TheHeader },
  data() {
    return {
      isCollapsed: false,
      isDark: false
    };
  },
  computed: {
    isPublicRoute(): boolean {
      return this.$route.meta.public === true;
    },
    showSidebar(): boolean {
      return !this.isPublicRoute && isAuthenticated();
    },
    menuItems(): MenuItem[] {
      return [{ label: 'Inicio', icon: 'pi pi-home', to: { name: 'home' } }];
    }
  },
  methods: {
    toggleSidebar(): void {
      this.isCollapsed = !this.isCollapsed;
    },
    toggleDarkMode(): void {
      this.isDark = !this.isDark;
      document.querySelector('html')?.classList.toggle('my-app-dark', this.isDark);
      localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
    }
  },
  mounted() {
    if (localStorage.getItem('theme') === 'dark') {
      this.isDark = true;
      document.querySelector('html')?.classList.add('my-app-dark');
    }
  }
});
</script>

<template>
  <Toast />
  <ConfirmDialog />

  <div class="layout-wrapper flex min-h-screen">
    <TheSideBar
      v-if="showSidebar"
      :is-collapsed="isCollapsed"
      :menu-items="menuItems"
      @toggle="toggleSidebar"
      class="layout-sidebar"
    />

    <div class="flex-grow-1 flex flex-column overflow-x-hidden">
      <TheHeader
        :is-dark="isDark"
        :show-menu-button="showSidebar"
        @menu-click="toggleSidebar"
        @toggle-dark="toggleDarkMode"
      />

      <div class="p-3 md:p-4 lg:p-5 flex-grow-1 overflow-y-auto">
        <div
          class="surface-card border-round-xl shadow-sm p-4 md:p-6 min-h-full border-1 border-surface-200"
        >
          <router-view v-slot="{ Component }">
            <transition name="page" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.layout-sidebar {
  z-index: 1100;
}
</style>
