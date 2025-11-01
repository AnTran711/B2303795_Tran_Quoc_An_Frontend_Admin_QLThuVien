import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/utils/axios';

export const useBorrowRecordStore = defineStore('borrowRecord', () => {
  // state
  const borrowRecords = ref([]);
  const loading = ref(false);

  // actions

  // Hàm lấy dữ liệu thể loại về từ backend
  async function fetchBorrowRecords() {
    const res = await api.get('/book-borrowing');
    borrowRecords.value = res.data.data;
    return res.data;
  }

  // Hàm thêm thể loại (gửi dữ liệu thể loại cần thêm lên backend)
  // async function borrow(payload, stateBorrow) {
  //   const res = await api.post('/book-borrowing', payload);
  //   await fetchBorrowRecords(stateBorrow);
  //   return res.data;
  // }

  return { borrowRecords, loading, fetchBorrowRecords };
});