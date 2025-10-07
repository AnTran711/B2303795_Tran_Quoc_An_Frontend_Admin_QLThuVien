<script setup>
  const emit = defineEmits(['toggle-drawer']);
</script>

<template>
  <v-app-bar color="primary">
    <v-app-bar-nav-icon @click="emit('toggle-drawer')" />
    <v-app-bar-title>My Library</v-app-bar-title>

    <v-spacer />

    <span class="mr-6">Nhân viên</span>
    <v-btn variant="text">Đăng xuất</v-btn>
  </v-app-bar>
</template>