<script setup>
  import { computed, onMounted, ref } from 'vue';
  import Header from '@/components/Header.vue';
  import SideBar from '@/components/SideBar.vue';
  import { useBookStore } from '@/stores/useBookStore';
  import { usePublisherStore } from '@/stores/usePublisherStore';
  import Loading from '@/components/Loading.vue';

  const bookStore = useBookStore();
  const publisherStore = usePublisherStore();

  // fetch dữ liệu
  onMounted(async () => {
    await bookStore.fetchBooks();
    await publisherStore.fetchPublishers();
  });

  const drawer = ref(true);

  const isLoading = computed(() => bookStore.loading || publisherStore.loading);
</script>

<template>
  <v-app>
    <!-- Header -->
    <Header @toggle-drawer="drawer = !drawer"></Header>

    <!-- SideBar -->
    <SideBar v-model="drawer" />

    
    <!-- Loading -->
    <Loading :model-value="isLoading"></Loading>
    
    <!-- Main -->
    <v-main class="bg-grey-lighten-4">
      <router-view />
    </v-main>
  </v-app> 
</template>