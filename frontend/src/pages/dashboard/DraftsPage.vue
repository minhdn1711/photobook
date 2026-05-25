<template>
  <div class="bg-white rounded-xl shadow-sm border border-warm-200 p-6 min-h-[500px] flex flex-col">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-heading font-semibold text-warm-900">Bản nháp của bạn</h2>
      <span class="text-sm text-warm-400">{{ drafts.length }} dự án</span>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex-1 flex items-center justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
    </div>

    <!-- Projects grid -->
    <div v-else-if="drafts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="draft in drafts"
        :key="draft.id"
        class="border border-warm-200 rounded-lg overflow-hidden group hover:shadow-md transition-shadow"
      >
        <!-- Thumbnail -->
        <div class="aspect-[3/4] bg-warm-100 relative">
          <img
            v-if="draft.template?.cover_image_url"
            :src="draft.template.cover_image_url"
            :alt="draft.name"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center text-warm-400 text-4xl">📷</div>
          <!-- Hover overlay -->
          <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity">
            <RouterLink :to="`/editor/${draft.id}`" class="btn-primary text-sm">Tiếp tục thiết kế</RouterLink>
          </div>
        </div>
        <!-- Info -->
        <div class="p-4 bg-white">
          <h3 class="font-medium text-warm-900 mb-1 truncate">{{ draft.name }}</h3>
          <p class="text-xs text-warm-500">
            Lưu lần cuối: {{ formatDate(draft.last_saved_at) }}
          </p>
          <p class="text-xs text-warm-400 mt-0.5">{{ draft.template?.name }}</p>
        </div>
      </div>

      <!-- Create New card -->
      <RouterLink
        to="/templates"
        class="border-2 border-dashed border-warm-300 rounded-lg flex flex-col items-center justify-center text-warm-500 hover:text-accent-600 hover:border-accent-400 hover:bg-warm-50 transition-colors aspect-[3/4]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span class="font-medium">Tạo thiết kế mới</span>
      </RouterLink>
    </div>

    <!-- Empty State -->
    <div v-else class="flex-1 flex flex-col items-center justify-center text-center py-12">
      <div class="w-24 h-24 bg-warm-100 rounded-full flex items-center justify-center mb-6 text-4xl">🎨</div>
      <h3 class="text-xl font-heading font-semibold text-warm-900 mb-2">Chưa có bản nháp nào</h3>
      <p class="text-warm-500 max-w-md mb-8">Bạn chưa bắt đầu dự án nào. Chọn một mẫu thiết kế và bắt đầu sáng tạo nhé!</p>
      <RouterLink to="/templates" class="btn-primary">Khám phá mẫu thiết kế</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { api } from '@/lib/api'

interface DraftProject {
  id: string
  name: string
  status: string
  last_saved_at: string | null
  created_at: string
  template?: { id: number; name: string; cover_image_url: string | null }
}

const loading = ref(true)
const drafts  = ref<DraftProject[]>([])

onMounted(async () => {
  try {
    const res = await api.get<{ data: DraftProject[] }>('/projects')
    drafts.value = (res.data.data ?? []).filter(p => p.status === 'draft')
  } catch {
    drafts.value = []
  } finally {
    loading.value = false
  }
})

function formatDate(iso: string | null): string {
  if (!iso) return 'Chưa lưu'
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1)  return 'Vừa xong'
  if (diffMins < 60) return `${diffMins} phút trước`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours} giờ trước`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return 'Hôm qua'
  if (diffDays < 7)  return `${diffDays} ngày trước`
  return d.toLocaleDateString('vi-VN')
}
</script>
