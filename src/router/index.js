import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: () => import('@/views/main/Index'),
    children: [
      {
        name: 'Home',
        path: '/',
        component: () => import('@/views/main/Home'),
      },
      {
        path: '/login',
        name: 'login',
        component: () => import('@/views/main/Login'),
      },
    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
