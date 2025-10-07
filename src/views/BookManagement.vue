<script setup>
  import { computed, ref, onMounted, reactive } from 'vue';
  import { useBookStore } from '@/stores/useBookStore';
  import { useAuthorStore } from '@/stores/useAuthorStore';
  import { usePublisherStore } from '@/stores/usePublisherStore';
  import FormAddOrUpdateBook from '@/components/FormAddOrUpdateBook.vue';
  import Toolbar from '@/components/Toolbar.vue';
  import Pagination from '@/components/Pagination.vue';
  import Loading from '@/components/Loading.vue';

  const bookStore = useBookStore();
  const authorStore = useAuthorStore();
  const publisherStore = usePublisherStore();
  onMounted(() => {
    bookStore.fetchBooks();
    authorStore.fetchAuthors();
    publisherStore.fetchPublishers();
  });

  // paging
  const bookInPage = 5;
  const currentPage = ref(1);
  const pagingBooks = computed(() => {
    const start = bookInPage*(currentPage.value-1);

    return bookStore.books.slice(start, start + bookInPage);
  });

  // Delete book -------------------
  const showDeleteConfirm = ref(false);
  const selectedBookId = ref(null);

  // Open delete book confirm function
  function openDeleteConfirm(id) {
    selectedBookId.value = id;
    showDeleteConfirm.value = true;
  }

  // Delete comfirm function
  function deleteConfirm() {
    if(selectedBookId.value) {
      bookStore.deleteBook(selectedBookId.value);
      selectedBookId.value = null;
      showDeleteConfirm.value = false;
    }
  }
  
  // Cancel delete function
  function deleteCancel() {
    selectedBookId.value = null;
    showDeleteConfirm.value = false;
  }

  // show form add/update book ----------------------------
  const showForm = ref(false);

  // const newBook = reactive({
  //   MASACH: null,
  //   TENSACH: null,
  //   ANHBIA: null,
  //   DONGIA: null,
  //   SOQUYEN: null,
  //   NAMXUATBAN: null,
  //   MATACGIA: null,
  //   MANXB: null
  // });

  // function handleSubmit() {
  //   const formData = new FormData();
  //   formData.append('MASACH', newBook.MASACH);
  //   formData.append('TENSACH', newBook.TENSACH);
  //   formData.append('DONGIA', newBook.DONGIA);
  //   formData.append('SOQUYEN', newBook.SOQUYEN);
  //   formData.append('NAMXUATBAN', newBook.NAMXUATBAN);
  //   formData.append('MATACGIA', newBook.MATACGIA);
  //   formData.append('MANXB', newBook.MANXB);

  //   if (newBook.ANHBIA && newBook.ANHBIA instanceof File) {
  //     formData.append('ANHBIA', newBook.ANHBIA);
  //   } else if (Array.isArray(newBook.ANHBIA) && newBook.ANHBIA.length > 0) {
  //     formData.append('ANHBIA', newBook.ANHBIA[0]);
  //   }

  //   bookStore.addBook(formData);

  //   showForm.value = false;
  //   Object.keys(newBook).forEach(key => newBook[key] = null);
  // }

</script>

<template>
  <div class="pa-4">
    <!-- Toolbar -->
    <Toolbar v-model="showForm"></Toolbar>
    <!-- <v-row class="pa-4 bg-white rounded elevation-1 align-center" no-gutters >
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
    </v-row> -->

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
          <td>{{ book.MANXB }}</td>
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
          Xác nhận xóa sách vĩnh viễn
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
    <!-- <div
      v-show="bookStore.books.length ? true : false"
      class="text-center mt-3"
    >
      <v-pagination
        v-model="currentPage"
        active-color="primary"
        :length="totalPage"
        :total-visible="7"
      ></v-pagination>
    </div> -->

    <!-- Loading -->
    <Loading v-model="bookStore.loading"></Loading>
    <!-- <v-overlay
      v-model="bookStore.loading"
      persistent
      class="align-center justify-center"
    >
      <v-progress-circular indeterminate size="64" color="primary" />
    </v-overlay> -->
  
    <!-- Message error -->
    <!-- <v-snackbar
      v-model="bookStore.errorMessage"
      color="error"
      location="top"
    >
      {{ bookStore.errorMessage }}
  
      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="bookStore.errorMessage = null"
        >
          Đóng
        </v-btn>
      </template>
    </v-snackbar> -->

    <!-- Message successfully -->
    <!-- <v-snackbar
      v-model="bookStore.showSuccess"
      color="success"
      location="top"
      timeout="1000"
      @update:model-value="val => { if(!val) bookStore.successMessage = null}"
    >
      {{ bookStore.successMessage }}

      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="bookStore.showSuccess = false"
        >
          Đóng
        </v-btn>
      </template>
    </v-snackbar> -->
  </div>

  <!-- Form thêm/sửa sách -->
  <FormAddOrUpdateBook v-model="showForm"></FormAddOrUpdateBook>
  <!-- <v-overlay
    v-model="showForm"
    class="align-center justify-center"
  >
    <v-card width="500" max-height="80vh" class="pa-4">
      <v-card-title>Thêm sách</v-card-title>
      <v-card-text class="pt-4" style="overflow-y: auto; max-height: 60vh;">
        <v-text-field label="Mã sách" clearable variant="outlined" v-model="newBook.MASACH" />
        <v-text-field label="Tên sách" clearable variant="outlined" v-model="newBook.TENSACH" />
        <v-file-input
          v-model="newBook.ANHBIA"
          accept="image/*"
          prepend-icon=""
          prepend-inner-icon="mdi-image"
          label="Ảnh bìa"
          variant="outlined"
        ></v-file-input>
        <v-text-field label="Đơn giá" clearable variant="outlined" v-model="newBook.DONGIA" />
        <v-text-field
          label="Số quyển"
          type="number"
          variant="outlined"
          v-model="newBook.SOQUYEN"
        />
        <v-text-field label="Năm xuất bản" clearable variant="outlined" v-model="newBook.NAMXUATBAN" />
        <v-select
          v-model="newBook.MATACGIA"
          label="Tác giả"
          :items="authorStore.authors"
          item-title="HOTENTACGIA"
          item-value="MATACGIA"
          variant="outlined"
        ></v-select>
        <v-select
          v-model="newBook.MANXB"
          label="Nhà xuất bản"
          :items="publisherStore.publishers"
          item-title="TENNXB"
          item-value="MANXB"
          variant="outlined"
        ></v-select>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-spacer />
        <v-btn color="primary" @click="handleSubmit">Lưu</v-btn>
        <v-btn variant="text" @click="showForm = false">Đóng</v-btn>
      </v-card-actions>
    </v-card>
  </v-overlay> -->
</template>

<style scoped>
.message-add-book {
  height: 430px;
  text-align: center;
  margin-top: 8px;
}
</style>
