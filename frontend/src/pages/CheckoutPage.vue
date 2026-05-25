<template>
  <div>
    <AppHeader />
    <div class="min-h-screen bg-warm-50 flex items-center justify-center px-4">
      <div class="text-center max-w-md">
        <div class="text-6xl mb-6">💳</div>
        <h1 class="text-2xl font-heading font-bold text-warm-900 mb-4">Thanh toán</h1>
        <p class="text-warm-500 mb-8">Tính năng thanh toán đang được phát triển.</p>
        <RouterLink to="/dashboard" class="btn-primary">← Về Dashboard</RouterLink>
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
