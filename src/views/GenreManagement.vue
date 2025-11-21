<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useGenreStore } from '@/stores/useGenreStore';
import Pagination from '@/components/Pagination.vue';
import { toast } from 'vue3-toastify';
import FormAddOrUpdateGenre from '@/components/FormAddOrUpdateGenre.vue';
import { useRoute, useRouter } from 'vue-router';

const genreStore = useGenreStore();

const route = useRoute();
const router = useRouter();

// Id thể loại được chọn để sửa hoặc xóa
const selectedGenreId = ref(null);

// show form add/update genre ----------------------------
const showForm = ref(false);

const isEditing = ref(false);

// Hàm hiển thị form sửa thể loại
function showUpdateForm(id) {
  isEditing.value = true;
  showForm.value = true;
  selectedGenreId.value = id;
}

// Theo dõi sự thay đổi của biến showForm
watch(
  () => showForm.value,
  (newValueShowForm) => {
    if (!newValueShowForm) {
      isEditing.value = false;
      selectedGenreId.value = null;
    }
  }
);

// Tìm kiếm
const searchQuery = ref('');

// Sắp xếp
const itemsSort = ['Mã thể loại'];
const selectedSortField = ref('Mã thể loại');
const typeSort = ref(true); // true: là tăng dần, false: là giảm dần

// paging
const genresInPage = ref(7);
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
          path: '/genre-management',
          query: {
            page: currentPage.value,
            search: searchQuery.value,
            sort: typeSort.value,
          },
        });
      }

      const res = await genreStore.fetchGenres(
        currentPage.value,
        genresInPage.value,
        searchQuery.value,
        typeSort.value
      );
      totalPages.value = res.totalPages;
    },
    isInitialized.value ? 500 : 0
  ); // Lần đầu không delay
};

watch([currentPage, searchQuery, typeSort], ([newPage], [oldPage]) => {
  if (isInitialized.value) {
    if (newPage === oldPage) currentPage.value = 1;
    fetchData();
  }
});

// Xóa thể loại -------------------

// Biến hiển thị thông báo xác nhận xóa
const showDeleteConfirm = ref(false);

// Open delete genre confirm function
function openDeleteConfirm(id) {
  selectedGenreId.value = id;
  showDeleteConfirm.value = true;
}

// Delete comfirm function
async function deleteConfirm() {
  showDeleteConfirm.value = false;

  if (selectedGenreId.value) {
    const res = await genreStore.deleteGenre(selectedGenreId.value);
    if (genreStore.genres.length - 1 === 0 && currentPage.value > 1) {
      currentPage.value--;
    } else {
      fetchData();
    }
    toast.success(res.message);
    selectedGenreId.value = null;
  }
}

// Cancel delete function
function deleteCancel() {
  selectedGenreId.value = null;
  showDeleteConfirm.value = false;
}

// Xử lý lúc vào trang lần đầu hoặc reload trang
onMounted(async () => {
  // Nếu URL có query thì đồng bộ lại, không trigger watch
  if (route.query.page) currentPage.value = parseInt(route.query.page);
  if (route.query.search) searchQuery.value = route.query.search;
  if (route.query.sort) {
    typeSort.value = route.query.sort === 'true' ? true : false;
  }

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
      <v-col class="d-flex align-center" cols="3">
        <v-text-field
          v-model="searchQuery"
          class="mr-2"
          label="Tìm kiếm thể loại"
          variant="outlined"
          hide-details
          density="compact"
          clearable
          prepend-inner-icon="mdi-magnify"
          color="primary"
        />
      </v-col>
      <v-col cols="3" class="d-flex flex-row align-center">
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
      <v-col cols="4"></v-col>
      <v-col cols="2" class="text-right">
        <v-btn color="primary" @click="showForm = true">
          <v-icon class="mr-2">mdi-plus</v-icon>
          Thêm
        </v-btn>
      </v-col>
    </v-row>

    <!-- Table -->
    <v-table
      style="height: 420px"
      class="mt-2 rounded elevation-1"
      striped="even"
      v-if="genreStore.genres.length ? true : false"
    >
      <thead class="bg-primary">
        <tr>
          <th class="text-left">Mã thể loại</th>
          <th class="text-left">Tên thể loại</th>
          <th class="text-left">Mô tả</th>
          <th class="text-center">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="genre in genreStore.genres" :key="genre?.MATHELOAI">
          <td>{{ genre?.MATHELOAI }}</td>
          <td style="max-width: 400px; overflow: hidden">
            {{ genre?.TENTHELOAI }}
          </td>
          <td style="max-width: 400px; overflow: hidden">
            {{ genre?.MOTA || 'Không có mô tả' }}
          </td>
          <td class="text-center">
            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  icon
                  v-bind="props"
                  variant="text"
                  color="error"
                  @click="openDeleteConfirm(genre?.MATHELOAI)"
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
                  @click="showUpdateForm(genre?.MATHELOAI)"
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

    <!-- Hiển thị khi không có thể loại -->
    <div v-else class="d-flex justify-center mt-8">
      <span class="text-body-1">{{
        searchQuery
          ? 'Không tìm thấy thể loại phù hợp'
          : 'Hiện không có thể loại nào, bấm thêm thể loại để thêm thể loại mới'
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
        <v-card-title>Xác nhận xóa thể loại</v-card-title>
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
  <FormAddOrUpdateGenre
    v-model="showForm"
    :is-editing="isEditing"
    :genre-id="selectedGenreId"
    @submitted="fetchData"
  />
</template>
