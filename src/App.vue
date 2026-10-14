<script lang="ts">
import { defineComponent } from 'vue';
import TheSideBar, { type MenuItem } from '@/shared/components/TheSideBar.vue';
import TheHeader from '@/shared/components/TheHeader.vue';
import BottomNav from '@/shared/components/BottomNav.vue';
import SuggestionsCard from '@/shared/components/SuggestionsCard.vue';
import { isAuthenticated } from '@/shared/services/token-storage';

export default defineComponent({
  name: 'App',
  components: { TheSideBar, TheHeader, BottomNav, SuggestionsCard },
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
      return [
        { label: 'Inicio', icon: 'pi pi-home', to: { name: 'home' } },
        { label: 'Explorar', icon: 'pi pi-search', to: { name: 'explore' } },
        { label: 'Mensajes', icon: 'pi pi-envelope', to: { name: 'messages' } },
        { label: 'Notificaciones', icon: 'pi pi-bell', to: { name: 'notifications' }, badge: 3 },
        { label: 'Mi perfil', icon: 'pi pi-user', to: { name: 'my-profile' } }
      ];
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
  <a href="#main-content" class="skip-link">Saltar al contenido</a>

  <div class="flex min-h-screen align-items-start">
    <TheSideBar
      v-if="showSidebar"
      :is-collapsed="isCollapsed"
      :menu-items="menuItems"
      @toggle="toggleSidebar"
      class="layout-sidebar"
    />

    <div class="flex-grow-1 flex flex-column min-w-0 min-h-screen">
      <TheHeader :is-dark="isDark" :show-actions="showSidebar" @toggle-dark="toggleDarkMode" />

      <div class="layout-body flex-grow-1 flex w-full">
        <main id="main-content" class="layout-center flex-grow-1 min-w-0 w-full">
          <router-view v-slot="{ Component }">
            <transition name="page" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </main>

        <aside v-if="showSidebar" class="layout-right flex flex-column gap-3" aria-label="Panel contextual">
          <SuggestionsCard />
          <p class="cs-muted layout-footnote">Chat Social · Red social minimalista</p>
        </aside>
      </div>

      <BottomNav v-if="showSidebar" />
    </div>
  </div>
</template>

<style>
.layout-sidebar {
  z-index: 1100;
}

.layout-body {
  justify-content: center;
  gap: 1.5rem;
  padding: 1.25rem;
  max-width: 72rem;
  margin: 0 auto;
}

.layout-center {
  max-width: 38rem;
}

.layout-right {
  width: 20rem;
  min-width: 20rem;
}

.layout-footnote {
  font-size: 0.78rem;
  text-align: center;
}

.skip-link {
  position: absolute;
  left: -9999px;
  top: 0;
  background: var(--cs-primary);
  color: #fff;
  padding: 0.6rem 1rem;
  border-radius: 0 0 8px 0;
  z-index: 2000;
}

.skip-link:focus {
  left: 0;
  text-decoration: none;
}

/* Columna derecha solo en pantallas amplias. */
@media (max-width: 1199px) {
  .layout-right {
    display: none;
  }
}

/* Móvil: sin sidebar lateral, el feed ocupa todo el ancho. */
@media (max-width: 767px) {
  .layout-sidebar {
    display: none;
  }

  .layout-body {
    padding: 0.75rem;
    padding-bottom: 0.75rem;
  }

  .layout-center {
    max-width: 100%;
  }
}
</style>
