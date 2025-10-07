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
    </v-list>
  </v-navigation-drawer>
</template>