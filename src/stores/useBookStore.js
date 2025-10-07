import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/utils/axios.js';

export const useBookStore = defineStore('book', () => {
  //state
  const books = ref([]);
  const loading = ref(false);
  const showSuccess = ref(false);
  const successMessage = ref(null);
  const errorMessage = ref(null);

  //actions
  async function fetchBooks() {
    loading.value = true;
    errorMessage.value = null;
    try {
      const res = await api.get('/books');
      books.value = res.data;
    } catch (err) {
      console.error(err.message);
      errorMessage.value = 'Không thể kết nối đến server. Vui lòng thử lại sau';
    } finally {
      loading.value = false;
    }
  }

  async function addBook(book) {
    loading.value = true;
    showSuccess.value = false;
    successMessage.value = null;
    errorMessage.value = null;
    try {
      const res = await api.post('/books', book, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      books.value.push(res.data);
      successMessage.value = 'Thêm sách thành công';
      showSuccess.value = true;
    } catch (err) {
      console.error(err.message);
      errorMessage.value = 'Không thể kết nối đến server. Vui lòng thử lại sau';
    } finally {
      loading.value = false;
    }
  }

  async function deleteBook(id) {
    loading.value = true;
    showSuccess.value = false;
    successMessage.value = null;
    errorMessage.value = null;
    try {
      await api.delete(`/books/${id}`);
      books.value = books.value.filter(book => book.MASACH !== id);
      successMessage.value = 'Xóa sách thành công';
      showSuccess.value = true;
    } catch (err) {
      console.error(err.message);
      errorMessage.value = 'Không thể kết nối đến server, vui lòng thử lại sau';
    } finally {
      loading.value = false;
    }
  }

  return { books, loading, showSuccess, successMessage, errorMessage, fetchBooks, addBook, deleteBook };
});