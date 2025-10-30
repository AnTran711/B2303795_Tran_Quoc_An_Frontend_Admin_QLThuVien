<script setup>
  import { computed, ref, watch } from 'vue';
  import { useGenreStore } from '@/stores/useGenreStore';
  import Pagination from '@/components/Pagination.vue';
  import { toast } from 'vue3-toastify';
  import FormAddOrUpdateGenre from '@/components/FormAddOrUpdateGenre.vue';

  const genreStore = useGenreStore();

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
  watch(() => showForm.value, (newValueShowForm) => {
    if(!newValueShowForm) {
      isEditing.value = false;
      selectedGenreId.value = null;
    }
  })

  // Tìm kiếm
  const searchQuery = ref('');

  // Sắp xếp
  const itemsSort = ['Mã thể loại'];
  const selectedSortField = ref('Mã thể loại');
  const typeSort = ref(true); // true: là tăng dần, false: là giảm dần

  // paging
  const genresInPage = 7;
  let currentPage = ref(1);

  const filterGenres = computed(() => {
    let genres = genreStore.genres;

    // Sắp xếp
    switch (selectedSortField.value) {
      case 'Mã thể loại':
        genres.sort((a, b) => {
          const numA = parseInt(a.MATHELOAI.slice(2));
          const numB = parseInt(b.MATHELOAI.slice(2));
          return typeSort.value ? (numA - numB) : (numB - numA);
        })
        break;
      default:
    }

    // Tìm kiếm theo tên
    if (searchQuery.value?.trim()) {
      const q = searchQuery.value.trim().toLowerCase();
      genres = genres.filter(g => g.TENTHELOAI.toLowerCase().includes(q));
    }

    return genres;
  });

  // Tính tổng số trang
  const totalPage = computed(() => Math.ceil(filterGenres.value.length / genresInPage));

  const showGenres = computed(() => {
    // Đảm bảo currentPage không lớn hơn totalPage
    if (currentPage.value > totalPage.value && totalPage.value > 0) {
      currentPage.value = totalPage.value;
    }
    const start = genresInPage * (currentPage.value - 1);

    return filterGenres.value.slice(start, start + genresInPage);
  });

  // Xóa nhà xuất bản -------------------

  // Biến hiển thị thông báo xác nhận xóa
  const showDeleteConfirm = ref(false);

  // Open delete genre confirm function
  function openDeleteConfirm(id) {
    selectedGenreId.value = id;
    showDeleteConfirm.value = true;
  }

  // Delete comfirm function
  async function deleteConfirm() {
    if(selectedGenreId.value) {
      const res = await genreStore.deleteGenre(selectedGenreId.value);
      toast.success(res.message);
      selectedGenreId.value = null;
      showDeleteConfirm.value = false;

      // Nếu xóa hết phần tử của trang cuối thì lùi về 1 trang
      const start = genresInPage * (currentPage.value - 1);
      if (start >= filterGenres.value.length && currentPage.value > 1) {
        currentPage.value--;
      }
    }
  }
  
  // Cancel delete function
  function deleteCancel() {
    selectedGenreId.value = null;
    showDeleteConfirm.value = false;
  }

</script>

<template>
  <div class="pa-4">
    <!-- Toolbar -->
    <v-row class="pa-4 bg-white rounded elevation-1 align-center" no-gutters >
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
        ></v-select>
        <v-btn
          v-if="typeSort"
          icon
          variant="text"
          @click="typeSort = !typeSort"
        >
          <v-icon>mdi-sort-ascending</v-icon>
        </v-btn>
        <v-btn
          v-else
          icon
          variant="text"
          @click="typeSort = !typeSort"
        >
          <v-icon>mdi-sort-descending</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="4"></v-col>
      <v-col cols="2" class="text-right">
        <v-btn
          color="primary"
          @click="showForm = true"
        >
          <v-icon>mdi-plus</v-icon>
          Thêm thể loại
        </v-btn>
      </v-col>
    </v-row>

    <!-- Table -->
    <v-table
      style="height: 420px;"
      class="mt-2 rounded elevation-1"
      striped="even"
      v-show="genreStore.genres.length ? true : false"
    >
      <thead class="bg-primary">
        <tr>
          <th class="text-left">Mã thể loại</th>
          <th class="text-left">Tên thể loại</th>
          <!-- <th class="text-left">Mô tả</th> -->
          <th class="text-center">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="genre in showGenres" :key="genre.MATHELOAI">
          <td>{{ genre.MATHELOAI }}</td>
          <td style="max-width: 400px; overflow: hidden;">{{ genre.TENTHELOAI }}</td>
          <!-- <td>{{ genre.MOTA }}</td> -->
          <td class="text-center">
            <v-btn
              icon
              variant="text"
              color="error"
              @click="openDeleteConfirm(genre.MATHELOAI)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <v-btn
              icon
              variant="text"
              color="primary"
              @click="showUpdateForm(genre.MATHELOAI)"
            >
              <v-icon>mdi-file-document-edit-outline</v-icon>
            </v-btn>
          </td>
        </tr>

        <!-- Hiển thị khi không tìm thấy sách phù hợp -->
        <tr v-show="!showGenres.length">
          <td colspan="3" class="text-center">Không tìm thấy thể loại phù hợp</td>
        </tr>
      </tbody>
    </v-table>

    <!-- Delete confirm -->
    <v-overlay
      v-model="showDeleteConfirm"
      class="align-center justify-center"
      @update:model-value="(val) => { if(!val) deleteCancel() }"
    >
      <v-card>
        <v-card-title>Xác nhận xóa thể loại</v-card-title>
        <v-card-text>
          Hành động này sẽ không thể khôi phục, bạn có chắc chắn muốn xóa không?
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
            variant="elevated"
            color="error"
            @click="deleteConfirm"
          >
            Xóa
          </v-btn>
          <v-btn variant="tonal" @click="deleteCancel">Hủy</v-btn>
        </v-card-actions>
      </v-card>
    </v-overlay>

    <!-- Pagination -->
    <Pagination v-model="currentPage" :length="totalPage"></Pagination>

  </div>

  <!-- Form thêm/sửa sách -->
  <FormAddOrUpdateGenre
    v-model="showForm"
    :is-editing="isEditing"
    :genre-id="selectedGenreId"
  />
</template>