import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth.store.js';

const routes = [
  { path: '/login',    name: 'login',    component: () => import('../views/LoginView.vue'),    meta: { public: true } },
  { path: '/',         name: 'dashboard',component: () => import('../views/DashboardView.vue') },
  { path: '/trips',    name: 'trips',    component: () => import('../views/TripsView.vue') },
  { path: '/drivers',  name: 'drivers',  component: () => import('../views/DriversView.vue') },
  { path: '/vehicles', name: 'vehicles', component: () => import('../views/VehiclesView.vue') },
  { path: '/routes',   name: 'routes',   component: () => import('../views/RoutesView.vue') },
  { path: '/report',   name: 'report',   component: () => import('../views/ReportView.vue') },
  { path: '/:pathMatch(.*)*', redirect: '/' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  if (!to.meta.public && !auth.isAuthenticated) return { name: 'login' };
  if (to.name === 'login' && auth.isAuthenticated) return { name: 'dashboard' };
});

export default router;
