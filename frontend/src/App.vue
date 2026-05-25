<template>
  <!-- RouterView renders the current page component -->
  <RouterView />

  <!-- Global UI -->
  <ToastContainer />
  <BackToTop />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import ToastContainer from '@/components/ui/ToastContainer.vue'
import BackToTop from '@/components/ui/BackToTop.vue'
</script>
