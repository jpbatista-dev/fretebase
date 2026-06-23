<template>
  <div class="drivers">
    <div class="page-header">
      <h2>Drivers</h2>
      <button class="btn btn--primary" @click="openModal()">+ New Driver</button>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>CPF</th>
          <th>CNH</th>
          <th>Category</th>
          <th>CNH Expiry</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="driver in drivers" :key="driver.id">
          <td>{{ driver.name }}</td>
          <td>{{ driver.cpf }}</td>
          <td>{{ driver.cnh }}</td>
          <td>{{ driver.cnh_category }}</td>
          <td>{{ formatDate(driver.cnh_expiry) }}</td>
          <td>
            <span :class="['badge', driver.active ? 'badge--active' : 'badge--inactive']">
              {{ driver.active ? 'Active' : 'Inactive' }}
            </span>
          </td>
          <td class="actions">
            <button class="btn btn--sm" @click="openModal(driver)">Edit</button>
            <button class="btn btn--sm btn--danger" @click="deactivate(driver.id)">Deactivate</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="modal.open" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h3>{{ modal.driver ? 'Edit Driver' : 'New Driver' }}</h3>

        <div class="form-grid">
          <div class="field">
            <label>Name</label>
            <input v-model="form.name" type="text" />
          </div>
          <div class="field">
            <label>CPF</label>
            <input v-model="form.cpf" type="text" :disabled="!!modal.driver" />
          </div>
          <div class="field">
            <label>CNH</label>
            <input v-model="form.cnh" type="text" :disabled="!!modal.driver" />
          </div>
          <div class="field">
            <label>Category</label>
            <select v-model="form.cnh_category">
              <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>
          <div class="field">
            <label>CNH Expiry</label>
            <input v-model="form.cnh_expiry" type="date" />
          </div>
          <div class="field">
            <label>Phone</label>
            <input v-model="form.phone" type="text" />
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn" @click="closeModal">Cancel</button>
          <button class="btn btn--primary" @click="save">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { driversService } from '../services/drivers.service.js';

const drivers    = ref([]);
const categories = ['A','B','C','D','E','AB','AC','AD','AE'];
const modal      = ref({ open: false, driver: null });
const form       = ref({});

function formatDate(date) {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('pt-BR');
}

async function load() {
  const { data } = await driversService.findAll();
  drivers.value = data;
}

function openModal(driver = null) {
  modal.value = { open: true, driver };
  form.value  = driver
    ? {
        name:         driver.name,
        cpf:          driver.cpf,
        cnh:          driver.cnh,
        cnh_category: driver.cnh_category,
        cnh_expiry:   driver.cnh_expiry?.slice(0, 10),
        phone:        driver.phone,
      }
    : { name: '', cpf: '', cnh: '', cnh_category: 'E', cnh_expiry: '', phone: '' };
}

function closeModal() {
  modal.value = { open: false, driver: null };
}

async function save() {
  try {
    if (modal.value.driver) {
      await driversService.update(modal.value.driver.id, form.value);
    } else {
      await driversService.create(form.value);
    }
    closeModal();
    await load();
  } catch (error) {
    alert(error.response?.data?.error || 'Error saving driver');
  }
}

async function deactivate(id) {
  if (!confirm('Deactivate this driver?')) return;
  await driversService.remove(id);
  await load();
}

onMounted(load);
</script>

<style scoped>
.drivers { display: flex; flex-direction: column; gap: 20px; }

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-header h2 { font-size: 18px; font-weight: 600; }

.table {
  width: 100%;
  background: #fff;
  border-radius: 12px;
  border-collapse: collapse;
  box-shadow: 0 1px 4px #0000000f;
  overflow: hidden;
}

.table th {
  background: #f9fafb;
  padding: 12px 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
}

.table td {
  padding: 12px 16px;
  font-size: 14px;
  border-top: 1px solid #f3f4f6;
}

.actions { display: flex; gap: 8px; }

.badge {
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.badge--active   { background: #d1fae5; color: #065f46; }
.badge--inactive { background: #fee2e2; color: #991b1b; }

.btn {
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background: #fff;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all .2s;
}

.btn:hover        { background: #f3f4f6; }
.btn--primary     { background: #2563eb; color: #fff; border-color: #2563eb; }
.btn--primary:hover { background: #1d4ed8; }
.btn--danger      { background: #fee2e2; color: #991b1b; border-color: #fca5a5; }
.btn--danger:hover { background: #fca5a5; }
.btn--sm          { padding: 5px 10px; font-size: 12px; }

.modal-overlay {
  position: fixed;
  inset: 0;
  background: #00000060;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  width: 500px;
  max-width: 95vw;
}

.modal h3 { font-size: 18px; font-weight: 600; margin-bottom: 24px; }

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.field { display: flex; flex-direction: column; gap: 6px; }

.field label { font-size: 13px; font-weight: 500; color: #374151; }

.field input,
.field select {
  padding: 9px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
}

.field input:focus,
.field select:focus { border-color: #2563eb; }

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
