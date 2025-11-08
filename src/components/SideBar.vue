<script setup>
  const modelValue = defineModel();
</script>

<template>
  <v-navigation-drawer
    v-model="modelValue"
  >
    <v-list>
      <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" />
      <v-list-item to="/book-management" prepend-icon="mdi-bookshelf" title="Quản lý sách" />
      <v-list-item to="/book-borrowing-management" prepend-icon="mdi-book-clock" title="Quản lý mượn sách" />
      <v-list-item to="/publisher-management" prepend-icon="mdi-printer" title="Nhà xuất bản" />
      <v-list-item to="/genre-management" prepend-icon="mdi-tag-multiple" title="Thể loại" />
      <v-list-item to="/register" prepend-icon="mdi-account-plus" title="Tạo tài khoản" />
    </v-list>
  </v-navigation-drawer>
</template>