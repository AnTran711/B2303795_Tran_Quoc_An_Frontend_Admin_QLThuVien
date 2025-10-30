<script setup>
  const modelValue = defineModel();
</script>

<template>
  <v-navigation-drawer
    v-model="modelValue"
  >
    <v-list>
      <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" />
      <v-list-item to="/quan-ly-sach" prepend-icon="mdi-bookshelf" title="Quản lý sách" />
      <v-list-item prepend-icon="mdi-book-clock" title="Quản lý mượn sách" />
      <v-list-item to="/nha-xuat-ban" prepend-icon="mdi-printer" title="Nhà xuất bản" />
      <v-list-item to="/the-loai" prepend-icon="mdi-tag-multiple" title="Thể loại" />
    </v-list>
  </v-navigation-drawer>
</template>