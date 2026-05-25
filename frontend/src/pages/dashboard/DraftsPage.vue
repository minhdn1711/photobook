<template>
  <div>
    <AppHeader />
    <div class="min-h-screen bg-warm-50 pt-16 py-12">
      <div class="container mx-auto px-4 max-w-5xl">
        <h1 class="text-3xl font-heading font-bold text-warm-900 mb-8">Bản nháp</h1>
        <div class="bg-white rounded-2xl border border-warm-100 p-12 text-center">
          <p class="text-6xl mb-4">📝</p>
          <p class="text-warm-500">Chưa có bản nháp nào</p>
          <RouterLink to="/templates" class="btn-primary mt-6 inline-block">Bắt đầu thiết kế</RouterLink>
        </div>
      </div>
    </div>
    <AppFooter />
  </div>
</template>
<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
</script>
