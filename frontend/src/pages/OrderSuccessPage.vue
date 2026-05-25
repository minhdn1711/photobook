<template>
  <div>
    <AppHeader />
    <div class="min-h-screen bg-warm-50 pt-20 pb-16 flex items-center justify-center px-4">
      <div class="bg-white rounded-xl shadow-lg border border-warm-200 p-8 max-w-lg w-full text-center">
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 class="text-3xl font-heading font-bold text-warm-900 mb-2">Thanh toán thành công!</h1>
        <p class="text-warm-500 mb-6">Cảm ơn bạn đã đặt in Photobook. Đơn hàng của bạn đang được xử lý.</p>
        
        <div class="bg-warm-50 rounded-lg p-4 mb-8 text-left">
          <div class="flex justify-between mb-2">
            <span class="text-warm-500">Mã đơn hàng:</span>
            <span class="font-medium text-warm-900">{{ route.params.id || 'ORD-99999' }}</span>
          </div>
          <div class="flex justify-between mb-2">
            <span class="text-warm-500">Trạng thái:</span>
            <span class="font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-sm">Đang in ấn</span>
          </div>
          <div class="flex justify-between">
            <span class="text-warm-500">Thời gian giao dự kiến:</span>
            <span class="font-medium text-warm-900">3 - 5 ngày làm việc</span>
          </div>
        </div>
        
        <div class="flex flex-col gap-3">
          <RouterLink to="/dashboard/orders" class="btn-primary w-full justify-center">Theo dõi đơn hàng</RouterLink>
          <RouterLink to="/templates" class="btn-ghost w-full justify-center">Tạo Photobook mới</RouterLink>
        </div>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { useRoute, RouterLink } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const route = useRoute()
</script>
