import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/utils/axios.js';

export const useBookStore = defineStore('book', () => {
  //state
  const books = ref([]);
  const loading = ref(false);

  //actions
  async function fetchBooks(page = 1, limit = 5, search = '', genreId = 'all', sort = true, filterState = 'all') {
    const res = await api.get('/books', {
      params: {
        page,
        limit,
        search,
        genreId,
        sort,
        filterState
      }
    });
    books.value = res.data.data;
    return res.data;
  }

  async function addBook(book) {
    const res = await api.post('/books', book, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  }

  async function updateBook(book, bookId) {
    const res = await api.put(`/books/${bookId}`, book, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  }

  async function deleteBook(id) {
    const res = await api.delete(`/books/${id}`);
    return res.data;
  }

  return { books, loading, fetchBooks, addBook, updateBook, deleteBook };
});