import { createRouter, createWebHistory } from 'vue-router';
import FeedView from '@/content/pages/FeedView.vue';
import LoginView from '@/iam/pages/LoginView.vue';
import RegisterView from '@/iam/pages/RegisterView.vue';
import ExploreView from '@/social/pages/ExploreView.vue';
import MessagesView from '@/chat/pages/MessagesView.vue';
import NotificationsView from '@/notifications/pages/NotificationsView.vue';
import ProfileView from '@/profiles/pages/ProfileView.vue';
import { isAuthenticated } from '@/shared/services/token-storage';

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
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to) => {
  const publicRoute = to.meta.public === true;
  const authenticated = isAuthenticated();

  if (!publicRoute && !authenticated) {
    return { name: 'login' };
  }
  if ((to.name === 'login' || to.name === 'register') && authenticated) {
    return { name: 'home' };
  }
  return true;
});

export default router;
