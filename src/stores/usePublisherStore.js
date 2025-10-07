import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/utils/axios';

export const usePublisherStore = defineStore('publisher', () => {
  // state
  const publishers = ref([]);
  const loading = ref(false);
  const errorMessage = ref(null);

  // actions
  async function fetchPublishers() {
    loading.value = true;
    errorMessage.value = null;
    try {
      const res = await api.get('/publishers');
      publishers.value = res.data;
    } catch (err) {
      console.error(err.message);
      errorMessage.value = 'Không thể kết nối đến server. Vui lòng thử lại sau';
    } finally {
      loading.value = false;
    }
  }

  return { publishers, loading, errorMessage, fetchPublishers };
});