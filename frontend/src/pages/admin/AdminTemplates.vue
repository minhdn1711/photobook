<template>
  <div class="min-h-screen bg-warm-50">
    <nav class="bg-warm-900 text-white px-6 py-4 flex items-center justify-between">
      <span class="font-heading font-bold">Admin — Templates</span>
      <RouterLink to="/admin/dashboard" class="text-warm-400 hover:text-white text-sm transition">← Dashboard</RouterLink>
    </nav>
    <div class="p-8 max-w-6xl mx-auto">
      <h1 class="text-2xl font-heading font-bold text-warm-900 mb-6">Quản lý Template</h1>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div v-for="t in templates" :key="t" class="bg-white rounded-2xl border border-warm-100 p-6">
          <div class="aspect-square bg-warm-100 rounded-xl mb-3"></div>
          <p class="font-medium text-warm-800">{{ t }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { RouterLink } from 'vue-router'
const templates = ['Ánh Hồng (Wedding)', 'Hành Trình (Travel)', 'Ký Ức (Family)']
</script>
