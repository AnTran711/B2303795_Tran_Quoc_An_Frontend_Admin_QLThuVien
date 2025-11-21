import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/utils/axios';

export const usePublisherStore = defineStore('publisher', () => {
  // state
  const publishers = ref([]);
  const loading = ref(false);

  // actions

  // Hàm lấy dữ liệu nhà xuất bản về từ backend
  async function fetchPublishers(page = 1, limit = 7, search = '', sort = true) {
    const res = await api.get('/publishers', {
      params: {
        page,
        limit,
        search,
        sort
      }
    });
    publishers.value = res.data.data;
    return res.data;
  }

  // Hàm thêm nhà xuất bản (gửi dữ liệu nhà xuất bản cần thêm lên backend)
  async function addPublisher(publisher) {
    const res = await api.post('/publishers', publisher);
    return res.data;
  }

  // Hàm cập nhật nhà xuất bản
  async function updatePublisher(publisher, publisherId) {
    const res = await api.put(`/publishers/${publisherId}`, publisher);
    return res.data;
  }

  // Hàm xóa nhà xuất bản
  async function deletePublisher(id) {
    const res = await api.delete(`/publishers/${id}`);
    return res.data;
  }

  return { publishers, loading, fetchPublishers, addPublisher, updatePublisher, deletePublisher };
});