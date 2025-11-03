import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/utils/axios';

export const useBorrowRecordStore = defineStore('borrowRecord', () => {
  // state
  const borrowRecords = ref([]);
  const loading = ref(false);

  // actions

  // Hàm lấy dữ liệu các bản ghi yêu cầu mượn sách về từ backend
  async function fetchBorrowRecords() {
    const res = await api.get('/book-borrowing');
    borrowRecords.value = res.data.data;
    return res.data;
  }

  // Hàm duyệt cho mượn sách
  async function approve(recordId) {
    const res = await api.put(`/book-borrowing/approve/${recordId}`);
    borrowRecords.value = borrowRecords.value.map(
      r => r._id === res.data.data._id ? res.data.data : r
    );
    return res.data;
  }

  // Hàm từ chối cho mượn sách
  async function reject(recordId) {
    const res = await api.put(`/book-borrowing/reject/${recordId}`);
    borrowRecords.value = borrowRecords.value.map(
      r => r._id === res.data.data._id ? res.data.data : r
    );
    return res.data;
  }

  // Hàm trả sách
  async function returnBook(recordId) {
    const res = await api.put(`/book-borrowing/return/${recordId}`);
    borrowRecords.value = borrowRecords.value.map(
      r => r._id === res.data.data._id ? res.data.data : r
    );
    return res.data;
  }

  return { borrowRecords, loading, fetchBorrowRecords, approve, reject, returnBook };
});