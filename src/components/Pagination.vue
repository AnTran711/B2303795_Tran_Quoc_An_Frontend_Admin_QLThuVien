<script setup>
  import { useBookStore } from '@/stores/useBookStore';
  import { computed } from 'vue';

  const bookStore = useBookStore();

  const modelValue = defineModel();

  const props = defineProps({
    bookInPage: Number
  })

  // paging
  const totalPage = computed(() => Math.ceil(bookStore.books.length/props.bookInPage));
</script>

<template>
  <div
    v-show="bookStore.books.length ? true : false"
    class="text-center mt-3"
  >
    <v-pagination
      v-model="modelValue"
      active-color="primary"
      :length="totalPage"
      :total-visible="7"
    ></v-pagination>
  </div>
</template>