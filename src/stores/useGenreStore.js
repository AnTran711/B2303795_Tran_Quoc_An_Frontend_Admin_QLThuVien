import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/utils/axios';

export const useGenreStore = defineStore('genre', () => {
  // state
  const genres = ref([]);
  const loading = ref(false);

  // actions

  // Hàm lấy dữ liệu thể loại về từ backend
  async function fetchGenres() {
    const res = await api.get('/genres');
    genres.value = res.data.data;
    return res.data;
  }

  // Hàm thêm thể loại (gửi dữ liệu thể loại cần thêm lên backend)
  async function addGenre(genre) {
    const res = await api.post('/genres', genre);
    genres.value.push(res.data.data);
    return res.data;
  }

  // Hàm cập nhật thể loại
  async function updateGenre(genre, genreId) {
    const res = await api.put(`/genres/${genreId}`, genre);
    genres.value = genres.value.map(
      g => g.MATHELOAI === res.data.data.MATHELOAI ? res.data.data : g
    );
    return res.data;
  }

  // Hàm xóa thể loại
  async function deleteGenre(id) {
    const res = await api.delete(`/genres/${id}`);
    genres.value = genres.value.filter(g => g.MATHELOAI !== id);
    return res.data;
  }

  return { genres, loading, fetchGenres, addGenre, updateGenre, deleteGenre };
});