import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/utils/axios.js';

export const useAuthorStore = defineStore('author', () => {
  // state
  const authors = ref([]);
  const loading = ref(false);
  const errorMessage = ref(null);

  // actions
  async function fetchAuthors() {
    loading.value = true;
    errorMessage.value = null;
    try {
      const res = await api.get('/authors');
      authors.value = res.data;
    } catch (err) {
      console.error(err.message);
      errorMessage.value = 'Không thể kết nối đến server. Vui lòng thử lại sau';
    } finally {
      loading.value = false;
    }
  }

  return { authors, loading, errorMessage, fetchAuthors };
});