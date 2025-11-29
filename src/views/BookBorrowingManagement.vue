<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useBorrowRecordStore } from '@/stores/useBorrowRecordStore';
import { toast } from 'vue3-toastify';
import { useRoute, useRouter } from 'vue-router';

const borrowRecordStore = useBorrowRecordStore();
const router = useRouter();
const route = useRoute();

// Lọc
const filterItems = [
  {
    title: 'Chờ duyệt',
    value: 'pending',
  },
  {
    title: 'Đang mượn',
    value: 'borrowed',
  },
  {
    title: 'Đã trả',
    value: 'returned',
  },
  {
    title: 'Từ chối',
    value: 'rejected',
  },
];
const selectedFilter = ref('pending');

// Sắp xếp
const sortItems = [
  {
    title: 'Cũ nhất',
    value: 'asc',
  },
  {
    title: 'Mới nhất',
    value: 'desc',
  },
];
const selectedSort = ref('asc');

// Tìm kiếm
const searchQuery = ref('');

// Biến để delay khi người dùng gõ nhanh, sau khi người dùng ngưng gõ 0.5s thì mới call API
let debounceTimer = null;

// Biến để xác định khi nào thì load trạng thái từ URL xong
let isInitialized = ref(false);

const fetchData = async () => {
  // Hủy bỏ setTimeout cũ của kí tự được nhập vào trước đó
  clearTimeout(debounceTimer);

  // Chỉ khi người dùng ngưng gõ 0.5s thì call API
  debounceTimer = setTimeout(
    async () => {
      if (isInitialized.value) {
        router.replace({
          path: '/book-borrowing-management',
          query: {
            filter: selectedFilter.value,
            sort: selectedSort.value,
            search: searchQuery.value,
          },
        });
      }

      await borrowRecordStore.fetchBorrowRecords(
        selectedFilter.value,
        selectedSort.value,
        searchQuery.value
      );
    },
    isInitialized.value ? 500 : 0
  ); // Lần đầu không delay
};

watch([selectedFilter, selectedSort, searchQuery], () => {
  if (isInitialized.value) {
    fetchData();
  }
});

// Biến lưu id của record được chọn để duyệt hoặc từ chối
const recordSelectedId = ref(null);

// Xác nhận duyệt
const showApproveConfirm = ref(false);

const openApproveConfirm = (recordId) => {
  recordSelectedId.value = recordId;
  showApproveConfirm.value = true;
};

const approve = async () => {
  showApproveConfirm.value = false;

  if (recordSelectedId.value) {
    const res = await borrowRecordStore.approve(recordSelectedId.value);
    toast.success(res.message);

    recordSelectedId.value = null;
  }
};

const cancelApprove = () => {
  recordSelectedId.value = null;
  showApproveConfirm.value = false;
};

// Xác nhận từ chối
const showRejectConfirm = ref(false);

const openRejectConfirm = (recordId) => {
  recordSelectedId.value = recordId;
  showRejectConfirm.value = true;
};

const reject = async () => {
  showRejectConfirm.value = false;

  if (recordSelectedId.value) {
    const res = await borrowRecordStore.reject(recordSelectedId.value);
    toast.success(res.message);

    recordSelectedId.value = null;
  }
};

const cancelReject = () => {
  recordSelectedId.value = null;
  showRejectConfirm.value = false;
};

// Xác nhận trả sách
const showReturnConfirm = ref(false);

const openReturnConfirm = (recordId) => {
  recordSelectedId.value = recordId;
  showReturnConfirm.value = true;
};

const returnBook = async () => {
  showReturnConfirm.value = false;

  if (recordSelectedId.value) {
    const res = await borrowRecordStore.returnBook(recordSelectedId.value);
    toast.success(res.message);

    recordSelectedId.value = null;
  }
};

const cancelReturn = () => {
  recordSelectedId.value = null;
  showReturnConfirm.value = false;
};

// Hàm lấy ra trạng thái
const getStatusText = (value) => {
  return filterItems.find((i) => i.value === value).title;
};

// Hàm chuẩn hóa ngày
const formatDate = (date) => {
  return date ? new Date(date).toLocaleDateString('vi-VN') : '--/--/----';
};

// Xử lý lúc vào trang lần đầu hoặc reload trang
onMounted(async () => {
  // Nếu URL có query thì đồng bộ lại, không trigger watch
  if (route.query.filter) selectedFilter.value = route.query.filter;
  if (route.query.sort) selectedSort.value = route.query.sort;
  if (route.query.search) searchQuery.value = route.query.search;

  // Gọi API lần đầu
  await fetchData();

  // Đánh dấu khởi tạo xong
  isInitialized.value = true;
});

onUnmounted(() => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
});
</script>

<template>
  <v-container fluid class="pa-4">
    <!-- Toolbar -->
    <v-row class="pa-4 bg-white rounded elevation-1 align-center" no-gutters>
      <v-col cols="3" class="pa-2">
        <v-select
          label="Trạng thái"
          :items="filterItems"
          item-title="title"
          item-value="value"
          v-model="selectedFilter"
          hide-details
          variant="outlined"
          density="compact"
          color="primary"
        ></v-select>
      </v-col>

      <v-col cols="3" class="pa-2">
        <v-select
          label="Sắp xếp theo"
          :items="sortItems"
          item-title="title"
          item-value="value"
          v-model="selectedSort"
          hide-details
          variant="outlined"
          density="compact"
          color="primary"
        ></v-select>
      </v-col>

      <v-col cols="6" class="pa-2">
        <v-text-field
          v-model="searchQuery"
          prepend-inner-icon="mdi-magnify"
          hide-details
          variant="outlined"
          density="compact"
          clearable
          label="Tìm kiếm sách"
          color="primary"
        />
      </v-col>
    </v-row>

    <!-- Table -->
    <v-table
      class="mt-2 rounded elevation-1"
      striped="even"
      v-if="borrowRecordStore.borrowRecords.length ? true : false"
    >
      <thead class="bg-primary">
        <tr>
          <th class="text-left">Độc giả</th>
          <th class="text-left">Sách</th>
          <th class="text-left">Ngày yêu cầu</th>
          <th class="text-left">Hạn trả</th>
          <th class="text-left">Ngày trả</th>
          <th class="text-center">Trạng thái</th>
          <th class="text-center">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="record in borrowRecordStore.borrowRecords"
          :key="record?._id"
        >
          <td>{{ record?.DOCGIA?.HOLOT + ' ' + record?.DOCGIA?.TEN }}</td>
          <td style="max-width: 400px">
            {{ record?.SACH?.TENSACH }}
            <v-chip
              v-show="
                record?.TRANGTHAI === 'borrowed' &&
                new Date().getTime() > new Date(record?.HANTRA).getTime()
              "
              class="ml-2"
              variant="flat"
              color="error"
            >
              Quá hạn
            </v-chip>
          </td>
          <td>{{ formatDate(record?.NGAYYEUCAU) }}</td>
          <td>{{ formatDate(record?.HANTRA) }}</td>
          <td>{{ formatDate(record?.NGAYTRA) }}</td>
          <td class="text-center">
            <v-chip
              :color="
                record?.TRANGTHAI === 'pending'
                  ? 'warning'
                  : record?.TRANGTHAI === 'borrowed'
                  ? 'success'
                  : record?.TRANGTHAI === 'returned'
                  ? 'primary'
                  : 'error'
              "
              variant="flat"
            >
              {{ getStatusText(record?.TRANGTHAI) }}
            </v-chip>
          </td>
          <td v-if="record?.TRANGTHAI === 'pending'" class="text-center">
            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  icon
                  v-bind="props"
                  variant="text"
                  color="success"
                  @click="openApproveConfirm(record._id)"
                >
                  <v-icon>mdi-check-bold</v-icon>
                </v-btn>
              </template>
              <span>Duyệt</span>
            </v-tooltip>

            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  icon
                  v-bind="props"
                  variant="text"
                  color="error"
                  @click="openRejectConfirm(record?._id)"
                >
                  <v-icon>mdi-close-thick</v-icon>
                </v-btn>
              </template>
              <span>Từ chối</span>
            </v-tooltip>
          </td>

          <td v-else-if="record?.TRANGTHAI === 'borrowed'" class="text-center">
            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  icon
                  v-bind="props"
                  variant="text"
                  color="primary"
                  @click="openReturnConfirm(record?._id)"
                >
                  <v-icon>mdi-book-refresh</v-icon>
                </v-btn>
              </template>
              <span>Trả sách</span>
            </v-tooltip>
          </td>

          <td v-else></td>
        </tr>
      </tbody>
    </v-table>

    <div v-else class="d-flex justify-center mt-8">
      <span class="text-body-1">Không có yêu cầu</span>
    </div>
  </v-container>

  <!-- Approve confirm -->
  <v-overlay
    v-model="showApproveConfirm"
    class="align-center justify-center"
    @update:model-value="
      (val) => {
        if (!val) cancelApprove();
      }
    "
  >
    <v-card>
      <v-card-title>Xác nhận duyệt</v-card-title>
      <v-card-text>
        Bạn có chắc chắn muốn cho độc giả này mượn sách?
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn variant="elevated" color="primary" @click="approve">
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
    @update:model-value="
      (val) => {
        if (!val) cancelReject();
      }
    "
  >
    <v-card>
      <v-card-title>Xác nhận từ chối</v-card-title>
      <v-card-text>
        Bạn có chắc chắn muốn từ chối cho độc giả này mượn sách?
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn variant="elevated" color="error" @click="reject">
          Từ chối
        </v-btn>
        <v-btn variant="tonal" @click="cancelReject">Hủy</v-btn>
      </v-card-actions>
    </v-card>
  </v-overlay>

  <!-- Return confirm -->
  <v-overlay
    v-model="showReturnConfirm"
    class="align-center justify-center"
    @update:model-value="
      (val) => {
        if (!val) cancelReturn();
      }
    "
  >
    <v-card>
      <v-card-title>Xác nhận trả sách</v-card-title>
      <v-card-text>
        Bạn có chắc chắn xác nhận độc giả đã trả cuốn sách này không?
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn variant="elevated" color="primary" @click="returnBook">
          Xác nhận
        </v-btn>
        <v-btn variant="tonal" @click="cancelReturn">Hủy</v-btn>
      </v-card-actions>
    </v-card>
  </v-overlay>
</template>
