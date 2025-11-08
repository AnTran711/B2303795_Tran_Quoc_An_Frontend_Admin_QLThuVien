import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/utils/axios.js';

export const useEmployeeStore = defineStore('employee', () => {
  //state
  const employee = ref(null);
  const loading = ref(false);

  //actions
  async function register(employeeRegister) {
    const res = await api.post('/auth-employee/register', employeeRegister);
    return res.data;
  }

  async function login(employeeLogin) {
    const res = await api.post('/auth-employee/login', employeeLogin);
    employee.value = res.data.data;
    return res.data;
  }

  async function logout() {
    const res = await api.post('/auth-employee/logout');
    employee.value = null;
    return res.data;
  }

  async function changePassword(employeeChangePassword) {
    const res = await api.post('/auth-employee/change-password', employeeChangePassword);
    return res.data;
  }

  function getFullName() {
    if (!employee.value) return '';
    return employee.value.HOTENNV;
  }

  return { employee, loading, register, login, logout, changePassword, getFullName };
}, {
  persist: {
    key: 'employee',
    storage: localStorage,
    pick: ['employee'] // Chỉ lưu state employee và localStorage
  }
});