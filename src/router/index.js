import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/components/home.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/components/profile.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/components/register.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/components/login.vue'),
    },
    {
      path: '/logout',
      name: 'logout',
      component: () => import('@/components/logout.vue'),
    },
    {
      path: '/chat/:targetId?',
      name: 'chat',
      props: true,
      component: () => import('@/components/chat.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'Not Found',
      component: () => import('@/components/notFound.vue'),
    },
  ],
});

export default router;
