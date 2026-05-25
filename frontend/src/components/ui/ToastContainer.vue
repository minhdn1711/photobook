<template>
  <!-- Global toast notification container -->
  <Teleport to="body">
    <div
      class="fixed bottom-6 right-6 z-toast flex flex-col gap-3 pointer-events-none"
      aria-live="polite"
      aria-label="Thông báo"
    >
      <TransitionGroup name="toast" tag="div" class="flex flex-col gap-3">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto flex items-start gap-3 w-80 max-w-sm
                 bg-white rounded-xl shadow-modal p-4
                 border border-warm-200"
          role="alert"
        >
          <!-- Icon -->
          <div
            class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm"
            :class="iconClasses[toast.type]"
          >
            <span>{{ icons[toast.type] }}</span>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-warm-800 leading-snug">
              {{ toast.title }}
            </p>
            <p v-if="toast.message" class="text-sm text-warm-500 mt-0.5 leading-snug">
              {{ toast.message }}
            </p>
          </div>

          <!-- Close button -->
          <button
            @click="uiStore.removeToast(toast.id)"
            class="flex-shrink-0 text-warm-400 hover:text-warm-600
                   transition-colors duration-fast p-0.5 -m-0.5 rounded"
            aria-label="Đóng thông báo"
          >
            ✕
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUiStore } from '@/stores/ui'

const uiStore = useUiStore()
const toasts = computed(() => uiStore.toasts)

const icons = {
  success: '✓',
  error:   '✕',
  warning: '⚠',
  info:    'ℹ',
}

const iconClasses = {
  success: 'bg-green-100 text-green-600',
  error:   'bg-red-100 text-red-600',
  warning: 'bg-amber-100 text-amber-600',
  info:    'bg-blue-100 text-blue-600',
}
</script>

<style scoped>
.toast-enter-active {
  transition: all 300ms ease-out;
}
.toast-leave-active {
  transition: all 200ms ease-in;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(24px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(24px);
}
.toast-move {
  transition: transform 300ms ease;
}
</style>
