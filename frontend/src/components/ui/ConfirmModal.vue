<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        @mousedown.self="$emit('cancel')"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        <!-- Panel -->
        <div class="relative w-full max-w-sm bg-warm-950 border border-warm-700 rounded-2xl shadow-2xl overflow-hidden">
          <!-- Top accent bar -->
          <div class="h-1 w-full" :class="accentBar" />

          <div class="p-6">
            <!-- Icon + Title -->
            <div class="flex items-start gap-4 mb-4">
              <div
                class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                :class="iconBg"
              >
                <!-- danger -->
                <svg v-if="variant === 'danger'" class="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <!-- warning -->
                <svg v-else-if="variant === 'warning'" class="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9.303 3.376c.866 1.5-.217 3.374-1.948 3.374H4.645c-1.73 0-2.813-1.874-1.948-3.374L10.05 3.378c.866-1.5 3.032-1.5 3.898 0l6.355 12.748z" />
                </svg>
                <!-- info -->
                <svg v-else class="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
              </div>

              <div class="flex-1 min-w-0">
                <h3 class="text-base font-semibold text-warm-50 leading-snug">{{ title }}</h3>
                <p class="mt-1 text-sm text-warm-400 leading-relaxed">{{ message }}</p>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-3 justify-end mt-6">
              <button
                @click="$emit('cancel')"
                class="px-4 py-2 text-sm font-medium rounded-lg border border-warm-600 text-warm-300
                       hover:bg-warm-800 hover:text-warm-100 transition-colors"
              >
                {{ cancelLabel }}
              </button>
              <button
                @click="$emit('confirm')"
                class="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                :class="confirmBtnClass"
              >
                {{ confirmLabel }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning' | 'info'
}>(), {
  confirmLabel: 'Xác nhận',
  cancelLabel: 'Hủy',
  variant: 'danger',
})

defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const accentBar = computed(() => ({
  danger:  'bg-red-600',
  warning: 'bg-yellow-500',
  info:    'bg-blue-500',
}[props.variant]))

const iconBg = computed(() => ({
  danger:  'bg-red-500/15',
  warning: 'bg-yellow-500/15',
  info:    'bg-blue-500/15',
}[props.variant]))

const confirmBtnClass = computed(() => ({
  danger:  'bg-red-600 hover:bg-red-500 text-white',
  warning: 'bg-yellow-500 hover:bg-yellow-400 text-black',
  info:    'bg-blue-600 hover:bg-blue-500 text-white',
}[props.variant]))
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .relative {
  transform: scale(0.95) translateY(8px);
}
.modal-leave-to .relative {
  transform: scale(0.95) translateY(8px);
}
</style>
