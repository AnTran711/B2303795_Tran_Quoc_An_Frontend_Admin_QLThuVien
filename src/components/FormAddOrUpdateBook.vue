<script setup>
  import { useBookStore } from '@/stores/useBookStore';
  import { useAuthorStore } from '@/stores/useAuthorStore';
  import { usePublisherStore } from '@/stores/usePublisherStore';
  import { reactive, watch } from 'vue';
  import { rules } from '@/utils/rules';
  import { toast } from 'vue3-toastify';

  const bookStore = useBookStore();
  const authorStore = useAuthorStore();
  const publisherStore = usePublisherStore();

  const modelValue = defineModel();

  const newBook = reactive({
    MASACH: null,
    TENSACH: null,
    ANHBIA: null,
    DONGIA: null,
    SOQUYEN: null,
    NAMXUATBAN: null,
    MATACGIA: null,
    MANXB: null
  });

  // Hàm gửi dữ liệu sách
  function handleSubmit() {
    const formData = new FormData();
    formData.append('MASACH', newBook.MASACH);
    formData.append('TENSACH', newBook.TENSACH);
    formData.append('DONGIA', newBook.DONGIA);
    formData.append('SOQUYEN', newBook.SOQUYEN);
    formData.append('NAMXUATBAN', newBook.NAMXUATBAN);
    formData.append('MATACGIA', newBook.MATACGIA);
    formData.append('MANXB', newBook.MANXB);

    if (newBook.ANHBIA && newBook.ANHBIA instanceof File) {
      formData.append('ANHBIA', newBook.ANHBIA);
    } else if (Array.isArray(newBook.ANHBIA) && newBook.ANHBIA.length > 0) {
      formData.append('ANHBIA', newBook.ANHBIA[0]);
    }

    bookStore.addBook(formData);

    modelValue.value = false;
    Object.keys(newBook).forEach(key => newBook[key] = null);
  }

  // Hiển thị message
  watch(
    [() => bookStore.successMessage, () => bookStore.errorMessage],
    ([newSuccessMsg, newErrorMsg]) => {
      if (newSuccessMsg) {
        toast.success(newSuccessMsg);
        bookStore.successMessage = null;
      }
      if (newErrorMsg) {
        toast.error(newErrorMsg);
        bookStore.errorMessage = null;
      }
    }
  )
</script>

<template>
  <v-overlay
    v-model="modelValue"
    class="align-center justify-center"
  >
    <v-card width="500" max-height="80vh" class="pa-4">
      <v-card-title>Thêm sách</v-card-title>
      <div style="overflow-y: auto; max-height: 65vh;">
        <v-card-text>
          <v-text-field
            label="Mã sách"
            clearable
            variant="outlined"
            v-model="newBook.MASACH"
            density="comfortable"
            :rules="[rules.required]"
          />
          <v-text-field
            label="Tên sách"
            clearable
            variant="outlined"
            v-model="newBook.TENSACH"
            :rules="[rules.required]"
            density="comfortable"
            class="mt-2"
          />
          <v-file-input
            v-model="newBook.ANHBIA"
            accept="image/*"
            prepend-icon=""
            prepend-inner-icon="mdi-image"
            label="Ảnh bìa"
            variant="outlined"
            density="comfortable"
            class="mt-2"
          ></v-file-input>
          <v-text-field
            label="Đơn giá"
            clearable
            variant="outlined"
            v-model="newBook.DONGIA"
            density="comfortable"
            class="mt-2"
          />
          <v-text-field
            label="Số quyển"
            type="number"
            variant="outlined"
            v-model="newBook.SOQUYEN"
            :rules="[rules.positiveNumber]"
            density="comfortable"
            class="mt-2"
          />
          <v-text-field
            label="Năm xuất bản"
            clearable
            variant="outlined"
            v-model="newBook.NAMXUATBAN"
            density="comfortable"
            class="mt-2"
          />
          <v-select
            v-model="newBook.MATACGIA"
            label="Tác giả"
            :items="authorStore.authors"
            item-title="HOTENTACGIA"
            item-value="MATACGIA"
            variant="outlined"
            density="comfortable"
            class="mt-2"
          ></v-select>
          <v-select
            v-model="newBook.MANXB"
            label="Nhà xuất bản"
            :items="publisherStore.publishers"
            item-title="TENNXB"
            item-value="MANXB"
            variant="outlined"
            density="comfortable"
            class="mt-2"
          ></v-select>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-spacer />
          <v-btn color="primary" @click="handleSubmit">Lưu</v-btn>
          <v-btn variant="text" @click="modelValue = false">Đóng</v-btn>
        </v-card-actions>
      </div>
    </v-card>
  </v-overlay>
</template>