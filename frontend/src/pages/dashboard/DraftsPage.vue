<template>
  <div class="bg-white rounded-xl shadow-sm border border-warm-200 p-6 min-h-[500px] flex flex-col">
    <h2 class="text-xl font-heading font-semibold text-warm-900 mb-6">Bản nháp của bạn</h2>
    
    <div v-if="drafts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="draft in drafts" :key="draft.id" class="border border-warm-200 rounded-lg overflow-hidden group hover:shadow-md transition-shadow">
        <div class="aspect-[3/4] bg-warm-100 relative">
          <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity">
            <RouterLink :to="`/editor/${draft.id}`" class="btn-primary">Tiếp tục thiết kế</RouterLink>
          </div>
        </div>
        <div class="p-4 bg-white">
          <h3 class="font-medium text-warm-900 mb-1">{{ draft.title }}</h3>
          <p class="text-xs text-warm-500">Chỉnh sửa lần cuối: {{ draft.last_edited }}</p>
        </div>
      </div>
      
      <!-- Create New -->
      <RouterLink to="/templates" class="border-2 border-dashed border-warm-300 rounded-lg flex flex-col items-center justify-center text-warm-500 hover:text-accent-600 hover:border-accent-400 hover:bg-warm-50 transition-colors aspect-[3/4]">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span class="font-medium">Tạo thiết kế mới</span>
      </RouterLink>
    </div>

    <!-- Empty State -->
    <div v-else class="flex-1 flex flex-col items-center justify-center text-center py-12">
      <div class="w-24 h-24 bg-warm-100 rounded-full flex items-center justify-center mb-6 text-4xl">
        🎨
      </div>
      <h3 class="text-xl font-heading font-semibold text-warm-900 mb-2">Chưa có bản nháp nào</h3>
      <p class="text-warm-500 max-w-md mb-8">Bạn chưa bắt đầu dự án nào. Chọn một mẫu thiết kế và bắt đầu sáng tạo nhé!</p>
      <RouterLink to="/templates" class="btn-primary">Khám phá mẫu thiết kế</RouterLink>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

// Toggle to empty array to test empty state
const drafts = ref([
  { id: 1, title: 'Album Cưới Ánh Hồng', last_edited: 'Hôm qua lúc 15:30' },
  { id: 2, title: 'Chuyến đi Phú Quốc', last_edited: '3 ngày trước' },
])
</script>
