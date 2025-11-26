<script setup>
import BarChart from '@/components/BarChart.vue';
import { onMounted, ref } from 'vue';
import api from '@/utils/axios';

// Biểu đồ theo tháng
const monthLabels = [
  'T1',
  'T2',
  'T3',
  'T4',
  'T5',
  'T6',
  'T7',
  'T8',
  'T9',
  'T10',
  'T11',
  'T12',
];

// Lấy năm hiện tại
const currentYear = new Date().getFullYear();

// Năm được chọn để hiển thị biểu đồ
const selectedYear = ref(currentYear);

// Danh sách năm
const listYears = [];

for (let i = 2025; i <= currentYear; i++) {
  listYears.push(i);
}

const totalBooks = ref(0);
const totalReaders = ref(0);
const pendingBookCount = ref(0);
const borrowedBookCount = ref(0);
const monthBorrows = ref([]);
const topBooks = ref([]);

onMounted(async () => {
  const year = selectedYear.value;
  const res = await api.get('/dashboard', {
    params: { year },
  });

  totalBooks.value = res.data.data.totalBooks;
  totalReaders.value = res.data.data.totalReaders;
  pendingBookCount.value = res.data.data.pendingBookCount;
  borrowedBookCount.value = res.data.data.borrowedBookCount;
  monthBorrows.value = res.data.data.chartData;
  topBooks.value = res.data.data.tableTop5Data;
});
</script>

<template>
  <v-container fluid class="pa-4">
    <!-- Header -->
    <v-row>
      <v-col cols="12">
        <div class="d-flex align-center">
          <v-icon size="40" color="primary" class="mr-4"
            >mdi-view-dashboard</v-icon
          >
          <h1 class="text-h4 text-primary font-weight-bold">
            Dashboard - Tổng quan hệ thống
          </h1>
        </div>
      </v-col>
    </v-row>

    <!-- Statistics Cards -->
    <v-row>
      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card stat-card-1" elevation="2" rounded="lg">
          <v-card-text class="pa-4">
            <div class="d-flex align-center justify-space-between">
              <div>
                <p class="text-caption text-grey-darken-1 mb-2">Tổng số sách</p>
                <h2 class="text-h3 font-weight-bold text-primary">
                  {{ totalBooks }}
                </h2>
              </div>
              <v-avatar size="60" color="primary" class="stat-icon">
                <v-icon
                  icon="mdi-book-multiple"
                  size="30"
                  color="white"
                ></v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card stat-card-2" elevation="2" rounded="lg">
          <v-card-text class="pa-4">
            <div class="d-flex align-center justify-space-between">
              <div>
                <p class="text-caption text-grey-darken-1 mb-2">Độc giả</p>
                <h2 class="text-h3 font-weight-bold text-success">
                  {{ totalReaders }}
                </h2>
              </div>
              <v-avatar size="60" color="success" class="stat-icon">
                <v-icon
                  icon="mdi-account-group"
                  size="30"
                  color="white"
                ></v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card stat-card-3" elevation="2" rounded="lg">
          <v-card-text class="pa-4">
            <div class="d-flex align-center justify-space-between">
              <div>
                <p class="text-caption text-grey-darken-1 mb-2">Chờ duyệt</p>
                <h2 class="text-h3 font-weight-bold text-warning">
                  {{ pendingBookCount }}
                </h2>
              </div>
              <v-avatar size="60" color="warning" class="stat-icon">
                <v-icon
                  icon="mdi-book-open-variant"
                  size="30"
                  color="white"
                ></v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="stat-card stat-card-4" elevation="2" rounded="lg">
          <v-card-text class="pa-4">
            <div class="d-flex align-center justify-space-between">
              <div>
                <p class="text-caption text-grey-darken-1 mb-2">Đang mượn</p>
                <h2 class="text-h3 font-weight-bold text-info">
                  {{ borrowedBookCount }}
                </h2>
              </div>
              <v-avatar size="60" color="info" class="stat-icon">
                <v-icon
                  icon="mdi-check-circle"
                  size="30"
                  color="white"
                ></v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Borrow Chart + Top Books -->
    <v-row>
      <!-- Chart -->
      <v-col cols="12" md="8">
        <v-card elevation="2" rounded="lg" class="pa-4">
          <div class="d-flex align-center justify-center mb-2">
            <h3 class="text-h6 font-weight-bold mr-2">
              Lượt mượn sách theo từng tháng của năm
            </h3>

            <div style="width: 100px">
              <v-select
                v-model="selectedYear"
                :items="listYears"
                hide-details
                variant="outlined"
                density="compact"
              />
            </div>
          </div>

          <BarChart :labels="monthLabels" :values="monthBorrows" />
        </v-card>
      </v-col>

      <!-- Top 5 Books -->
      <v-col cols="12" md="4">
        <v-card elevation="2" rounded="lg" class="pa-4">
          <h3 class="text-h6 font-weight-bold mb-4">
            Top 5 sách được mượn nhiều nhất
          </h3>

          <v-table height="350">
            <thead class="bg-primary">
              <tr>
                <th>STT</th>
                <th>Sách</th>
                <th>Lượt mượn</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(book, index) in topBooks" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ book.TENSACH }}</td>
                <td class="font-weight-bold">{{ book.count }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
/* Stat card */
.stat-card {
  transition: all 0.3s ease;
  border-top: 4px solid transparent;
}

.stat-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
}

.stat-card-1:hover {
  border-top-color: rgb(var(--v-theme-primary));
}

.stat-card-2:hover {
  border-top-color: rgb(var(--v-theme-success));
}

.stat-card-3:hover {
  border-top-color: rgb(var(--v-theme-warning));
}

.stat-card-4:hover {
  border-top-color: rgb(var(--v-theme-info));
}

.stat-icon {
  transition: all 0.3s ease;
}

.stat-card:hover .stat-icon {
  transform: scale(1.1) rotate(5deg);
}
</style>
