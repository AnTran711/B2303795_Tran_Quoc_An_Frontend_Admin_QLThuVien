import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/utils/axios';

export const useGenreStore = defineStore('genre', () => {
  // state
  const genres = ref([]);
  const loading = ref(false);

  // actions

  // Hàm lấy dữ liệu thể loại về từ backend
  async function fetchGenres(page = 1, limit = 7, search = '', sort = true) {
    const res = await api.get('/genres', {
      params: {
        page,
        limit,
        search,
        sort
      }
    });
    genres.value = res.data.data;
    return res.data;
  }

  // Hàm thêm thể loại (gửi dữ liệu thể loại cần thêm lên backend)
  async function addGenre(genre) {
    const res = await api.post('/genres', genre);
    return res.data;
  }

  // Hàm cập nhật thể loại
  async function updateGenre(genre, genreId) {
    const res = await api.put(`/genres/${genreId}`, genre);
    return res.data;
  }

  // Hàm xóa thể loại
  async function deleteGenre(id) {
    const res = await api.delete(`/genres/${id}`);
    return res.data;
  }

  return { genres, loading, fetchGenres, addGenre, updateGenre, deleteGenre };
});