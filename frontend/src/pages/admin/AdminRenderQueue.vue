<template>
  <div class="min-h-screen bg-warm-50">
    <nav class="bg-warm-900 text-white px-6 py-4 flex items-center justify-between">
      <span class="font-heading font-bold">Admin — Render Queue</span>
      <RouterLink to="/admin/dashboard" class="text-warm-400 hover:text-white text-sm transition">← Dashboard</RouterLink>
    </nav>
    <div class="p-8 max-w-6xl mx-auto">
      <h1 class="text-2xl font-heading font-bold text-warm-900 mb-6">Hàng đợi Render PDF</h1>
      <div class="bg-white rounded-2xl border border-warm-100 p-12 text-center">
        <p class="text-6xl mb-4">🖨️</p><p class="text-warm-500">Hàng đợi trống</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
