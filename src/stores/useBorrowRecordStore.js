import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/utils/axios';

export const useBorrowRecordStore = defineStore('borrowRecord', () => {
  // state
  const borrowRecords = ref([]);
  const loading = ref(false);

  // actions

  // Hàm lấy dữ liệu các bản ghi yêu cầu mượn sách về từ backend
  async function fetchBorrowRecords(filter = 'pending', sort = 'asc', search = '') {
    const res = await api.get('/borrow-records', {
      params: {
        filter,
        sort,
        search
      }
    });
    borrowRecords.value = res.data.data;
    return res.data;
  }

  // Hàm duyệt cho mượn sách
  async function approve(recordId) {
    const res = await api.put(`/borrow-records/approve/${recordId}`);
    borrowRecords.value = borrowRecords.value.filter(
      r => r._id !== res.data.data._id
    );
    return res.data;
  }

  // Hàm từ chối cho mượn sách
  async function reject(recordId) {
    const res = await api.put(`/borrow-records/reject/${recordId}`);
    borrowRecords.value = borrowRecords.value.filter(
      r => r._id !== res.data.data._id
    );
    return res.data;
  }

  // Hàm trả sách
  async function returnBook(recordId) {
    const res = await api.put(`/borrow-records/return/${recordId}`);
    borrowRecords.value = borrowRecords.value.filter(
      r => r._id !== res.data.data._id
    );
    return res.data;
  }

  return { borrowRecords, loading, fetchBorrowRecords, approve, reject, returnBook };
});