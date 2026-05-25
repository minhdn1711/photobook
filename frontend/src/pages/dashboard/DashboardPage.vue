<template>
  <div class="space-y-6">
    <!-- Stats -->
    <div class="bg-white rounded-xl shadow-sm border border-warm-200 p-6">
      <h2 class="text-xl font-heading font-semibold text-warm-900 mb-4">Tổng quan</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-warm-50 p-4 rounded-lg">
          <div class="text-sm text-warm-500 mb-1">Dự án nháp</div>
          <div class="text-2xl font-bold text-warm-900">{{ draftCount }}</div>
        </div>
        <div class="bg-warm-50 p-4 rounded-lg">
          <div class="text-sm text-warm-500 mb-1">Đơn hàng đang in</div>
          <div class="text-2xl font-bold text-accent-600">{{ printingCount }}</div>
        </div>
        <div class="bg-warm-50 p-4 rounded-lg">
          <div class="text-sm text-warm-500 mb-1">Đã hoàn thành</div>
          <div class="text-2xl font-bold text-green-600">{{ completedCount }}</div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Recent Drafts -->
      <div class="bg-white rounded-xl shadow-sm border border-warm-200 p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-heading font-semibold text-warm-900">Làm tiếp dự án</h2>
          <RouterLink to="/dashboard/drafts" class="text-sm text-accent-600 hover:text-accent-700">Xem tất cả →</RouterLink>
        </div>

        <div v-if="loadingProjects" class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-accent"></div>
        </div>

        <div v-else-if="recentDrafts.length > 0" class="space-y-3">
          <div
            v-for="draft in recentDrafts"
            :key="draft.id"
            class="flex items-center gap-4 p-3 hover:bg-warm-50 rounded-lg border border-transparent hover:border-warm-200 transition-colors"
          >
            <!-- Thumbnail -->
            <div class="w-14 h-14 bg-warm-100 rounded-md overflow-hidden flex-shrink-0">
              <img
                v-if="draft.template?.cover_image_url"
                :src="draft.template.cover_image_url"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-warm-300 text-2xl">📷</div>
            </div>
            <div class="flex-1 min-w-0">
              <div class="font-medium text-warm-900 truncate">{{ draft.name }}</div>
              <div class="text-xs text-warm-500">{{ formatDate(draft.last_saved_at) }}</div>
            </div>
            <RouterLink
              :to="`/editor/${draft.id}`"
              class="flex-shrink-0 px-3 py-1 text-sm bg-warm-900 text-white rounded hover:bg-black"
            >
              Tiếp tục
            </RouterLink>
          </div>
        </div>

        <div v-else class="text-center py-8 text-warm-400">
          <p class="mb-3">Chưa có dự án nháp nào</p>
          <RouterLink to="/templates" class="text-sm text-accent-600 hover:underline">Tạo dự án mới →</RouterLink>
        </div>
      </div>

      <!-- Recent Orders -->
      <div class="bg-white rounded-xl shadow-sm border border-warm-200 p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-heading font-semibold text-warm-900">Đơn hàng gần đây</h2>
          <RouterLink to="/dashboard/orders" class="text-sm text-accent-600 hover:text-accent-700">Xem tất cả →</RouterLink>
        </div>
        <div class="text-center py-8 text-warm-400 text-sm">
          Chưa có đơn hàng nào
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { api } from '@/lib/api'

interface Project {
  id: string
  name: string
  status: string
  last_saved_at: string | null
  template?: { id: number; name: string; cover_image_url: string | null }
}

const loadingProjects = ref(true)
const projects = ref<Project[]>([])

const recentDrafts = computed(() =>
  projects.value.filter(p => p.status === 'draft').slice(0, 3)
)
const draftCount     = computed(() => projects.value.filter(p => p.status === 'draft').length)
const printingCount  = computed(() => projects.value.filter(p => p.status === 'rendering').length)
const completedCount = computed(() => projects.value.filter(p => p.status === 'completed').length)

onMounted(async () => {
  try {
    const res = await api.get<{ data: Project[] }>('/projects')
    projects.value = res.data.data ?? []
  } catch {
    projects.value = []
  } finally {
    loadingProjects.value = false
  }
})

function formatDate(iso: string | null): string {
  if (!iso) return 'Chưa lưu'
  const d = new Date(iso)
  const diffDays = Math.floor((Date.now() - d.getTime()) / 86400000)
  if (diffDays === 0) return 'Hôm nay'
  if (diffDays === 1) return 'Hôm qua'
  return `${diffDays} ngày trước`
}
</script>
