<template>
  <aside class="sidebar">
    <div class="sidebar-logo">
      <span class="logo-icon">🚛</span>
      <span class="logo-text">FreteBase</span>
    </div>

    <nav class="sidebar-nav">
      <RouterLink to="/"         class="nav-item" active-class="nav-item--active" exact>
        <span class="nav-icon">📊</span><span>Dashboard</span>
      </RouterLink>
      <RouterLink to="/trips"    class="nav-item" active-class="nav-item--active">
        <span class="nav-icon">🗺️</span><span>Trips</span>
      </RouterLink>
      <RouterLink to="/drivers"  class="nav-item" active-class="nav-item--active">
        <span class="nav-icon">👤</span><span>Drivers</span>
      </RouterLink>
      <RouterLink to="/vehicles" class="nav-item" active-class="nav-item--active">
        <span class="nav-icon">🚚</span><span>Vehicles</span>
      </RouterLink>
      <RouterLink to="/routes"   class="nav-item" active-class="nav-item--active">
        <span class="nav-icon">📍</span><span>Routes</span>
      </RouterLink>
      <RouterLink to="/report"   class="nav-item" active-class="nav-item--active">
        <span class="nav-icon">📈</span><span>Reports</span>
      </RouterLink>
    </nav>

    <div class="sidebar-footer">
      <span class="user-name">{{ auth.user?.name }}</span>
      <button class="logout-btn" @click="handleLogout">Logout</button>
    </div>
  </aside>
</template>

<script setup>
import { useAuthStore } from '../stores/auth.store.js';
import { useRouter } from 'vue-router';

const auth   = useAuthStore();
const router = useRouter();

function handleLogout() {
  auth.logout();
  router.push('/login');
}
</script>

<style scoped>
.sidebar {
  width: 220px;
  min-height: 100vh;
  background: #1a1a2e;
  display: flex;
  flex-direction: column;
  padding: 24px 0;
  flex-shrink: 0;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 20px 32px;
  border-bottom: 1px solid #ffffff18;
}

.logo-icon { font-size: 24px; }
.logo-text  { color: #fff; font-size: 18px; font-weight: 700; }

.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 24px 12px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  color: #9ca3c8;
  text-decoration: none;
  font-size: 14px;
  transition: all .2s;
}

.nav-item:hover    { background: #ffffff12; color: #fff; }
.nav-item--active  { background: #2563eb;   color: #fff; }
.nav-icon { font-size: 16px; }

.sidebar-footer {
  padding: 16px 20px;
  border-top: 1px solid #ffffff18;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.user-name  { color: #9ca3c8; font-size: 12px; }

.logout-btn {
  background: transparent;
  border: 1px solid #ffffff30;
  color: #9ca3c8;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: all .2s;
}

.logout-btn:hover { background: #ef4444; border-color: #ef4444; color: #fff; }
</style>
