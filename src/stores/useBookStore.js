import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/utils/axios.js';

export const useBookStore = defineStore('book', () => {
  //state
  const books = ref([]);
  const loading = ref(false);

  //actions
  async function fetchBooks() {
    const res = await api.get('/books');
    books.value = res.data.data;
    return res.data;
  }

  async function addBook(book) {
    const res = await api.post('/books', book, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    books.value.push(res.data.data);
    return res.data;
  }

  async function updateBook(book) {
    const res = await api.put(`/books/${book.get('MASACH')}`, book, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    books.value = books.value.map(
      b => b.MASACH === res.data.data.MASACH ? res.data.data : b
    );
    return res.data;
  }

  async function deleteBook(id) {
    const res = await api.delete(`/books/${id}`);
    books.value = books.value.filter(book => book.MASACH !== id);
    return res.data;
  }

  return { books, loading, fetchBooks, addBook, updateBook, deleteBook };
});