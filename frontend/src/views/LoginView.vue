<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-logo">
        <span>🚛</span>
        <h1>FreteBase</h1>
        <p>Transportation Management System</p>
      </div>

      <form class="login-form" @submit.prevent="handleLogin">
        <div class="field">
          <label>Email</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="admin@fretebase.com"
            required
            autocomplete="email"
          />
        </div>

        <div class="field">
          <label>Password</label>
          <input
            v-model="form.password"
            type="password"
            placeholder="••••••••"
            required
            autocomplete="current-password"
          />
        </div>

        <p v-if="error" class="error-msg">{{ error }}</p>

        <button type="submit" class="login-btn" :disabled="loading">
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store.js';

const router = useRouter();
const auth   = useAuthStore();

const form    = ref({ email: '', password: '' });
const error   = ref('');
const loading = ref(false);

async function handleLogin() {
  error.value   = '';
  loading.value = true;
  try {
    await auth.login(form.value.email, form.value.password);
    router.push('/');
  } catch {
    error.value = 'Invalid email or password.';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-page {
  width: 100vw;
  min-height: 100vh;
  background: #1a1a2e;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.login-card {
  background: #fff;
  border-radius: 16px;
  padding: 48px 40px;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 20px 60px #00000060;
}

.login-logo {
  text-align: center;
  margin-bottom: 36px;
}

.login-logo span { font-size: 48px; display: block; margin-bottom: 12px; }
.login-logo h1   { font-size: 28px; font-weight: 700; color: #1a1a2e; margin-bottom: 6px; }
.login-logo p    { color: #6b7280; font-size: 14px; }

.login-form { display: flex; flex-direction: column; gap: 20px; }

.field { display: flex; flex-direction: column; gap: 8px; }

.field label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.field input {
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 15px;
  outline: none;
  transition: border-color .2s;
  width: 100%;
}

.field input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px #2563eb20; }

.error-msg {
  color: #ef4444;
  font-size: 13px;
  text-align: center;
  background: #fee2e2;
  padding: 10px;
  border-radius: 8px;
}

.login-btn {
  padding: 14px;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background .2s;
  width: 100%;
}

.login-btn:hover    { background: #1d4ed8; }
.login-btn:disabled { background: #93c5fd; cursor: not-allowed; }
</style>
