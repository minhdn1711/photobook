<template>
  <AdminLayout>
    <div class="bg-white rounded-xl shadow-sm border border-warm-200 p-6 min-h-[500px]">
      
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-heading font-semibold text-warm-900">Mẫu thiết kế (Templates)</h2>
        <button class="px-4 py-2 bg-warm-900 hover:bg-black text-white rounded-md font-medium text-sm flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          Thêm Mẫu Mới
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <!-- Template Card 1 -->
        <div class="border border-warm-200 rounded-lg overflow-hidden group hover:shadow-md transition-shadow">
          <div class="aspect-[4/3] bg-warm-100 relative overflow-hidden">
            <!-- Tạm dùng màu nền, trong thực tế sẽ là cover_image -->
            <div class="absolute inset-0 bg-gradient-to-br from-pink-100 to-rose-200 flex items-center justify-center text-4xl">💒</div>
            <div class="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded shadow-sm">
              ACTIVE
            </div>
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 transition-opacity gap-2">
              <button class="px-3 py-1.5 bg-white text-warm-900 rounded text-sm font-medium hover:bg-warm-100">Sửa</button>
              <button class="px-3 py-1.5 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700">Tạm ẩn</button>
            </div>
          </div>
          <div class="p-4 bg-white">
            <div class="flex justify-between items-start mb-1">
              <h3 class="font-medium text-warm-900">Đám Cưới — Ánh Hồng</h3>
              <span class="text-accent-600 font-medium text-sm">450.000đ</span>
            </div>
            <p class="text-xs text-warm-500 mb-3">Chủ đề: Wedding • 16 trang</p>
            <div class="flex items-center justify-between text-xs text-warm-400">
              <span>Cập nhật: 10/05/2026</span>
              <span class="flex items-center gap-1"><svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg> 1.2k</span>
            </div>
          </div>
        </div>

        <!-- Template Card 2 -->
        <div class="border border-warm-200 rounded-lg overflow-hidden group hover:shadow-md transition-shadow">
          <div class="aspect-[4/3] bg-warm-100 relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-blue-100 to-cyan-200 flex items-center justify-center text-4xl">✈️</div>
            <div class="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded shadow-sm">
              ACTIVE
            </div>
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 transition-opacity gap-2">
              <button class="px-3 py-1.5 bg-white text-warm-900 rounded text-sm font-medium hover:bg-warm-100">Sửa</button>
              <button class="px-3 py-1.5 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700">Tạm ẩn</button>
            </div>
          </div>
          <div class="p-4 bg-white">
            <div class="flex justify-between items-start mb-1">
              <h3 class="font-medium text-warm-900">Du Lịch — Mùa Hè</h3>
              <span class="text-accent-600 font-medium text-sm">350.000đ</span>
            </div>
            <p class="text-xs text-warm-500 mb-3">Chủ đề: Travel • 16 trang</p>
            <div class="flex items-center justify-between text-xs text-warm-400">
              <span>Cập nhật: 12/05/2026</span>
              <span class="flex items-center gap-1"><svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg> 850</span>
            </div>
          </div>
        </div>

        <!-- Template Card 3 -->
        <div class="border border-warm-200 rounded-lg overflow-hidden group hover:shadow-md transition-shadow">
          <div class="aspect-[4/3] bg-warm-100 relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-orange-100 to-amber-200 flex items-center justify-center text-4xl">👨‍👩‍👧‍👦</div>
            <div class="absolute top-2 right-2 px-2 py-1 bg-warm-500 text-white text-xs font-bold rounded shadow-sm">
              DRAFT
            </div>
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 transition-opacity gap-2">
              <button class="px-3 py-1.5 bg-white text-warm-900 rounded text-sm font-medium hover:bg-warm-100">Sửa</button>
              <button class="px-3 py-1.5 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700">Công bố</button>
            </div>
          </div>
          <div class="p-4 bg-white">
            <div class="flex justify-between items-start mb-1">
              <h3 class="font-medium text-warm-900">Gia Đình — Kỷ Niệm</h3>
              <span class="text-accent-600 font-medium text-sm">450.000đ</span>
            </div>
            <p class="text-xs text-warm-500 mb-3">Chủ đề: Family • 16 trang</p>
            <div class="flex items-center justify-between text-xs text-warm-400">
              <span>Cập nhật: Hôm nay</span>
              <span class="flex items-center gap-1"><svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg> 0</span>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
</script>
