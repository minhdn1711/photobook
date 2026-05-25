<template>
  <div class="space-y-6">
    <div class="bg-white rounded-xl shadow-sm border border-warm-200 p-6">
      <h2 class="text-xl font-heading font-semibold text-warm-900 mb-4">Tổng quan</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-warm-50 p-4 rounded-lg">
          <div class="text-sm text-warm-500 mb-1">Dự án nháp</div>
          <div class="text-2xl font-bold text-warm-900">2</div>
        </div>
        <div class="bg-warm-50 p-4 rounded-lg">
          <div class="text-sm text-warm-500 mb-1">Đơn hàng đang in</div>
          <div class="text-2xl font-bold text-accent-600">1</div>
        </div>
        <div class="bg-warm-50 p-4 rounded-lg">
          <div class="text-sm text-warm-500 mb-1">Đã giao</div>
          <div class="text-2xl font-bold text-green-600">3</div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white rounded-xl shadow-sm border border-warm-200 p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-heading font-semibold text-warm-900">Làm tiếp dự án</h2>
          <RouterLink to="/dashboard/drafts" class="text-sm text-accent-600 hover:text-accent-700">Xem tất cả →</RouterLink>
        </div>
        <div class="space-y-4">
          <div class="flex items-center gap-4 p-3 hover:bg-warm-50 rounded-lg border border-transparent hover:border-warm-200 transition-colors">
            <div class="w-16 h-16 bg-warm-200 rounded-md"></div>
            <div class="flex-1">
              <div class="font-medium text-warm-900">Album Cưới của tôi</div>
              <div class="text-xs text-warm-500">Sửa lần cuối: Hôm qua</div>
            </div>
            <RouterLink to="/editor/1" class="px-3 py-1 text-sm bg-warm-900 text-white rounded hover:bg-black">Tiếp tục</RouterLink>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-warm-200 p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-heading font-semibold text-warm-900">Đơn hàng gần đây</h2>
          <RouterLink to="/dashboard/orders" class="text-sm text-accent-600 hover:text-accent-700">Xem tất cả →</RouterLink>
        </div>
        <div class="space-y-4">
          <div class="flex justify-between items-center p-3 border border-warm-100 rounded-lg">
            <div>
              <div class="font-medium text-warm-900">ORD-12345</div>
              <div class="text-xs text-warm-500">20/05/2026 • Kỷ yếu lớp 12A1</div>
            </div>
            <span class="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full">Đang in ấn</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
