<script setup>
import { useEmployeeStore } from '@/stores/useEmployeeStore';

const modelValue = defineModel();

const employeeStore = useEmployeeStore();
</script>

<template>
  <v-navigation-drawer v-model="modelValue">
    <v-list>
      <v-list-item
        to="/dashboard"
        prepend-icon="mdi-view-dashboard"
        title="Dashboard"
      />
      <v-list-item
        v-if="employeeStore?.employee?.CHUCVU === 'Quản lý'"
        to="/book-management"
        prepend-icon="mdi-bookshelf"
        title="Quản lý sách"
      />
      <v-list-item
        to="/book-borrowing-management"
        prepend-icon="mdi-book-clock"
        title="Quản lý mượn sách"
      />
      <v-list-item
        v-if="employeeStore?.employee?.CHUCVU === 'Quản lý'"
        to="/publisher-management"
        prepend-icon="mdi-printer"
        title="Nhà xuất bản"
      />
      <v-list-item
        v-if="employeeStore?.employee?.CHUCVU === 'Quản lý'"
        to="/genre-management"
        prepend-icon="mdi-tag-multiple"
        title="Thể loại"
      />
      <v-list-item
        v-if="employeeStore?.employee?.CHUCVU === 'Quản lý'"
        to="/register"
        prepend-icon="mdi-account-plus"
        title="Tạo tài khoản"
      />
    </v-list>
  </v-navigation-drawer>
</template>
