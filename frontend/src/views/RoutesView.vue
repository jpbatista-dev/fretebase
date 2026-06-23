<template>
  <div class="routes">
    <div class="page-header">
      <h2>Routes</h2>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>Origin</th>
          <th>Destination</th>
          <th>Distance (km)</th>
          <th>Rate / km</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="route in routes" :key="route.id">
          <td>{{ route.origin }}</td>
          <td>{{ route.destination }}</td>
          <td>{{ Number(route.distance_km).toLocaleString('pt-BR') }} km</td>
          <td>{{ formatCurrency(route.rate_per_km) }}</td>
          <td>
            <span :class="['badge', route.active ? 'badge--active' : 'badge--inactive']">
              {{ route.active ? 'Active' : 'Inactive' }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { routesService } from '../services/routes.service.js';

const routes = ref([]);

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

onMounted(async () => {
  const { data } = await routesService.findAll();
  routes.value = data;
});
</script>

<style scoped>
.routes { display: flex; flex-direction: column; gap: 20px; }

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

.badge {
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.badge--active   { background: #d1fae5; color: #065f46; }
.badge--inactive { background: #fee2e2; color: #991b1b; }
</style>
