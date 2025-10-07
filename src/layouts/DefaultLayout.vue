<script setup>
  import { ref } from 'vue';
  import Header from '@/components/Header.vue';
  import SideBar from '@/components/SideBar.vue';

  const drawer = ref(true);
</script>

<template>
  <v-app>
    <!-- Header -->
    <Header @toggle-drawer="drawer = !drawer"></Header>

    <!-- SideBar -->
    <SideBar v-model="drawer" />
    
    <!-- Main -->
    <v-main class="bg-grey-lighten-4">
      <router-view />
    </v-main>
  </v-app> 
</template>