import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/iam/pages/HomeView.vue';
import LoginView from '@/iam/pages/LoginView.vue';
import RegisterView from '@/iam/pages/RegisterView.vue';
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
    component: HomeView
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
