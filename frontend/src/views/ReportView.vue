<template>
  <div class="report">
    <div class="page-header">
      <h2>Driver Report</h2>
    </div>

    <div class="filters">
      <div class="field">
        <label>Driver</label>
        <select v-model="filters.driver_id">
          <option value="">Select a driver</option>
          <option v-for="driver in drivers" :key="driver.id" :value="driver.id">
            {{ driver.name }}
          </option>
        </select>
      </div>
      <div class="field">
        <label>Month</label>
        <select v-model="filters.month">
          <option v-for="m in months" :key="m.value" :value="m.value">{{ m.label }}</option>
        </select>
      </div>
      <div class="field">
        <label>Year</label>
        <select v-model="filters.year">
          <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
        </select>
      </div>
      <button class="btn btn--primary" :disabled="!filters.driver_id" @click="generate">
        Generate Report
      </button>
    </div>

    <div v-if="report" class="report-result">
      <div class="report-header">
        <h3>{{ report.driver_name }}</h3>
        <span class="period">{{ monthLabel }} / {{ filters.year }}</span>
      </div>

      <div class="stat-cards">
        <div class="stat-card">
          <p class="stat-label">Total Trips</p>
          <p class="stat-value">{{ report.total_trips }}</p>
        </div>
        <div class="stat-card stat-card--green">
          <p class="stat-label">Completed</p>
          <p class="stat-value">{{ report.completed_trips }}</p>
        </div>
        <div class="stat-card stat-card--red">
          <p class="stat-label">Cancelled</p>
          <p class="stat-value">{{ report.cancelled_trips }}</p>
        </div>
        <div class="stat-card stat-card--blue">
          <p class="stat-label">Total KM</p>
          <p class="stat-value">{{ Number(report.total_km).toLocaleString('pt-BR') }} km</p>
        </div>
        <div class="stat-card stat-card--purple">
          <p class="stat-label">Total Freight</p>
          <p class="stat-value">{{ formatCurrency(report.total_freight) }}</p>
        </div>
        <div class="stat-card stat-card--yellow">
          <p class="stat-label">Incidents</p>
          <p class="stat-value">{{ report.total_incidents }}</p>
        </div>
      </div>
    </div>

    <div v-if="empty" class="empty-state">
      No trips found for this driver in the selected period.
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { driversService } from '../services/drivers.service.js';

const drivers = ref([]);
const report  = ref(null);
const empty   = ref(false);

const now = new Date();

const filters = ref({
  driver_id: '',
  month:     now.getMonth() + 1,
  year:      now.getFullYear(),
});

const months = [
  { value: 1,  label: 'January'   },
  { value: 2,  label: 'February'  },
  { value: 3,  label: 'March'     },
  { value: 4,  label: 'April'     },
  { value: 5,  label: 'May'       },
  { value: 6,  label: 'June'      },
  { value: 7,  label: 'July'      },
  { value: 8,  label: 'August'    },
  { value: 9,  label: 'September' },
  { value: 10, label: 'October'   },
  { value: 11, label: 'November'  },
  { value: 12, label: 'December'  },
];

const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - i);

const monthLabel = computed(
  () => months.find(m => m.value === filters.value.month)?.label
);

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value ?? 0);
}

async function generate() {
  report.value = null;
  empty.value  = false;

  const { data } = await driversService.getReport(
    filters.value.driver_id,
    filters.value.month,
    filters.value.year
  );

  if (!data || data.total_trips === '0') {
    empty.value = true;
    return;
  }

  report.value = data;
}

onMounted(async () => {
  const { data } = await driversService.findAll();
  drivers.value = data;
});
</script>

<style scoped>
.report { display: flex; flex-direction: column; gap: 24px; }

.page-header h2 { font-size: 18px; font-weight: 600; }

.filters {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 1px 4px #0000000f;
}

.field { display: flex; flex-direction: column; gap: 6px; }

.field label { font-size: 13px; font-weight: 500; color: #374151; }

.field select {
  padding: 9px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  min-width: 160px;
}

.field select:focus { border-color: #2563eb; }

.btn {
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all .2s;
}

.btn--primary       { background: #2563eb; color: #fff; }
.btn--primary:hover { background: #1d4ed8; }
.btn:disabled       { background: #93c5fd; cursor: not-allowed; }

.report-result {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.report-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.report-header h3 { font-size: 20px; font-weight: 700; color: #1a1a2e; }

.period {
  background: #eff6ff;
  color: #2563eb;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}

.stat-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
}

.stat-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 4px #0000000f;
  border-left: 4px solid #e5e7eb;
}

.stat-card--green  { border-color: #10b981; }
.stat-card--red    { border-color: #ef4444; }
.stat-card--blue   { border-color: #2563eb; }
.stat-card--purple { border-color: #8b5cf6; }
.stat-card--yellow { border-color: #f59e0b; }

.stat-label { font-size: 12px; color: #6b7280; margin-bottom: 8px; }
.stat-value { font-size: 22px; font-weight: 700; color: #1a1a2e; }

.empty-state {
  text-align: center;
  padding: 48px;
  background: #fff;
  border-radius: 12px;
  color: #6b7280;
  font-size: 15px;
}
</style>
