<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-warm-50 px-4">
    <div class="text-center max-w-md">
      <p class="text-8xl font-heading font-bold text-accent/30 mb-4">404</p>
      <h1 class="text-2xl font-heading font-bold text-warm-900 mb-3">Không tìm thấy trang</h1>
      <p class="text-warm-500 mb-8">Trang bạn tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>
      <RouterLink to="/" class="btn-primary">← Về trang chủ</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
