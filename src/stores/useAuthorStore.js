import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/utils/axios.js';

export const useAuthorStore = defineStore('author', () => {
  // state
  const authors = ref([]);
  const loading = ref(false);

  // actions
  async function fetchAuthors() {
    loading.value = true;
    try {
      const res = await api.get('/authors');
      authors.value = res.data.data;
      return res.data;
    } catch (err) {
      console.error(err.message);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return { authors, loading, fetchAuthors };
});