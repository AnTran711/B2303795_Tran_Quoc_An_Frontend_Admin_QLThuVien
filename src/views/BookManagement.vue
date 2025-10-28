<script setup>
  import { computed, ref, watch } from 'vue';
  import { useBookStore } from '@/stores/useBookStore';
  import { usePublisherStore } from '@/stores/usePublisherStore';
  import FormAddOrUpdateBook from '@/components/FormAddOrUpdateBook.vue';
  import Pagination from '@/components/Pagination.vue';
  import { toast } from 'vue3-toastify';

  const bookStore = useBookStore();
  const publisherStore = usePublisherStore();

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
  watch(() => showForm.value, (newValueShowForm) => {
    if(!newValueShowForm) {
      isEditing.value = false;
      selectedBookId.value = null;
    }
  })

  // Tìm kiếm + lọc
  const searchQuery = ref('');
  const itemsFilter = ['Tất cả', 'Còn sách', 'Hết sách'];
  const selectedFilter = ref('Tất cả');

  // Sắp xếp
  const itemsSort = ['Mã sách'];
  const selectedSortField = ref('Mã sách');
  const typeSort = ref(true);

  // paging
  const bookInPage = 5;
  let currentPage = ref(1);

  const filterBooks = computed(() => {
    let books = bookStore.books;

    // Sắp xếp
    switch (selectedSortField.value) {
      case 'Mã sách':
        books.sort((a, b) => {
          const numA = parseInt(a.MASACH.slice(1));
          const numB = parseInt(b.MASACH.slice(1));
          return typeSort.value ? (numA - numB) : (numB - numA);
        })
        break;
      default:
    }

    // Lọc theo trạng thái
    if (selectedFilter.value === 'Còn sách') {
      books = books.filter(b => b.SACHCONLAI > 0);
    } else if (selectedFilter.value === 'Hết sách') {
      books = books.filter(b => b.SACHCONLAI === 0);
    }

    // Tìm kiếm theo tên
    if (searchQuery.value?.trim()) {
      const q = searchQuery.value.trim().toLowerCase();
      books = books.filter(b => b.TENSACH.toLowerCase().includes(q));
    }

    return books;
  });

  // Tính tổng số trang
  const totalPage = computed(() => Math.ceil(filterBooks.value.length / bookInPage));

  const showBooks = computed(() => {
    // Đảm bảo currentPage không lớn hơn totalPage
    if (currentPage.value > totalPage.value && totalPage.value > 0) {
      currentPage.value = totalPage.value;
    }
    const start = bookInPage * (currentPage.value - 1);

    return filterBooks.value.slice(start, start + bookInPage);
  })


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
    if(selectedBookId.value) {
      const res = await bookStore.deleteBook(selectedBookId.value);
      toast.success(res.message);
      selectedBookId.value = null;
      showDeleteConfirm.value = false;

      // Nếu xóa hết phần tử của trang cuối thì lùi về 1 trang
      const start = bookInPage * (currentPage.value - 1);
      if (start >= filterBooks.value.length && currentPage.value > 1) {
        currentPage.value--;
      }
    }
  }
  
  // Cancel delete function
  function deleteCancel() {
    selectedBookId.value = null;
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
          label="Tìm kiếm sách"
          variant="outlined"
          hide-details
          density="compact"
          clearable
          prepend-inner-icon="mdi-magnify"
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
      <v-col cols="3"></v-col>
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
      <v-col cols="2" class="text-right">
        <v-btn
          color="primary"
          @click="showForm = true"
        >
          <v-icon>mdi-plus</v-icon>
          Thêm sách
        </v-btn>
      </v-col>
    </v-row>

    <!-- Table -->
    <v-table
      style="height: 430px;"
      class="mt-2 rounded elevation-1"
      striped="even"
      v-show="bookStore.books.length ? true : false"
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
        <tr v-for="book in showBooks" :key="book.MASACH">
          <td>{{ book.MASACH }}</td>
          <td>
            <v-img
              class="ma-1 rounded elevation-1"
              :height="66"
              aspect-ratio="2/3"
              :src="book.ANHBIA || '/imgs/no-cover.png'"
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
          <td style="max-width: 400px; overflow: hidden;">{{ book.TENSACH }}</td>
          <td>{{ book.DONGIA }}</td>
          <td class="text-center">
            <v-chip color="primary" variant="flat">
              {{ book.SOQUYEN }}
            </v-chip>
          </td>
          <td class="text-center">
            <v-chip :color="book.SACHCONLAI > 0 ? 'success' : 'error'" variant="flat">
              {{ book.SACHCONLAI }}
            </v-chip>
          </td>
          <td>{{ book.TENTACGIA }}</td>
          <td>{{ publisherStore.publishers.find(p => p.MANXB === book.MANXB)?.TENNXB }}</td>
          <td class="text-center">
            <v-btn
              icon
              variant="text"
              color="error"
              @click="openDeleteConfirm(book.MASACH)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <v-btn
              icon
              variant="text"
              color="primary"
              @click="showUpdateForm(book.MASACH)"
            >
              <v-icon>mdi-file-document-edit-outline</v-icon>
            </v-btn>
          </td>
        </tr>

        <!-- Hiển thị khi không tìm thấy sách phù hợp -->
        <tr v-show="!showBooks.length">
          <td colspan="8" class="text-center">Không tìm thấy sách phù hợp</td>
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
        <v-card-title>Xác nhận xóa sách</v-card-title>
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
  <FormAddOrUpdateBook
    v-model="showForm"
    :is-editing="isEditing"
    :book-id="selectedBookId"
  />
  
</template>
