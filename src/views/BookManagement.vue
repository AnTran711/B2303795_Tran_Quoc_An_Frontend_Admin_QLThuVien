<script setup>
  import { computed, ref, onMounted, watch } from 'vue';
  import { useBookStore } from '@/stores/useBookStore';
  import { useAuthorStore } from '@/stores/useAuthorStore';
  import { usePublisherStore } from '@/stores/usePublisherStore';
  import FormAddOrUpdateBook from '@/components/FormAddOrUpdateBook.vue';
  import Pagination from '@/components/Pagination.vue';
  import Loading from '@/components/Loading.vue';
  import { toast } from 'vue3-toastify';

  const bookStore = useBookStore();
  const authorStore = useAuthorStore();
  const publisherStore = usePublisherStore();
  onMounted(async () => {
    try {
      await bookStore.fetchBooks();
      await authorStore.fetchAuthors();
      await publisherStore.fetchPublishers();
    } catch (err) {
      toast.error(err.response.data.message);
      // toast.error('Lấy dữ liệu thất bại');
    }
  });

  const selectedBookId = ref(null);

  // paging
  const bookInPage = 5;
  const currentPage = ref(1);
  const pagingBooks = computed(() => {
    const start = bookInPage*(currentPage.value-1);

    return bookStore.books.slice(start, start + bookInPage);
  });

  // filter toolbar
  const itemsFilter = ['Tất cả', 'Còn sách', 'Hết sách'];
  const selectedFilter = ref('Tất cả');

  
  // Delete book -------------------
  const showDeleteConfirm = ref(false);

  // Open delete book confirm function
  function openDeleteConfirm(id) {
    selectedBookId.value = id;
    showDeleteConfirm.value = true;
  }

  // Delete comfirm function
  async function deleteConfirm() {
    if(selectedBookId.value) {
      try {
        const res = await bookStore.deleteBook(selectedBookId.value);
        toast.success(res.message);
        selectedBookId.value = null;
        showDeleteConfirm.value = false;
      } catch (err) {
        toast.error(err.response.data.message);
      }
    }
  }
  
  // Cancel delete function
  function deleteCancel() {
    selectedBookId.value = null;
    showDeleteConfirm.value = false;
  }

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
    if(newValueShowForm === false) {
      isEditing.value = false;
      selectedBookId.value = null;
    }
  })

</script>

<template>
  <div class="pa-4">
    <!-- Toolbar -->
    <v-row class="pa-4 bg-white rounded elevation-1 align-center" no-gutters >
      <v-col class="d-flex align-center" cols="4">
        <v-text-field
          class="mr-2"
          label="Tìm kiếm sách"
          variant="outlined"
          hide-details
          density="compact"
        />
        <v-btn class="mr-4" color="primary">
          <v-icon>mdi-magnify</v-icon>
          Tìm
        </v-btn>
      </v-col>
      <v-col cols="4"></v-col>
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
          <th class="text-left">
            Mã sách
          </th>
          <th class="text-center">
            Ảnh bìa
          </th>
          <th class="text-left">
            Tên sách
          </th>
          <th class="text-left">
            Đơn giá
          </th>
          <th class="text-center">
            Tổng số lượng
          </th>
          <th class="text-center">
            Còn lại
          </th>
          <th class="text-left">
            Nhà xuất bản
          </th>
          <th class="text-center">
            Hành động
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="book in pagingBooks" :key="book.MASACH">
          <td>{{ book.MASACH }}</td>
          <td>
            <v-img
              class="ma-1 rounded"
              :height="66"
              cover
              :src="book.ANHBIA"
            ></v-img>
          </td>
          <td style="max-width: 400px; overflow: hidden;">{{ book.TENSACH }}</td>
          <td>{{ book.DONGIA }}</td>
          <td class="text-center">
            <v-chip color="primary" variant="flat">
              {{ book.SOQUYEN }}
            </v-chip>
          </td>
          <td class="text-center">
            <v-chip color="success" variant="flat">
              {{ book.SACHCONLAI }}
            </v-chip>
          </td>
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
      </tbody>
    </v-table>
    
    <div
      v-show="bookStore.books.length ? false : true"
      class="message-add-book"
    >
      Chưa có sách nào được thêm, vui lòng nhập sách
    </div>

    <v-overlay
      v-model="showDeleteConfirm"
      class="align-center justify-center"
      @update:model-value="(val) => { if(!val) deleteCancel() }"
    >
      <v-card>
        <v-card-title>
          Xác nhận xóa sách
        </v-card-title>
        <v-card-text>
          Hành động này sẽ không thể khôi phục, bạn có chắc chắn muốn xóa!!!
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
            variant="text"
            color="error"
            @click="deleteConfirm"
          >
            Xóa
          </v-btn>
          <v-btn variant="text" @click="deleteCancel">Hủy</v-btn>
        </v-card-actions>
      </v-card>
    </v-overlay>

    <!-- Pagination -->
    <Pagination v-model="currentPage" :book-in-page="bookInPage"></Pagination>

    <!-- Loading -->
    <Loading v-model="bookStore.loading"></Loading>
  </div>

  <!-- Form thêm/sửa sách -->
  <FormAddOrUpdateBook
    v-model="showForm"
    :is-editing="isEditing"
    :book-id="selectedBookId"
  />
  
</template>

<style scoped>
.message-add-book {
  height: 430px;
  text-align: center;
  margin-top: 8px;
}
</style>
