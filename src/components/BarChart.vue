<script setup>
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const props = defineProps({
  labels: Array, // T1 -> T12
  values: Array, // số lượt mượn ứng với từng tháng
});

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: 'Lượt mượn',
      data: props.values,
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgb(54, 162, 235)',
      borderWidth: 1,
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};
</script>

<template>
  <div class="chart-wrapper">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<style scoped>
.chart-wrapper {
  width: 100%;
  height: 350px;
}
</style>
