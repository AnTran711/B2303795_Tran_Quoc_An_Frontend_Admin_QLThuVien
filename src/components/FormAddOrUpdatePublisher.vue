<script setup>
  import { usePublisherStore } from '@/stores/usePublisherStore';
  import { reactive, ref, watch } from 'vue';
  import { rules } from '@/utils/rules';
  import { toast } from 'vue3-toastify';

  const publisherStore = usePublisherStore();

  const modelValue = defineModel();

  // Định nghĩa props
  const props = defineProps({
    isEditing: Boolean,
    publisherId: String
  });

  const publisher = reactive({
    MANXB: null,
    TENNXB: null,
    DIACHI: null
  });

  // Instance của form
  const formRef = ref(null);

  // Biến kiểm tra form hợp lệ
  const isFormValid = ref(false);

  // Các rule
  const localRules = {
    // Rule trùng mã nhà xuất bản
    uniqueMANXB: v => {
      if (!v) return true;
      const exist = publisherStore.publishers.some(
        p => p.MANXB.trim().toLowerCase() === v.trim().toLowerCase()
      );
      return exist ? 'Mã nhà xuất bản này đã tồn tại' : true;
    }
  }

  // Theo dõi sự thay đổi của biến isEditing
  watch(() => props.isEditing, (isEditing) => {
    if(isEditing) {
      const currentUpdatePublisher = publisherStore.publishers.find(p => p.MANXB === props.publisherId);
      Object.keys(publisher).forEach(key => {
        publisher[key] = currentUpdatePublisher[key];
      });
    } else {
      Object.keys(publisher).forEach(key => publisher[key] = null);
    }
  });

  // Hàm gửi dữ liệu nhà xuất bản
  async function handleSubmit() {
    // Kiểm tra dữ liệu có hợp lệ hay không
    const { valid } = await formRef.value.validate();

    if(!valid) {
      toast.error('Vui lòng kiểm tra lại thông tin nhập');
      return;
    }

    // // Gửi dữ liệu
    // const formData = new FormData();
    // Object.keys(publisher).forEach(key => {
    //   formData.append(key, publisher[key]);
    // });

    let res;
    if(props.isEditing) {
      res = await publisherStore.updatePublisher(publisher);
    } else {
      res = await publisherStore.addPublisher(publisher);
    }
    toast.success(res.message);

    modelValue.value = false;
    Object.keys(publisher).forEach(key => publisher[key] = null);
  }

</script>

<template>
  <v-overlay
    v-model="modelValue"
    class="align-center justify-center"
  >
    <v-card width="500" max-height="80vh" class="pa-4">
      <v-card-title>{{ props.isEditing ? 'Sửa nhà xuất bản' : 'Thêm nhà xuất bản' }}</v-card-title>
      <v-card-text class="pt-4" style="overflow-y: auto; max-height: 60vh;">
        <v-form ref="formRef" v-model="isFormValid" @keyup.enter="handleSubmit">
          <v-text-field
            label="Mã nhà xuất bản"
            variant="outlined"
            v-model="publisher.MANXB"
            :disabled="props.isEditing ? true : false"
            density="comfortable"
            :rules="props.isEditing ? [] : [rules.required, localRules.uniqueMANXB]"
          />
          <v-text-field
            label="Tên nhà xuất bản"
            variant="outlined"
            v-model="publisher.TENNXB"
            :rules="[rules.required]"
            density="comfortable"
            class="mt-2"
          />
          <v-text-field
            label="Địa chỉ"
            variant="outlined"
            v-model="publisher.DIACHI"
            density="comfortable"
            class="mt-2"
          />
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
