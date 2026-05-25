<template>
  <RouterLink
    :to="`/templates/${template.slug}`"
    class="group block rounded-2xl overflow-hidden bg-white
           border border-warm-200 hover:border-accent/40
           shadow-sm hover:shadow-card
           transition-all duration-200"
  >
    <!-- Thumbnail -->
    <div class="relative aspect-square overflow-hidden bg-warm-100">
      <img
        v-if="template.cover_image_url"
        :src="template.cover_image_url"
        :alt="template.name"
        loading="lazy"
        class="w-full h-full object-cover
               group-hover:scale-105 transition-transform duration-300"
      />
      <!-- Placeholder when no image yet -->
      <div
        v-else
        class="w-full h-full flex items-center justify-center bg-gradient-to-br
               from-warm-100 to-warm-200"
      >
        <span class="text-5xl opacity-30">📷</span>
      </div>

      <!-- Badges -->
      <div class="absolute top-3 left-3 flex flex-col gap-1.5">
        <span
          v-if="template.is_popular"
          class="badge-popular"
        >
          ★ Phổ biến
        </span>
        <span
          v-if="template.is_new"
          class="badge-new"
        >
          Mới
        </span>
      </div>

      <!-- Category pill -->
      <span
        class="absolute bottom-3 left-3 px-2.5 py-1 rounded-full
               bg-black/50 text-white text-xs font-medium backdrop-blur-sm"
      >
        {{ categoryLabel }}
      </span>

      <!-- Quick-view overlay -->
      <div
        class="absolute inset-0 bg-black/0 group-hover:bg-black/20
               transition-colors duration-200 flex items-center justify-center"
      >
        <span
          class="opacity-0 group-hover:opacity-100 transition-opacity duration-200
                 bg-white text-warm-900 text-sm font-medium
                 px-4 py-2 rounded-full shadow-md"
        >
          Xem chi tiết
        </span>
      </div>
    </div>

    <!-- Info -->
    <div class="p-4">
      <h3 class="font-heading font-semibold text-warm-900 text-base leading-snug
                 group-hover:text-accent transition-colors duration-fast
                 line-clamp-1 mb-1">
        {{ template.name }}
      </h3>

      <!-- Rating row -->
      <div class="flex items-center gap-1.5 mb-2">
        <div class="flex">
          <span
            v-for="n in 5"
            :key="n"
            class="text-xs"
            :class="n <= Math.round(template.rating) ? 'text-amber-400' : 'text-warm-200'"
          >★</span>
        </div>
        <span class="text-xs text-warm-500">
          {{ template.rating }}
          <span class="text-warm-400">({{ template.review_count }})</span>
        </span>
      </div>

      <!-- Price row -->
      <div class="flex items-center justify-between">
        <div>
          <span class="text-base font-semibold text-warm-900">
            {{ formatPrice(template.price) }}
          </span>
          <span class="text-xs text-warm-500 ml-1">VNĐ</span>
        </div>
        <span class="text-xs text-warm-400">
          {{ template.page_count }} trang
        </span>
      </div>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { Template } from '@/types'

const props = defineProps<{
  template: Template
}>()

const CATEGORY_LABELS: Record<string, string> = {
  wedding:    'Album Cưới',
  travel:     'Du Lịch',
  family:     'Gia Đình',
  baby:       'Em Bé',
  graduation: 'Tốt Nghiệp',
  other:      'Khác',
}

const categoryLabel = computed(
  () => CATEGORY_LABELS[props.template.category] ?? props.template.category
)

function formatPrice(price: number): string {
  return price.toLocaleString('vi-VN')
}
</script>

<style scoped>
.badge-popular {
  @apply px-2 py-0.5 rounded-full text-xs font-semibold
         bg-accent text-white shadow-sm;
}
.badge-new {
  @apply px-2 py-0.5 rounded-full text-xs font-semibold
         bg-green-500 text-white shadow-sm;
}
</style>
