<template>
  <div class="dashboard">
    <div class="cards">
      <div class="card card--blue">
        <span class="card-icon">🗺️</span>
        <div>
          <p class="card-label">Scheduled</p>
          <p class="card-value">{{ stats?.scheduled ?? '—' }}</p>
        </div>
      </div>
      <div class="card card--yellow">
        <span class="card-icon">🚛</span>
        <div>
          <p class="card-label">In Transit</p>
          <p class="card-value">{{ stats?.in_transit ?? '—' }}</p>
        </div>
      </div>
      <div class="card card--green">
        <span class="card-icon">✅</span>
        <div>
          <p class="card-label">Completed (month)</p>
          <p class="card-value">{{ stats?.completed_this_month ?? '—' }}</p>
        </div>
      </div>
      <div class="card card--purple">
        <span class="card-icon">💰</span>
        <div>
          <p class="card-label">Revenue (month)</p>
          <p class="card-value">{{ formatCurrency(stats?.revenue_this_month) }}</p>
        </div>
      </div>
    </div>

    <div class="recent-trips">
      <h2>Recent Trips</h2>
      <table class="table">
        <thead>
          <tr>
            <th>Driver</th>
            <th>Route</th>
            <th>Departure</th>
            <th>Status</th>
            <th>Freight Value</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="trip in recentTrips" :key="trip.id">
            <td>{{ trip.driver_name }}</td>
            <td>{{ trip.origin }} → {{ trip.destination }}</td>
            <td>{{ formatDate(trip.departure_at) }}</td>
            <td><span :class="['badge', `badge--${trip.status}`]">{{ trip.status }}</span></td>
            <td>{{ formatCurrency(trip.freight_value) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { tripsService } from '../services/trips.service.js';

const stats       = ref(null);
const recentTrips = ref([]);

function formatCurrency(value) {
  if (!value) return 'R$ —';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('pt-BR');
}

onMounted(async () => {
  const [dashRes, tripsRes] = await Promise.all([
    tripsService.getDashboard(),
    tripsService.findAll({ status: 'completed' }),
  ]);
  stats.value       = dashRes.data;
  recentTrips.value = tripsRes.data.slice(0, 10);
});
</script>

<style scoped>
.dashboard { display: flex; flex-direction: column; gap: 24px; }

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 1px 4px #0000000f;
  border-left: 4px solid transparent;
}

.card--blue   { border-color: #2563eb; }
.card--yellow { border-color: #f59e0b; }
.card--green  { border-color: #10b981; }
.card--purple { border-color: #8b5cf6; }

.card-icon  { font-size: 28px; }
.card-label { font-size: 12px; color: #6b7280; margin-bottom: 4px; }
.card-value { font-size: 24px; font-weight: 700; color: #1a1a2e; }

.recent-trips h2 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #1a1a2e;
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
