<template>
  <div class="min-h-screen bg-warm-50">
    <!-- Admin nav -->
    <nav class="bg-warm-900 text-white px-6 py-4 flex items-center justify-between">
      <span class="font-heading font-bold">Admin — Photobook</span>
      <RouterLink to="/" class="text-warm-400 hover:text-white text-sm transition">← Trang chủ</RouterLink>
    </nav>
    <div class="p-8 max-w-6xl mx-auto">
      <h1 class="text-2xl font-heading font-bold text-warm-900 mb-8">Tổng quan</h1>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div v-for="s in stats" :key="s.label" class="bg-white rounded-2xl border border-warm-100 p-5 text-center">
          <p class="text-3xl font-bold text-accent">{{ s.value }}</p>
          <p class="text-warm-500 text-sm mt-1">{{ s.label }}</p>
        </div>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <RouterLink v-for="link in links" :key="link.to" :to="link.to"
          class="bg-white rounded-2xl border border-warm-100 p-6 hover:border-accent hover:shadow-sm transition">
          <p class="text-2xl mb-2">{{ link.icon }}</p>
          <p class="font-medium text-warm-800">{{ link.label }}</p>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { RouterLink } from 'vue-router'
const stats = [{ label: 'Đơn hàng', value: 0 }, { label: 'Templates', value: 3 }, { label: 'Users', value: 2 }, { label: 'Pending', value: 0 }]
const links = [
  { to: '/admin/orders', icon: '📦', label: 'Quản lý đơn hàng' },
  { to: '/admin/templates', icon: '🎨', label: 'Quản lý template' },
  { to: '/admin/render-queue', icon: '🖨️', label: 'Hàng đợi render' },
  { to: '/admin/users', icon: '👥', label: 'Người dùng' },
]
</script>
