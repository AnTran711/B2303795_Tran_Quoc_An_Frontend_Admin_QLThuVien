<script setup>
  import { ref } from 'vue';

  const modelValue = defineModel();

  // filter
  const itemsFilter = ['Tất cả', 'Còn sách', 'Hết sách'];
  const selectedFilter = ref('Tất cả');

</script>

<template>
  <v-row class="pa-4 bg-white rounded elevation-1 align-center" no-gutters >
    <v-col class="d-flex align-center" cols="4">
      <v-text-field
        class="mr-2"
        label="Tìm kiếm sách"
        variant="outlined"
        hide-details
        density="compact"
      />
      <v-btn class="mr-4" color="primary">
        <v-icon>mdi-magnify</v-icon>
        Tìm
      </v-btn>
    </v-col>
    <v-col cols="4"></v-col>
    <v-col cols="2">
      <v-select
        label="Trạng thái"
        :items="itemsFilter"
        v-model="selectedFilter"
        hide-details
        variant="outlined"
        density="compact"
      ></v-select>
    </v-col>
    <v-col cols="2" class="text-right">
      <v-btn
        color="primary"
        @click="modelValue = true"
      >
        <v-icon>mdi-plus</v-icon>
        Thêm sách
      </v-btn>
    </v-col>
  </v-row>
</template>