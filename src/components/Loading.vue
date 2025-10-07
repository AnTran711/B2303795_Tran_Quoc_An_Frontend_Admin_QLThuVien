<script setup>
  const modelValue = defineModel();
</script>

<template>
  <v-overlay
    v-model="modelValue"
    persistent
    class="align-center justify-center"
  >
    <v-progress-circular indeterminate size="64" color="primary" />
  </v-overlay>
</template>