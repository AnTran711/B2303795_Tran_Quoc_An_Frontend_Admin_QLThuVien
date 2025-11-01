<script setup>
  import { computed, ref, watch } from 'vue';
  import { useBorrowRecordStore } from '@/stores/useBorrowRecordStore';
  import { toast } from 'vue3-toastify';

  const borrowRecordStore = useBorrowRecordStore();

  // Lọc
  const itemsFilter = ['Chờ duyệt', 'Đã duyệt', 'Đã trả', 'Từ chối'];
  const selectedFilter = ref('Chờ duyệt');

  const filterRecords = computed(() => {
    let records = borrowRecordStore.borrowRecords;

    records = records.filter(r => r.TRANGTHAI === selectedFilter.value);

    return records;
  });

  // Biến lưu id của record được chọn để duyệt hoặc từ chối
  const recordSelectedId = ref(null);

  // Xác nhận duyệt
  const showApproveConfirm = ref(false);

  const openApproveConfirm = (recordId) => {
    recordSelectedId.value = recordId
    showApproveConfirm.value = true;
  }

  const approve = () => {
    // Logic duyệt
  }

  const cancelApprove = () => {
    recordSelectedId.value = null;
    showApproveConfirm.value = false;
  }

  // Xác nhận từ chối
  const showRejectConfirm = ref(false);

  const openRejectConfirm = (recordId) => {
    recordSelectedId.value = recordId;
    showRejectConfirm.value = true;
  }

  const reject = () => {
    // Logic từ chối
  }

  const cancelReject = () => {
    recordSelectedId.value = null;
    showRejectConfirm.value = false;
  }

</script>

<template>
  <div class="pa-4">
    <!-- Toolbar -->
    <v-row class="pa-4 bg-white rounded elevation-1 align-center" no-gutters >
      <v-col cols="2">
        <v-select
          label="Trạng thái"
          :items="itemsFilter"
          v-model="selectedFilter"
          hide-details
          variant="outlined"
          density="compact"
        ></v-select>
      </v-col>
    </v-row>

    <!-- Table -->
    <v-table
      class="mt-2 rounded elevation-1"
      striped="even"
      v-show="filterRecords.length ? true : false"
    >
      <thead class="bg-primary">
        <tr>
          <th class="text-left">Độc giả</th>
          <th class="text-left">Sách</th>
          <th class="text-left">Ngày yêu cầu</th>
          <th class="text-left">Hạn trả</th>
          <th class="text-left">Ngày trả</th>
          <th class="text-center">Trạng thái</th>
          <th v-if="selectedFilter === 'Chờ duyệt'" class="text-center">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="record in filterRecords" :key="record._id">
          <td>{{ record.DOCGIA.HOLOT + ' ' + record.DOCGIA.TEN }}</td>
          <td style="max-width: 400px;">{{ record.SACH.TENSACH }}</td>
          <td>{{ record.NGAYYEUCAU }}</td>
          <td>{{ record.HANTRA }}</td>
          <td>{{ record.NGAYTRA }}</td>
          <td class="text-center">
            <v-chip
              :color="record.TRANGTHAI === 'Chờ duyệt' ? 'warning' 
                    : record.TRANGTHAI === 'Đã duyệt' ? 'success' 
                    : record.TRANGTHAI === 'Đã trả' ? 'primary'
                    : 'error'"
              variant="flat"
            >
              {{ record.TRANGTHAI }}
            </v-chip>
          </td>
          <td v-if="record.TRANGTHAI === 'Chờ duyệt'" class="text-center">
            <v-btn
              icon
              variant="text"
              color="success"
              @click="openApproveConfirm(record._id)"
            >
              <v-icon>mdi-check-bold</v-icon>
            </v-btn>
            <v-btn
              icon
              variant="text"
              color="error"
              @click="openRejectConfirm(record._id)"
            >
              <v-icon>mdi-close-thick</v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
  </div>

  <!-- Approve confirm -->
  <v-overlay
    v-model="showApproveConfirm"
    class="align-center justify-center"
    @update:model-value="(val) => { if(!val) cancelApprove() }"
  >
    <v-card>
      <v-card-title>Xác nhận duyệt</v-card-title>
      <v-card-text>
        Bạn có chắc chắn muốn cho độc giả này mượn sách?
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn
          variant="elevated"
          color="primary"
          @click="approve"
        >
          Duyệt
        </v-btn>
        <v-btn variant="tonal" @click="cancelApprove">Hủy</v-btn>
      </v-card-actions>
    </v-card>
  </v-overlay>
  
  <!-- Reject confirm -->
  <v-overlay
    v-model="showRejectConfirm"
    class="align-center justify-center"
    @update:model-value="(val) => { if(!val) cancelReject() }"
  >
    <v-card>
      <v-card-title>Xác nhận từ chối</v-card-title>
      <v-card-text>
        Bạn có chắc chắn muốn từ chối cho độc giả này mượn sách?
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn
          variant="elevated"
          color="error"
          @click="reject"
        >
          Từ chối
        </v-btn>
        <v-btn variant="tonal" @click="cancelReject">Hủy</v-btn>
      </v-card-actions>
    </v-card>
  </v-overlay>

</template>
