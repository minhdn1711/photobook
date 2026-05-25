<template>
  <div class="min-h-screen bg-warm-50">
    <nav class="bg-warm-900 text-white px-6 py-4 flex items-center justify-between">
      <span class="font-heading font-bold">Admin — Chi tiết đơn</span>
      <RouterLink to="/admin/orders" class="text-warm-400 hover:text-white text-sm transition">← Danh sách đơn</RouterLink>
    </nav>
    <div class="p-8 max-w-4xl mx-auto">
      <h1 class="text-2xl font-heading font-bold text-warm-900 mb-6">Chi tiết đơn hàng #{{ $route.params.id }}</h1>
      <div class="bg-white rounded-2xl border border-warm-100 p-8 text-center text-warm-500">
        Đang phát triển...
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
