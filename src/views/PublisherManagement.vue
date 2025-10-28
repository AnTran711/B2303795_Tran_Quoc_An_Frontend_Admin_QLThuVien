<script setup>
  import { computed, ref, watch } from 'vue';
  import { usePublisherStore } from '@/stores/usePublisherStore';
  import Pagination from '@/components/Pagination.vue';
  import FormAddOrUpdatePublisher from '@/components/FormAddOrUpdatePublisher.vue';
  import { toast } from 'vue3-toastify';

  const publisherStore = usePublisherStore();

  // Id nhà xuất bản được chọn để sửa hoặc xóa
  const selectedPublisherId = ref(null);

  // show form add/update book ----------------------------
  const showForm = ref(false);

  const isEditing = ref(false);

  // Hàm hiển thị form sửa sách
  function showUpdateForm(id) {
    isEditing.value = true;
    showForm.value = true;
    selectedPublisherId.value = id;
  }

  // Theo dõi sự thay đổi của biến showForm
  watch(() => showForm.value, (newValueShowForm) => {
    if(!newValueShowForm) {
      isEditing.value = false;
      selectedPublisherId.value = null;
    }
  })

  // Tìm kiếm
  const searchQuery = ref('');

  // Sắp xếp
  const itemsSort = ['Mã nhà xuất bản'];
  const selectedSortField = ref('Mã nhà xuất bản');
  const typeSort = ref(true);

  // paging
  const publisherInPage = 7;
  let currentPage = ref(1);

  const filterPublishers = computed(() => {
    let publishers = publisherStore.publishers;

    // Sắp xếp
    switch (selectedSortField.value) {
      case 'Mã nhà xuất bản':
        publishers.sort((a, b) => {
          const numA = parseInt(a.MANXB.slice(1));
          const numB = parseInt(b.MANXB.slice(1));
          return typeSort.value ? (numA - numB) : (numB - numA);
        })
        break;
      default:
    }

    // Tìm kiếm theo tên
    if (searchQuery.value?.trim()) {
      const q = searchQuery.value.trim().toLowerCase();
      publishers = publishers.filter(p => p.TENNXB.toLowerCase().includes(q));
    }

    return publishers;
  });

  // Tính tổng số trang
  const totalPage = computed(() => Math.ceil(filterPublishers.value.length / publisherInPage));

  const showPublishers = computed(() => {
    // Đảm bảo currentPage không lớn hơn totalPage
    if (currentPage.value > totalPage.value && totalPage.value > 0) {
      currentPage.value = totalPage.value;
    }
    const start = publisherInPage * (currentPage.value - 1);

    return filterPublishers.value.slice(start, start + publisherInPage);
  })

  // Xóa nhà xuất bản -------------------

  // Biến hiển thị thông báo xác nhận xóa
  const showDeleteConfirm = ref(false);

  // Open delete publisher confirm function
  function openDeleteConfirm(id) {
    selectedPublisherId.value = id;
    showDeleteConfirm.value = true;
  }

  // Delete comfirm function
  async function deleteConfirm() {
    if(selectedPublisherId.value) {
      const res = await publisherStore.deletePublisher(selectedPublisherId.value);
      toast.success(res.message);
      selectedPublisherId.value = null;
      showDeleteConfirm.value = false;

      // Nếu xóa hết phần tử của trang cuối thì lùi về 1 trang
      const start = publisherInPage * (currentPage.value - 1);
      if (start >= filterPublishers.value.length && currentPage.value > 1) {
        currentPage.value--;
      }
    }
  }
  
  // Cancel delete function
  function deleteCancel() {
    selectedPublisherId.value = null;
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
          label="Tìm kiếm nhà xuất bản"
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
          Thêm nhà xuất bản
        </v-btn>
      </v-col>
    </v-row>

    <!-- Table -->
    <v-table
      style="height: 420px;"
      class="mt-2 rounded elevation-1"
      striped="even"
      v-show="publisherStore.publishers.length ? true : false"
    >
      <thead class="bg-primary">
        <tr>
          <th class="text-left">Mã nhà xuất bản</th>
          <th class="text-left">Tên nhà xuất bản</th>
          <th class="text-left">Địa chỉ</th>
          <th class="text-center">Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="publisher in showPublishers" :key="publisher.MANXB">
          <td>{{ publisher.MANXB }}</td>
          <td style="max-width: 400px; overflow: hidden;">{{ publisher.TENNXB }}</td>
          <td>{{ publisher.DIACHI }}</td>
          <td class="text-center">
            <v-btn
              icon
              variant="text"
              color="error"
              @click="openDeleteConfirm(publisher.MANXB)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <v-btn
              icon
              variant="text"
              color="primary"
              @click="showUpdateForm(publisher.MANXB)"
            >
              <v-icon>mdi-file-document-edit-outline</v-icon>
            </v-btn>
          </td>
        </tr>

        <!-- Hiển thị khi không tìm thấy sách phù hợp -->
        <tr v-show="!showPublishers.length">
          <td colspan="3" class="text-center">Không tìm thấy nhà xuất bản phù hợp</td>
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
        <v-card-title>Xác nhận xóa nhà xuất bản</v-card-title>
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
  <FormAddOrUpdatePublisher
    v-model="showForm"
    :is-editing="isEditing"
    :publisher-id="selectedPublisherId"
  />
</template>