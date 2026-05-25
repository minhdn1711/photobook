<template>
  <div>
    <AppHeader />
    <div class="min-h-screen bg-warm-50 py-12">
      <div class="container mx-auto px-4 max-w-5xl">
        <h1 class="text-3xl font-heading font-bold text-warm-900 mb-8">
          Xin chào, {{ authStore.user?.name?.split(' ').at(-1) }} 👋
        </h1>

        <!-- Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div v-for="stat in stats" :key="stat.label"
            class="bg-white rounded-2xl border border-warm-100 p-5 text-center">
            <p class="text-3xl font-bold text-accent">{{ stat.value }}</p>
            <p class="text-warm-500 text-sm mt-1">{{ stat.label }}</p>
          </div>
        </div>

        <!-- Quick actions -->
        <div class="bg-white rounded-2xl border border-warm-100 p-8 text-center">
          <h2 class="text-xl font-heading font-bold text-warm-800 mb-4">Tạo photobook mới</h2>
          <p class="text-warm-500 mb-6">Khám phá hơn 3 mẫu thiết kế đẹp</p>
          <RouterLink to="/templates" class="btn-primary">Chọn mẫu thiết kế</RouterLink>
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
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
const stats = [
  { label: 'Dự án', value: 0 },
  { label: 'Đơn hàng', value: 0 },
  { label: 'Bản nháp', value: 0 },
  { label: 'Hoàn thành', value: 0 },
]
</script>
