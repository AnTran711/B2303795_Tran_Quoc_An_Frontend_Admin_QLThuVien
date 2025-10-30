<script setup>
  import { useGenreStore } from '@/stores/useGenreStore';
  import { reactive, ref, watch } from 'vue';
  import { rules } from '@/utils/rules';
  import { toast } from 'vue3-toastify';

  const genreStore = useGenreStore();

  const modelValue = defineModel();

  // Định nghĩa props
  const props = defineProps({
    isEditing: Boolean,
    genreId: String
  });

  const genre = reactive({
    TENTHELOAI: '',
    MOTA: ''
  });

  // Instance của form
  const formRef = ref(null);

  // Biến kiểm tra form hợp lệ
  const isFormValid = ref(false);

  // Theo dõi sự thay đổi của biến isEditing
  watch([() => props.isEditing, () => props.genreId], ([isEditing]) => {
    if(isEditing) {
      const currentUpdateGenre = genreStore.genres.find(g => g.MATHELOAI === props.genreId);
      Object.keys(genre).forEach(key => {
        genre[key] = currentUpdateGenre[key];
      });
    } else {
      Object.keys(genre).forEach(key => genre[key] = '');
    }
  });

  // Hàm gửi dữ liệu thể loại
  async function handleSubmit() {
    // Kiểm tra dữ liệu có hợp lệ hay không
    const { valid } = await formRef.value.validate();

    if(!valid) {
      toast.error('Vui lòng kiểm tra lại thông tin nhập');
      return;
    }

    let res;
    if(props.isEditing) {
      res = await genreStore.updateGenre(genre, props.genreId);
    } else {
      res = await genreStore.addGenre(genre);
    }
    toast.success(res.message);

    // Tắt form
    modelValue.value = false;

    // Reset dữ liệu trong object genre
    Object.keys(genre).forEach(key => genre[key] = '');
  }

  // Hàm đóng form
  const closeFrom = () => {
    modelValue.value = false;
    Object.keys(genre).forEach(key => genre[key] = '');
  }

</script>

<template>
  <v-overlay
    v-model="modelValue"
    class="align-center justify-center"
  >
    <v-card width="500" max-height="80vh" class="pa-4">
      <v-card-title>{{ props.isEditing ? 'Sửa thể loại' : 'Thêm thể loại' }}</v-card-title>
      <v-card-text class="pt-4" style="overflow-y: auto; max-height: 60vh;">
        <v-form ref="formRef" v-model="isFormValid" @keyup.enter="handleSubmit">
          <v-text-field
            v-show="props.isEditing"
            label="Mã thể loại"
            variant="outlined"
            v-model="props.genreId"
            disabled
            density="comfortable"
          />
          <v-text-field
            label="Tên thể loại"
            variant="outlined"
            v-model="genre.TENTHELOAI"
            :rules="[rules.required]"
            density="comfortable"
            class="mt-2"
            clearable
          />
          <v-textarea
            label="Mô tả thể loại"
            variant="outlined"
            v-model="genre.MOTA"
            class="mt-2"
            clearable
          />
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-spacer />
        <v-btn variant="elevated" color="primary" @click="handleSubmit">Lưu</v-btn>
        <v-btn variant="tonal" @click="closeFrom">Đóng</v-btn>
      </v-card-actions>
    </v-card>
  </v-overlay>
</template>
