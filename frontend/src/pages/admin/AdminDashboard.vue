<template>
  <AdminLayout>
    <div class="space-y-6">
      
      <!-- KPI Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-xl border border-warm-200 shadow-sm">
          <div class="text-sm font-medium text-warm-500 mb-2">Đơn hàng mới (hôm nay)</div>
          <div class="text-3xl font-bold text-warm-900">12</div>
          <div class="text-xs text-green-600 mt-2 flex items-center">
            <svg class="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
            +15% so với hôm qua
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl border border-warm-200 shadow-sm">
          <div class="text-sm font-medium text-warm-500 mb-2">Đang chờ Render</div>
          <div class="text-3xl font-bold text-accent-600">3</div>
          <div class="text-xs text-warm-400 mt-2">Cần xử lý ngay</div>
        </div>

        <div class="bg-white p-6 rounded-xl border border-warm-200 shadow-sm">
          <div class="text-sm font-medium text-warm-500 mb-2">Doanh thu (Tháng này)</div>
          <div class="text-3xl font-bold text-warm-900">18.5M</div>
          <div class="text-xs text-green-600 mt-2 flex items-center">
            <svg class="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
            +5% so với tháng trước
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl border border-warm-200 shadow-sm">
          <div class="text-sm font-medium text-warm-500 mb-2">Khách hàng mới</div>
          <div class="text-3xl font-bold text-warm-900">45</div>
        </div>
      </div>

      <!-- Quick Actions & Charts Placeholder -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div class="lg:col-span-2 bg-white rounded-xl border border-warm-200 shadow-sm p-6">
          <h3 class="text-lg font-heading font-semibold text-warm-900 mb-4">Biểu đồ doanh thu (30 ngày)</h3>
          <!-- Fake Chart -->
          <div class="h-64 flex items-end justify-between gap-2 border-b border-l border-warm-200 p-4 pb-0">
            <div v-for="i in 15" :key="i" class="w-full bg-accent-100 hover:bg-accent-200 rounded-t-sm relative group cursor-pointer transition-all" :style="{ height: `${Math.random() * 80 + 20}%` }">
              <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-warm-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
                {{ Math.floor(Math.random() * 5) + 1 }}M 
              </div>
            </div>
          </div>
          <div class="flex justify-between mt-2 text-xs text-warm-400 px-4">
            <span>01/05</span>
            <span>15/05</span>
            <span>30/05</span>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-warm-200 shadow-sm p-6 flex flex-col">
          <h3 class="text-lg font-heading font-semibold text-warm-900 mb-4">Việc cần làm</h3>
          <ul class="space-y-4 flex-1">
            <li class="flex items-start gap-3">
              <div class="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">!</div>
              <div>
                <div class="font-medium text-warm-900 text-sm">3 Đơn hàng cần duyệt</div>
                <RouterLink to="/admin/orders" class="text-xs text-accent-600 hover:underline">Xem ngay</RouterLink>
              </div>
            </li>
            <li class="flex items-start gap-3">
              <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              </div>
              <div>
                <div class="font-medium text-warm-900 text-sm">2 Jobs đang Render</div>
                <RouterLink to="/admin/render-queue" class="text-xs text-accent-600 hover:underline">Kiểm tra tiến độ</RouterLink>
              </div>
            </li>
          </ul>
        </div>
        
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
</script>
