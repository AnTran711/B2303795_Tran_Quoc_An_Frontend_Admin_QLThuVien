<script setup>
  import { useBookStore } from '@/stores/useBookStore';
  import { useAuthorStore } from '@/stores/useAuthorStore';
  import { usePublisherStore } from '@/stores/usePublisherStore';
  import { reactive, ref, watch } from 'vue';
  import { rules } from '@/utils/rules';
  import { toast } from 'vue3-toastify';

  const bookStore = useBookStore();
  const authorStore = useAuthorStore();
  const publisherStore = usePublisherStore();

  const modelValue = defineModel();

  // Định nghĩa props
  const props = defineProps({
    isEditing: Boolean,
    bookId: String
  });

  const book = reactive({
    MASACH: null,
    TENSACH: null,
    ANHBIA: null,
    DONGIA: null,
    SOQUYEN: null,
    NAMXUATBAN: null,
    MATACGIA: null,
    MANXB: null
  });

  const formRef = ref(null);
  const isFormValid = ref(false);

  // Các rule
  const localRules = {
    // Rule trùng mã sách
    uniqueMASACH: v => {
      if (!v) return true;
      const exist = bookStore.books.some(
        b => b.MASACH.trim().toLowerCase() === v.trim().toLowerCase()
      );
      return exist ? 'Mã sách này đã tồn tại' : true;
    },
  }

  // Theo dõi sự thay đổi của biến isEditing
  watch(() => props.isEditing, (isEditing) => {
    if(isEditing) {
      const currentUpdateBook = bookStore.books.find(b => b.MASACH === props.bookId);
      Object.keys(book).forEach(key => {
        if(key !== 'ANHBIA') {
          book[key] = currentUpdateBook[key];
        }
      });
    } else {
      Object.keys(book).forEach(key => book[key] = null);
    }
  });

  // Hàm gửi dữ liệu sách
  async function handleSubmit() {
    // Kiểm tra dữ liệu có hợp lệ hay không
    const { valid } = await formRef.value.validate();

    if(!valid) {
      toast.error('Vui lòng kiểm tra lại thông tin nhập');
      return;
    }

    // Gửi dữ liệu
    const formData = new FormData();
    Object.keys(book).forEach(key => {
      if(key === 'ANHBIA') {
        if (book[key] && book[key] instanceof File) {
          formData.append(key, book[key]);
        } else if (Array.isArray(book[key]) && book[key].length > 0) {
          formData.append(key, book[key][0]);
        }
      } else {
        formData.append(key, book[key]);
      }
    });

    try {
      let res;
      if(props.isEditing) {
        res = await bookStore.updateBook(formData);
      } else {
        res = await bookStore.addBook(formData);
      }
      toast.success(res.message);
    } catch (err) {
      toast.error(err.response.data.message);
    }

    modelValue.value = false;
    Object.keys(book).forEach(key => book[key] = null);
  }

</script>

<template>
  <v-overlay
    v-model="modelValue"
    class="align-center justify-center"
  >
    <v-card width="500" max-height="80vh" class="pa-4">
      <v-card-title>{{ props.isEditing ? 'Sửa sách' : 'Thêm sách' }}</v-card-title>
      <v-card-text class="pt-4" style="overflow-y: auto; max-height: 60vh;">
        <v-form ref="formRef" v-model="isFormValid">
          <v-text-field
            label="Mã sách"
            variant="outlined"
            v-model="book.MASACH"
            :disabled="props.isEditing ? true : false"
            density="comfortable"
            :rules="props.isEditing ? [] : [rules.required, localRules.uniqueMASACH]"
          />
          <v-text-field
            label="Tên sách"
            variant="outlined"
            v-model="book.TENSACH"
            :rules="[rules.required]"
            density="comfortable"
            class="mt-2"
          />
          <v-file-input
            v-model="book.ANHBIA"
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
            variant="outlined"
            :rules="[rules.number]"
            v-model="book.DONGIA"
            density="comfortable"
            class="mt-2"
          />
          <v-text-field
            label="Số quyển"
            type="number"
            variant="outlined"
            v-model="book.SOQUYEN"
            :rules="[rules.positiveNumber]"
            density="comfortable"
            class="mt-2"
          />
          <v-text-field
            label="Năm xuất bản"
            variant="outlined"
            :rules="[rules.number]"
            v-model="book.NAMXUATBAN"
            density="comfortable"
            class="mt-2"
          />
          <v-select
            v-model="book.MATACGIA"
            label="Tác giả"
            :items="authorStore.authors"
            item-title="HOTENTACGIA"
            item-value="MATACGIA"
            variant="outlined"
            density="comfortable"
            class="mt-2"
          ></v-select>
          <v-select
            v-model="book.MANXB"
            label="Nhà xuất bản"
            :rules="[rules.required]"
            :items="publisherStore.publishers"
            item-title="TENNXB"
            item-value="MANXB"
            variant="outlined"
            density="comfortable"
            class="mt-2"
          ></v-select>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-spacer />
        <v-btn color="primary" @click="handleSubmit">Lưu</v-btn>
        <v-btn variant="text" @click="modelValue = false">Đóng</v-btn>
      </v-card-actions>
    </v-card>
  </v-overlay>
</template>