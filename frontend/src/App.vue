<template>
  <div id="app">
    <template v-if="auth.isAuthenticated">
      <AppSidebar />
      <div class="main-content">
        <AppHeader />
        <main class="page-content">
          <RouterView />
        </main>
      </div>
    </template>
    <template v-else>
      <RouterView />
    </template>
  </div>
</template>

<script setup>
import { useAuthStore } from './stores/auth.store.js';
import AppSidebar from './components/AppSidebar.vue';
import AppHeader from './components/AppHeader.vue';

const auth = useAuthStore();
</script>

<style>
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background: #f4f6f9;
  color: #1a1a2e;
}

#app {
  display: flex;
  width: 100%;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.page-content {
  flex: 1;
  padding: 28px;
  overflow-y: auto;
}
</style>
