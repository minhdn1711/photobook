<template>
  <div>
    <AppHeader />
    <div class="min-h-screen bg-warm-50 flex items-center justify-center px-4">
      <div class="text-center max-w-md">
        <div class="text-7xl mb-6">🎉</div>
        <h1 class="text-2xl font-heading font-bold text-warm-900 mb-3">Đặt hàng thành công!</h1>
        <p class="text-warm-500 mb-8">Chúng tôi đã nhận đơn hàng của bạn. Email xác nhận đã được gửi.</p>
        <div class="flex gap-4 justify-center">
          <RouterLink to="/dashboard/orders" class="btn-primary">Xem đơn hàng</RouterLink>
          <RouterLink to="/" class="btn-ghost">Trang chủ</RouterLink>
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
