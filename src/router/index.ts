import { createRouter, createWebHistory } from 'vue-router';
import FeedView from '@/content/pages/FeedView.vue';
import LoginView from '@/iam/pages/LoginView.vue';
import RegisterView from '@/iam/pages/RegisterView.vue';
import AccountSettingsView from '@/iam/pages/AccountSettingsView.vue';
import AdminView from '@/iam/pages/AdminView.vue';
import ExploreView from '@/social/pages/ExploreView.vue';
import MessagesView from '@/chat/pages/MessagesView.vue';
import NotificationsView from '@/notifications/pages/NotificationsView.vue';
import ProfileView from '@/profiles/pages/ProfileView.vue';
import { isAuthenticated } from '@/shared/services/token-storage';
import { useCurrentUser } from '@/shared/services/use-current-user';

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { public: true }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: { public: true }
  },
  {
    path: '/home',
    name: 'home',
    component: FeedView
  },
  {
    path: '/explore',
    name: 'explore',
    component: ExploreView
  },
  {
    path: '/messages',
    name: 'messages',
    component: MessagesView
  },
  {
    path: '/notifications',
    name: 'notifications',
    component: NotificationsView
  },
  {
    path: '/profile/me',
    name: 'my-profile',
    component: ProfileView
  },
  {
    path: '/profile/:username',
    name: 'profile',
    component: ProfileView,
    props: true
  },
  {
    path: '/settings',
    name: 'settings',
    component: AccountSettingsView
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminView,
    meta: { requiresAdmin: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to) => {
  const publicRoute = to.meta.public === true;
  const authenticated = isAuthenticated();

  if (!publicRoute && !authenticated) {
    return { name: 'login' };
  }
  if ((to.name === 'login' || to.name === 'register') && authenticated) {
    return { name: 'home' };
  }
  if (to.meta.requiresAdmin === true) {
    const { load } = useCurrentUser();
    const me = await load();
    if (me?.role !== 'ADMIN') {
      return { name: 'home' };
    }
  }
  return true;
});

export default router;
