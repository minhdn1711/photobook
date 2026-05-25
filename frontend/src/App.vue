<template>
  <!-- RouterView renders the current page component -->
  <RouterView />

  <!-- Global Toast Notifications -->
  <ToastContainer />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import ToastContainer from '@/components/ui/ToastContainer.vue'
</script>
