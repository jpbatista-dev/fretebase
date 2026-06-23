<template>
  <div class="vehicles">
    <div class="page-header">
      <h2>Vehicles</h2>
      <button class="btn btn--primary" @click="openModal()">+ New Vehicle</button>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>Plate</th>
          <th>Type</th>
          <th>Brand / Model</th>
          <th>Year</th>
          <th>Capacity (kg)</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="vehicle in vehicles" :key="vehicle.id">
          <td><strong>{{ vehicle.plate }}</strong></td>
          <td>{{ vehicle.type }}</td>
          <td>{{ vehicle.brand }} {{ vehicle.model }}</td>
          <td>{{ vehicle.year }}</td>
          <td>{{ Number(vehicle.capacity_kg).toLocaleString('pt-BR') }}</td>
          <td>
            <span :class="['badge', vehicle.active ? 'badge--active' : 'badge--inactive']">
              {{ vehicle.active ? 'Active' : 'Inactive' }}
            </span>
          </td>
          <td class="actions">
            <button class="btn btn--sm" @click="openModal(vehicle)">Edit</button>
            <button class="btn btn--sm btn--danger" @click="deactivate(vehicle.id)">Deactivate</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="modal.open" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h3>{{ modal.vehicle ? 'Edit Vehicle' : 'New Vehicle' }}</h3>

        <div class="form-grid">
          <div class="field">
            <label>Plate</label>
            <input v-model="form.plate" type="text" :disabled="!!modal.vehicle" />
          </div>
          <div class="field">
            <label>Type</label>
            <select v-model="form.type">
              <option value="truck">Truck</option>
              <option value="semi_truck">Semi Truck</option>
              <option value="van">Van</option>
              <option value="pickup">Pickup</option>
            </select>
          </div>
          <div class="field">
            <label>Brand</label>
            <input v-model="form.brand" type="text" />
          </div>
          <div class="field">
            <label>Model</label>
            <input v-model="form.model" type="text" />
          </div>
          <div class="field">
            <label>Year</label>
            <input v-model="form.year" type="number" min="2000" max="2030" />
          </div>
          <div class="field">
            <label>Capacity (kg)</label>
            <input v-model="form.capacity_kg" type="number" min="0" />
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
import { vehiclesService } from '../services/vehicles.service.js';

const vehicles = ref([]);
const modal    = ref({ open: false, vehicle: null });
const form     = ref({});

async function load() {
  const { data } = await vehiclesService.findAll();
  vehicles.value = data;
}

function openModal(vehicle = null) {
  modal.value = { open: true, vehicle };
  form.value  = vehicle
    ? { plate: vehicle.plate, type: vehicle.type, brand: vehicle.brand, model: vehicle.model, year: vehicle.year, capacity_kg: vehicle.capacity_kg }
    : { plate: '', type: 'truck', brand: '', model: '', year: new Date().getFullYear(), capacity_kg: '' };
}

function closeModal() {
  modal.value = { open: false, vehicle: null };
}

async function save() {
  try {
    if (modal.value.vehicle) {
      await vehiclesService.update(modal.value.vehicle.id, form.value);
    } else {
      await vehiclesService.create(form.value);
    }
    closeModal();
    await load();
  } catch (error) {
    alert(error.response?.data?.error || 'Error saving vehicle');
  }
}

async function deactivate(id) {
  if (!confirm('Deactivate this vehicle?')) return;
  await vehiclesService.remove(id);
  await load();
}

onMounted(load);
</script>

<style scoped>
.vehicles { display: flex; flex-direction: column; gap: 20px; }

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

.btn:hover          { background: #f3f4f6; }
.btn--primary       { background: #2563eb; color: #fff; border-color: #2563eb; }
.btn--primary:hover { background: #1d4ed8; }
.btn--danger        { background: #fee2e2; color: #991b1b; border-color: #fca5a5; }
.btn--danger:hover  { background: #fca5a5; }
.btn--sm            { padding: 5px 10px; font-size: 12px; }

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
