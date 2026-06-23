<template>
  <div class="trips">
    <div class="page-header">
      <h2>Trips</h2>
      <div class="filters">
        <select v-model="filter" @change="load">
          <option value="">All</option>
          <option value="scheduled">Scheduled</option>
          <option value="in_transit">In Transit</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>Driver</th>
          <th>Route</th>
          <th>Vehicle</th>
          <th>Departure</th>
          <th>Weight (kg)</th>
          <th>Freight Value</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="trip in trips" :key="trip.id">
          <td>{{ trip.driver_name }}</td>
          <td>{{ trip.origin }} → {{ trip.destination }}</td>
          <td>{{ trip.vehicle_plate }}</td>
          <td>{{ formatDate(trip.departure_at) }}</td>
          <td>{{ trip.cargo_weight_kg }}</td>
          <td>{{ formatCurrency(trip.freight_value) }}</td>
          <td><span :class="['badge', `badge--${trip.status}`]">{{ trip.status }}</span></td>
          <td>
            <select
              v-if="trip.status === 'scheduled' || trip.status === 'in_transit'"
              @change="updateStatus(trip.id, $event.target.value)"
            >
              <option value="">Change status</option>
              <option v-if="trip.status === 'scheduled'" value="in_transit">Start</option>
              <option v-if="trip.status === 'in_transit'" value="completed">Complete</option>
              <option value="cancelled">Cancel</option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { tripsService } from '../services/trips.service.js';

const trips  = ref([]);
const filter = ref('');

function formatDate(date) {
  return new Date(date).toLocaleDateString('pt-BR');
}

function formatCurrency(value) {
  if (!value) return '—';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

async function load() {
  const params = filter.value ? { status: filter.value } : {};
  const { data } = await tripsService.findAll(params);
  trips.value = data;
}

async function updateStatus(id, status) {
  if (!status) return;
  try {
    await tripsService.updateStatus(id, { status });
    await load();
  } catch (error) {
    alert(error.response?.data?.error || 'Error updating status');
  }
}

onMounted(load);
</script>

<style scoped>
.trips { display: flex; flex-direction: column; gap: 20px; }

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-header h2 { font-size: 18px; font-weight: 600; }

.filters select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
}

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

.table td select {
  padding: 5px 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 12px;
  outline: none;
}

.badge {
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.badge--completed  { background: #d1fae5; color: #065f46; }
.badge--in_transit { background: #fef3c7; color: #92400e; }
.badge--scheduled  { background: #dbeafe; color: #1e40af; }
.badge--cancelled  { background: #fee2e2; color: #991b1b; }
</style>
