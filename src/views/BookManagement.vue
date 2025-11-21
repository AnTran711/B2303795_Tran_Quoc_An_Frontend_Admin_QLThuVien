<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useBookStore } from '@/stores/useBookStore';
import FormAddOrUpdateBook from '@/components/FormAddOrUpdateBook.vue';
import Pagination from '@/components/Pagination.vue';
import { toast } from 'vue3-toastify';
import { useRoute, useRouter } from 'vue-router';
import { useGenreStore } from '@/stores/useGenreStore';

const bookStore = useBookStore();
const genreStore = useGenreStore();

const router = useRouter();
const route = useRoute();

let genres = [
  {
    MATHELOAI: 'all',
    TENTHELOAI: 'Tất cả',
  },
];

// Id cuốn sách được chọn để sửa hoặc xóa
const selectedBookId = ref(null);

// show form add/update book ----------------------------
const showForm = ref(false);

const isEditing = ref(false);

// Hàm hiển thị form sửa sách
function showUpdateForm(id) {
  isEditing.value = true;
  showForm.value = true;
  selectedBookId.value = id;
}

// Theo dõi sự thay đổi của biến showForm
watch(
  () => showForm.value,
  (newValueShowForm) => {
    if (!newValueShowForm) {
      isEditing.value = false;
      selectedBookId.value = null;
    }
  }
);

// Tìm kiếm + lọc
const searchQuery = ref('');
const filterItems = [
  {
    title: 'Tất cả',
    value: 'all',
  },
  {
    title: 'Còn sách',
    value: 'available',
  },
  {
    title: 'Hết sách',
    value: 'unavailable',
  },
];

const selectedFilter = ref('all');

const selectedGenreId = ref('all');

// Sắp xếp
const itemsSort = ['Mã sách'];
const selectedSortField = ref('Mã sách');
const typeSort = ref(true); // true: tăng dần

// paging
const bookInPage = ref(5);
let currentPage = ref(1);
let totalPages = ref(1);

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
          path: '/book-management',
          query: {
            page: currentPage.value,
            search: searchQuery.value,
            genreId: selectedGenreId.value,
            sort: typeSort.value,
            filterState: selectedFilter.value,
          },
        });
      }

      const res = await bookStore.fetchBooks(
        currentPage.value,
        bookInPage.value,
        searchQuery.value,
        selectedGenreId.value,
        typeSort.value,
        selectedFilter.value
      );
      totalPages.value = res.totalPages;
    },
    isInitialized.value ? 500 : 0
  ); // Lần đầu không delay
};

watch(
  [currentPage, searchQuery, selectedGenreId, typeSort, selectedFilter],
  ([newPage], [oldPage]) => {
    if (isInitialized.value) {
      if (newPage === oldPage) currentPage.value = 1;
      fetchData();
    }
  }
);

// Delete book -------------------

// Biến hiển thị thông báo xác nhận xóa
const showDeleteConfirm = ref(false);

// Open delete book confirm function
function openDeleteConfirm(id) {
  selectedBookId.value = id;
  showDeleteConfirm.value = true;
}

// Delete comfirm function
async function deleteConfirm() {
  showDeleteConfirm.value = false;

  if (selectedBookId.value) {
    const res = await bookStore.deleteBook(selectedBookId.value);
    if (bookStore.books.length - 1 === 0 && currentPage.value > 1) {
      currentPage.value--;
    } else {
      fetchData();
    }
    toast.success(res.message);
    selectedBookId.value = null;
  }
}

// Cancel delete function
function deleteCancel() {
  selectedBookId.value = null;
  showDeleteConfirm.value = false;
}

// Xử lý lúc vào trang lần đầu hoặc reload trang
onMounted(async () => {
  // Nếu URL có query thì đồng bộ lại, không trigger watch
  if (route.query.page) currentPage.value = parseInt(route.query.page);
  if (route.query.search) searchQuery.value = route.query.search;
  if (route.query.genreId) selectedGenreId.value = route.query.genreId;
  if (route.query.sort) {
    typeSort.value = route.query.sort === 'true' ? true : false;
  }
  if (route.query.filterState) selectedFilter.value = route.query.filterState;

  // Gọi API lần đầu
  await genreStore.fetchGenres(-1);
  genres = [...genres, ...genreStore.genres];

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
      <v-col class="d-flex align-center" cols="3">
        <v-text-field
          v-model="searchQuery"
          class="mr-2"
          label="Tìm kiếm sách"
          variant="outlined"
          hide-details
          density="compact"
          clearable
          prepend-inner-icon="mdi-magnify"
          color="primary"
        />
      </v-col>
      <v-col cols="2" class="d-flex flex-row align-center">
        <v-select
          label="Sắp xếp theo"
          :items="itemsSort"
          v-model="selectedSortField"
          hide-details
          variant="outlined"
          density="compact"
          color="primary"
        ></v-select>
        <v-btn
          v-if="typeSort"
          icon
          variant="text"
          @click="typeSort = !typeSort"
        >
          <v-icon>mdi-sort-ascending</v-icon>
        </v-btn>
        <v-btn v-else icon variant="text" @click="typeSort = !typeSort">
          <v-icon>mdi-sort-descending</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="1"></v-col>
      <v-col cols="2">
        <v-select
          label="Thể loại"
          class="mx-2"
          :items="genres"
          item-title="TENTHELOAI"
          item-value="MATHELOAI"
          v-model="selectedGenreId"
          hide-details
          variant="outlined"
          density="compact"
          color="primary"
        ></v-select>
      </v-col>
      <v-col cols="2">
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
      <v-col cols="2" class="text-right">
        <v-btn color="primary" @click="showForm = true">
          <v-icon class="mr-2">mdi-plus</v-icon>
          Thêm sách
        </v-btn>
      </v-col>
    </v-row>

    <!-- Table -->
    <v-table
      style="height: 430px"
      class="mt-2 rounded elevation-1"
      striped="even"
      v-if="bookStore.books?.length ? true : false"
    >
      <thead class="bg-primary">
        <tr>
          <th class="text-left">Mã sách</th>
          <th class="text-center">Ảnh bìa</th>
          <th class="text-left">Tên sách</th>
          <th class="text-left">Đơn giá</th>
          <th class="text-center">Tổng số lượng</th>
          <th class="text-center">Còn lại</th>
          <th class="text-left">Tác giả</th>
          <th class="text-left">Nhà xuất bản</th>
          <th class="text-center">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="book in bookStore.books" :key="book?.MASACH" height="74">
          <td>{{ book?.MASACH }}</td>
          <td>
            <v-img
              class="ma-1 rounded elevation-1"
              height="66"
              aspect-ratio="2/3"
              :src="book?.ANHBIA || '/imgs/no-cover.png'"
            >
              <template v-slot:error>
                <v-img
                  class="ma-1 rounded"
                  height="66"
                  aspect-ratio="2/3"
                  src="/imgs/no-cover.png"
                ></v-img>
              </template>
            </v-img>
          </td>
          <td style="max-width: 400px; overflow: hidden">
            {{ book?.TENSACH }}
          </td>
          <td>{{ book?.DONGIA }}</td>
          <td class="text-center">
            <v-chip color="primary" variant="flat">
              {{ book?.SOQUYEN }}
            </v-chip>
          </td>
          <td class="text-center">
            <v-chip
              :color="book?.SACHCONLAI > 0 ? 'success' : 'error'"
              variant="flat"
            >
              {{ book?.SACHCONLAI }}
            </v-chip>
          </td>
          <td>{{ book?.TENTACGIA }}</td>
          <td>
            {{ book?.NHAXUATBAN?.TENNXB }}
          </td>
          <td class="text-center">
            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  icon
                  v-bind="props"
                  variant="text"
                  color="error"
                  @click="openDeleteConfirm(book?.MASACH)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
              <span>Xóa</span>
            </v-tooltip>

            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  icon
                  v-bind="props"
                  variant="text"
                  color="primary"
                  @click="showUpdateForm(book?.MASACH)"
                >
                  <v-icon>mdi-file-document-edit-outline</v-icon>
                </v-btn>
              </template>
              <span>Sửa</span>
            </v-tooltip>
          </td>
        </tr>
      </tbody>
    </v-table>

    <!-- Hiển thị khi không có sách -->
    <div v-else class="d-flex justify-center mt-8">
      <span class="text-body-1">{{
        searchQuery
          ? 'Không tìm thấy sách phù hợp'
          : 'Hiện không có sách nào, bấm thêm sách để thêm sách mới'
      }}</span>
    </div>

    <!-- Delete confirm -->
    <v-overlay
      v-model="showDeleteConfirm"
      class="align-center justify-center"
      @update:model-value="
        (val) => {
          if (!val) deleteCancel();
        }
      "
    >
      <v-card>
        <v-card-title>Xác nhận xóa sách</v-card-title>
        <v-card-text>
          Hành động này sẽ không thể khôi phục, bạn có chắc chắn muốn xóa không?
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="elevated" color="error" @click="deleteConfirm">
            Xóa
          </v-btn>
          <v-btn variant="tonal" @click="deleteCancel">Hủy</v-btn>
        </v-card-actions>
      </v-card>
    </v-overlay>

    <!-- Pagination -->
    <Pagination v-model="currentPage" :length="totalPages"></Pagination>
  </v-container>

  <!-- Form thêm/sửa sách -->
  <FormAddOrUpdateBook
    v-model="showForm"
    :is-editing="isEditing"
    :book-id="selectedBookId"
    @submitted="fetchData"
  />
</template>
