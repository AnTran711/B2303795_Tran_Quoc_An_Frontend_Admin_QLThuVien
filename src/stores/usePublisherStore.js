import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/utils/axios';

export const usePublisherStore = defineStore('publisher', () => {
  // state
  const publishers = ref([]);
  const loading = ref(false);

  // actions
  async function fetchPublishers() {
    loading.value = true;
    try {
      const res = await api.get('/publishers');
      publishers.value = res.data.data;
      return res.data;
    } catch (err) {
      console.error(err.message);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return { publishers, loading, fetchPublishers };
});