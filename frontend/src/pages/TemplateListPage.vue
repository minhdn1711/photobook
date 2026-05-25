<template>
  <div class="min-h-screen bg-warm-50">
    <AppHeader />

    <main>
      <!-- ══ PAGE HEADER ═════════════════════════════════════════ -->
      <div class="bg-white border-b border-warm-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <h1 class="font-heading text-3xl sm:text-4xl font-bold text-warm-900 mb-3">
            Mẫu thiết kế
          </h1>
          <p class="text-warm-500 text-lg max-w-2xl">
            Chọn một mẫu yêu thích, tải ảnh của bạn lên và có ngay album in đẹp trong vài phút.
          </p>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- ── Filter bar ──────────────────────────────────────── -->
        <div class="flex flex-wrap items-center gap-2 mb-8">
          <button
            v-for="cat in categories"
            :key="cat.value"
            @click="selectCategory(cat.value)"
            class="px-4 py-2 rounded-full text-sm font-medium
                   border transition-all duration-fast whitespace-nowrap"
            :class="activeCategory === cat.value
              ? 'bg-accent text-white border-accent shadow-sm'
              : 'bg-white text-warm-600 border-warm-200 hover:border-accent/40 hover:text-accent'"
          >
            {{ cat.label }}
            <span
              v-if="cat.count !== undefined"
              class="ml-1 opacity-60 text-xs"
            >
              ({{ cat.count }})
            </span>
          </button>

          <!-- Sort -->
          <div class="ml-auto">
            <select
              v-model="sortBy"
              @change="fetchTemplates(true)"
              class="text-sm border border-warm-200 rounded-lg px-3 py-2
                     text-warm-700 bg-white focus:outline-none
                     focus:ring-2 focus:ring-accent/30 cursor-pointer"
            >
              <option value="popular">Phổ biến nhất</option>
              <option value="newest">Mới nhất</option>
              <option value="price_asc">Giá thấp → cao</option>
              <option value="price_desc">Giá cao → thấp</option>
            </select>
          </div>
        </div>

        <!-- ── Results header ─────────────────────────────────── -->
        <div class="flex items-center justify-between mb-6">
          <p class="text-sm text-warm-500">
            <template v-if="!loading">
              Hiển thị
              <span class="font-medium text-warm-800">{{ templates.length }}</span>
              / {{ meta.total }} mẫu
            </template>
          </p>
        </div>

        <!-- ── Loading skeleton ───────────────────────────────── -->
        <div
          v-if="loading && templates.length === 0"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          <div
            v-for="i in 8"
            :key="i"
            class="rounded-2xl overflow-hidden bg-white border border-warm-200"
          >
            <div class="aspect-square bg-warm-200 animate-pulse" />
            <div class="p-4 space-y-2.5">
              <div class="h-4 bg-warm-200 rounded animate-pulse w-4/5" />
              <div class="h-3 bg-warm-200 rounded animate-pulse w-2/5" />
              <div class="h-5 bg-warm-200 rounded animate-pulse w-3/5 mt-3" />
            </div>
          </div>
        </div>

        <!-- ── Template grid ──────────────────────────────────── -->
        <template v-else>
          <div
            v-if="templates.length"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <TemplateCard
              v-for="template in templates"
              :key="template.id"
              :template="template"
            />
          </div>

          <!-- Empty state -->
          <div
            v-else
            class="text-center py-20"
          >
            <div class="text-6xl mb-4">🔍</div>
            <h3 class="font-heading text-xl font-semibold text-warm-800 mb-2">
              Chưa có mẫu nào
            </h3>
            <p class="text-warm-500 mb-6">
              Danh mục này chưa có mẫu. Hãy thử danh mục khác.
            </p>
            <button
              @click="selectCategory(null)"
              class="btn-primary"
            >
              Xem tất cả mẫu
            </button>
          </div>
        </template>

        <!-- ── Load more ──────────────────────────────────────── -->
        <div
          v-if="meta.current_page < meta.last_page"
          class="mt-10 text-center"
        >
          <button
            @click="loadMore"
            :disabled="loadingMore"
            class="btn-ghost px-8 py-3 min-w-[160px]"
          >
            <span v-if="!loadingMore">Xem thêm mẫu</span>
            <span v-else class="flex items-center gap-2 justify-center">
              <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10"
                        stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Đang tải...
            </span>
          </button>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '@/lib/api'
import type { Template } from '@/types'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import TemplateCard from '@/components/templates/TemplateCard.vue'

// ── Types ─────────────────────────────────────────────────────
interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

// ── Router ────────────────────────────────────────────────────
const route  = useRoute()
const router = useRouter()

// ── State ─────────────────────────────────────────────────────
const templates     = ref<Template[]>([])
const meta          = ref<PaginationMeta>({ current_page: 1, last_page: 1, per_page: 12, total: 0 })
const loading       = ref(true)
const loadingMore   = ref(false)
const activeCategory = ref<string | null>((route.query.category as string) ?? null)
const sortBy        = ref<string>('popular')

// ── Category definitions ──────────────────────────────────────
const categories = [
  { value: null,         label: 'Tất cả' },
  { value: 'wedding',    label: '💍 Đám cưới' },
  { value: 'travel',     label: '✈️ Du lịch' },
  { value: 'family',     label: '👨‍👩‍👧 Gia đình' },
  { value: 'baby',       label: '🍼 Em bé' },
  { value: 'graduation', label: '🎓 Tốt nghiệp' },
]

// ── API helpers ───────────────────────────────────────────────
function buildParams(page = 1) {
  const params: Record<string, string | number> = { page }
  if (activeCategory.value)      params.category = activeCategory.value
  if (sortBy.value === 'popular') params.popular  = 1
  if (sortBy.value === 'newest')  params.sort     = 'newest'
  if (sortBy.value === 'price_asc')  params.sort  = 'price_asc'
  if (sortBy.value === 'price_desc') params.sort  = 'price_desc'
  return params
}

async function fetchTemplates(reset = false) {
  if (reset) {
    loading.value    = true
    templates.value  = []
    meta.value.current_page = 1
  }

  try {
    const res = await api.get<{ data: Template[]; meta: PaginationMeta }>(
      '/templates',
      { params: buildParams(1) }
    )
    templates.value = res.data.data
    meta.value      = res.data.meta
  } catch (err) {
    console.error('Failed to load templates', err)
  } finally {
    loading.value = false
  }
}

async function loadMore() {
  if (loadingMore.value) return
  loadingMore.value = true

  try {
    const nextPage = meta.value.current_page + 1
    const res = await api.get<{ data: Template[]; meta: PaginationMeta }>(
      '/templates',
      { params: buildParams(nextPage) }
    )
    templates.value.push(...res.data.data)
    meta.value = res.data.meta
  } finally {
    loadingMore.value = false
  }
}

// ── Category selection ────────────────────────────────────────
function selectCategory(value: string | null) {
  activeCategory.value = value
  // Sync URL query param
  router.replace({
    query: value ? { category: value } : {},
  })
  fetchTemplates(true)
}

// ── Watchers & init ───────────────────────────────────────────
// Sync from URL on direct navigation
watch(() => route.query.category, (val) => {
  const cat = (val as string | undefined) ?? null
  if (cat !== activeCategory.value) {
    activeCategory.value = cat
    fetchTemplates(true)
  }
})

onMounted(() => fetchTemplates())
</script>
