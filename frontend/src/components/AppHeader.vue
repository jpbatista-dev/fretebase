<template>
  <header class="header">
    <h1 class="page-title">{{ title }}</h1>
    <div class="header-meta">
      <span class="role-badge">{{ auth.user?.role }}</span>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth.store.js';

const route = useRoute();
const auth  = useAuthStore();

const titles = {
  dashboard: 'Dashboard',
  drivers:   'Drivers',
  trips:     'Trips',
  vehicles:  'Vehicles',
  routes:    'Routes',
  report:    'Reports',
};

const title = computed(() => titles[route.name] || 'FreteBase');
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
}

.page-title { font-size: 20px; font-weight: 600; color: #1a1a2e; }

.role-badge {
  background: #eff6ff;
  color: #2563eb;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}
</style>
