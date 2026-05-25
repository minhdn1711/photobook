<template>
  <div>
    <AppHeader />

    <!-- Loading -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="min-h-screen flex flex-col items-center justify-center gap-4">
      <p class="text-warm-500">{{ error }}</p>
      <RouterLink to="/templates" class="btn-ghost">← Quay lại danh sách</RouterLink>
    </div>

    <!-- Content -->
    <template v-else-if="template">
      <!-- Hero -->
      <section class="bg-warm-900 text-white py-16">
        <div class="container mx-auto px-4 max-w-6xl">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <!-- Cover image -->
            <div class="rounded-2xl overflow-hidden shadow-2xl aspect-square bg-warm-800">
              <img
                v-if="template.cover_image_url"
                :src="template.cover_image_url"
                :alt="template.name"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-warm-500">
                <svg class="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            <!-- Info -->
            <div>
              <div class="flex gap-2 mb-4">
                <span v-if="template.is_popular" class="badge-popular">Phổ biến</span>
                <span v-if="template.is_new" class="badge-new">Mới</span>
                <span class="px-3 py-1 text-xs font-medium bg-warm-700 text-warm-200 rounded-full capitalize">
                  {{ categoryLabel }}
                </span>
              </div>

              <h1 class="text-4xl font-heading font-bold mb-4">{{ template.name }}</h1>
              <p class="text-warm-300 text-lg mb-6">{{ template.description }}</p>

              <!-- Rating -->
              <div class="flex items-center gap-2 mb-6">
                <div class="flex">
                  <span v-for="i in 5" :key="i" class="text-accent text-xl">
                    {{ i <= Math.round(template.rating) ? '★' : '☆' }}
                  </span>
                </div>
                <span class="text-warm-300 text-sm">({{ template.review_count }} đánh giá)</span>
              </div>

              <!-- Price -->
              <div class="bg-warm-800 rounded-xl p-6 mb-8">
                <div class="flex items-baseline gap-3 mb-2">
                  <span class="text-3xl font-bold text-accent">{{ formatPrice(template.price) }}</span>
                  <span class="text-warm-400 text-sm">/ quyển</span>
                </div>
                <p class="text-warm-400 text-sm">
                  Đặt cọc {{ template.deposit_percent }}% — {{ formatPrice(template.price * template.deposit_percent / 100) }}
                </p>
              </div>

              <!-- CTA -->
              <div class="flex flex-col sm:flex-row gap-4">
                <button @click="startProject" class="btn-primary text-center py-4 text-lg flex-1">
                  Bắt đầu tạo photobook
                </button>
                <RouterLink to="/templates" class="btn-ghost text-center py-4 text-lg">
                  ← Xem thêm mẫu
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Template details -->
      <section class="py-16 bg-white">
        <div class="container mx-auto px-4 max-w-6xl">
          <h2 class="text-3xl font-heading font-bold text-warm-900 text-center mb-12">
            Chi tiết mẫu thiết kế
          </h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div class="bg-warm-50 rounded-xl p-6">
              <p class="text-4xl font-bold text-accent mb-2">{{ template.page_count }}</p>
              <p class="text-warm-600 text-sm">Số trang</p>
            </div>
            <div class="bg-warm-50 rounded-xl p-6">
              <p class="text-4xl font-bold text-accent mb-2">{{ template.pages?.length || template.page_count }}</p>
              <p class="text-warm-600 text-sm">Bố cục</p>
            </div>
            <div class="bg-warm-50 rounded-xl p-6">
              <p class="text-2xl font-bold text-accent mb-2">{{ template.deposit_percent }}%</p>
              <p class="text-warm-600 text-sm">Đặt cọc tối thiểu</p>
            </div>
            <div class="bg-warm-50 rounded-xl p-6">
              <p class="text-2xl font-bold text-accent mb-2">HD</p>
              <p class="text-warm-600 text-sm">Chất lượng in</p>
            </div>
          </div>
        </div>
      </section>
    </template>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import { useTemplateStore } from '@/stores/templates'
import { useAuthStore } from '@/stores/auth'
import type { Template } from '@/types'

const route   = useRoute()
const router  = useRouter()
const templateStore = useTemplateStore()
const authStore     = useAuthStore()

const template = ref<Template | null>(null)
const loading  = ref(true)
const error    = ref<string | null>(null)

const categoryLabel = computed(() => {
  const map: Record<string, string> = {
    wedding: 'Đám cưới', travel: 'Du lịch', family: 'Gia đình',
    graduation: 'Tốt nghiệp', baby: 'Em bé', other: 'Khác'
  }
  return map[template.value?.category ?? ''] ?? template.value?.category ?? ''
})

function formatPrice(price: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

async function startProject() {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'login', query: { redirect: route.fullPath } })
    return
  }
  // Navigate to editor new with template slug/id
  router.push({ name: 'editor-new', params: { templateId: template.value!.id } })
}

onMounted(async () => {
  try {
    const slug = route.params.slug as string
    template.value = await templateStore.fetchBySlug(slug)
  } catch (e: any) {
    error.value = e?.message ?? 'Không tìm thấy mẫu thiết kế'
  } finally {
    loading.value = false
  }
})
</script>
