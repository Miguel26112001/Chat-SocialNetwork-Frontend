<script lang="ts">
import { defineComponent } from 'vue';
import TheSideBar, { type MenuItem } from '@/shared/components/TheSideBar.vue';
import TheHeader from '@/shared/components/TheHeader.vue';
import MobileMenu from '@/shared/components/MobileMenu.vue';
import SuggestionsCard from '@/shared/components/SuggestionsCard.vue';
import { isAuthenticated } from '@/shared/services/token-storage';
import { useCurrentUser } from '@/shared/services/use-current-user';
import type { User } from '@/iam/model/user.entity';

export default defineComponent({
  name: 'App',
  components: { TheSideBar, TheHeader, MobileMenu, SuggestionsCard },
  data() {
    return {
      isCollapsed: false,
      isDark: false,
      mobileMenuOpen: false,
      me: null as User | null
    };
  },
  computed: {
    isPublicRoute(): boolean {
      return this.$route.meta.public === true;
    },
    showSidebar(): boolean {
      return !this.isPublicRoute && isAuthenticated();
    },
    isAdmin(): boolean {
      return this.me?.role === 'ADMIN';
    },
    menuItems(): MenuItem[] {
      const items: MenuItem[] = [
        { label: 'Inicio', icon: 'pi pi-home', to: { name: 'home' } },
        { label: 'Explorar', icon: 'pi pi-search', to: { name: 'explore' } },
        { label: 'Mensajes', icon: 'pi pi-envelope', to: { name: 'messages' } },
        { label: 'Notificaciones', icon: 'pi pi-bell', to: { name: 'notifications' }, badge: 3 },
        { label: 'Mi perfil', icon: 'pi pi-user', to: { name: 'my-profile' } },
        { label: 'Ajustes', icon: 'pi pi-cog', to: { name: 'settings' } }
      ];
      if (this.isAdmin) {
        items.push({ label: 'Admin', icon: 'pi pi-shield', to: { name: 'admin' } });
      }
      return items;
    }
  },
  methods: {
    toggleSidebar(): void {
      this.isCollapsed = !this.isCollapsed;
    },
    toggleMobileMenu(): void {
      this.mobileMenuOpen = !this.mobileMenuOpen;
    },
    closeMobileMenu(): void {
      this.mobileMenuOpen = false;
    },
    toggleDarkMode(): void {
      this.isDark = !this.isDark;
      document.querySelector('html')?.classList.toggle('my-app-dark', this.isDark);
      localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
    },
    async refreshMe(): Promise<void> {
      if (isAuthenticated()) {
        const { load } = useCurrentUser();
        this.me = await load();
      } else {
        this.me = null;
      }
    }
  },
  mounted() {
    if (localStorage.getItem('theme') === 'dark') {
      this.isDark = true;
      document.querySelector('html')?.classList.add('my-app-dark');
    }
    void this.refreshMe();
  },
  watch: {
    '$route'() {
      this.closeMobileMenu();
      void this.refreshMe();
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
      <div class="mobile-top">
        <TheHeader
          :is-dark="isDark"
          :show-actions="showSidebar"
          :menu-open="mobileMenuOpen"
          @toggle-dark="toggleDarkMode"
          @menu-click="toggleMobileMenu"
        />
        <MobileMenu v-if="showSidebar && mobileMenuOpen" :menu-items="menuItems" @close="closeMobileMenu" />
      </div>

      <div class="layout-body flex-grow-1 flex w-full">
        <main id="main-content" class="layout-center flex-grow-1 min-w-0 w-full">
          <router-view v-slot="{ Component }">
            <transition name="page" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </main>

        <aside v-if="showSidebar" class="layout-right hidden xl:flex flex-column gap-3" aria-label="Panel contextual">
          <SuggestionsCard />
          <p class="cs-muted layout-footnote">Chat Social · Red social minimalista</p>
        </aside>
      </div>
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

/* En móvil, el header + menú forman un bloque fijo del que cuelga el panel. */
@media (max-width: 767px) {
  .mobile-top {
    position: sticky;
    top: 0;
    z-index: 1000;
  }
}

/* Móvil: el feed ocupa todo el ancho. */
@media (max-width: 767px) {
  .layout-body {
    padding: 0.75rem;
    padding-bottom: 0.75rem;
  }

  .layout-center {
    max-width: 100%;
  }
}
</style>
