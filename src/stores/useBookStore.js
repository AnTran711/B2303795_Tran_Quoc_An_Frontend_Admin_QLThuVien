import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/utils/axios.js';

export const useBookStore = defineStore('book', () => {
  //state
  const books = ref([]);
  const loading = ref(false);

  //actions
  async function fetchBooks() {
    loading.value = true;
    try {
      const res = await api.get('/books');
      books.value = res.data.data;
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function addBook(book) {
    loading.value = true;
    try {
      const res = await api.post('/books', book, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      books.value.push(res.data.data);
      return res.data;
    } catch (err) {
      console.error(err.message);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateBook(book) {
    loading.value = true;
    try {
      const res = await api.put(`/books/${book.get('MASACH')}`, book, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      books.value = books.value.map(
        b => b.MASACH === res.data.data.MASACH ? res.data.data : b
      );
      return res.data;
    } catch (err) {
      console.error(err.message);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteBook(id) {
    loading.value = true;
    try {
      const res = await api.delete(`/books/${id}`);
      books.value = books.value.filter(book => book.MASACH !== id);
      return res.data;
    } catch (err) {
      console.error(err.message);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return { books, loading, fetchBooks, addBook, updateBook, deleteBook };
});