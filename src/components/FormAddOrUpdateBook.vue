<script setup>
  
</script>

<template>
  <v-overlay
    v-model="showForm"
    class="align-center justify-center"
  >
    <v-card width="500" max-height="80vh" class="pa-4">
      <v-card-title>Thêm sách</v-card-title>
      <v-card-text class="pt-4" style="overflow-y: auto; max-height: 60vh;">
        <v-text-field label="Mã sách" variant="outlined" v-model="newBook.MASACH" />
        <v-text-field label="Tên sách" variant="outlined" v-model="newBook.TENSACH" />
        <v-file-input
          :rules="rules"
          accept="image/png, image/jpeg, image/jpg"
          prepend-icon=""
          prepend-inner-icon="mdi-image"
          label="Ảnh bìa"
          variant="outlined"
        ></v-file-input>
        <v-text-field label="Đơn giá" variant="outlined" v-model="newBook.DONGIA" />
        <v-text-field
          label="Số quyển"
          type="number"
          variant="outlined"
          v-model="newBook.SOQUYEN"
        />
        <v-text-field label="Năm xuất bản" variant="outlined" v-model="newBook.NAMXUATBAN" />
        <v-select
          v-model="newBook.MATACGIA"
          label="Tác giả"
          :items="authorStore.authors"
          item-title="HOTENTACGIA"
          item-value="MATACGIA"
          variant="outlined"
        ></v-select>
        <v-select
          v-model="newBook.MANXB"
          label="Nhà xuất bản"
          :items="publisherStore.publishers"
          item-title="TENNXB"
          item-value="MANXB"
          variant="outlined"
        ></v-select>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-spacer />
        <v-btn color="primary">Lưu</v-btn>
        <v-btn variant="text" @click="showForm = false">Đóng</v-btn>
      </v-card-actions>
    </v-card>
  </v-overlay>
</template>