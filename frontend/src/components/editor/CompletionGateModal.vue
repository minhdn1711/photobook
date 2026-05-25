<template>
  <Teleport to="body">
    <div 
      v-if="isOpen"
      class="fixed inset-0 z-50 bg-black/60 flex items-center justify-center backdrop-blur-sm"
    >
      <div class="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 relative overflow-hidden">
        <!-- Decoration -->
        <div class="absolute top-0 left-0 w-full h-2 bg-yellow-400"></div>
        
        <div class="text-center mb-6">
          <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 class="text-2xl font-heading font-bold text-warm-900 mb-2">Chưa hoàn thiện thiết kế</h2>
          <p class="text-warm-500">
            Bạn còn <strong class="text-warm-900">{{ incompleteCount }}</strong> khung ảnh bắt buộc chưa được điền. Những khung này sẽ bị để trống khi in.
          </p>
        </div>

        <div class="flex gap-4">
          <button 
            @click="$emit('cancel')" 
            class="flex-1 px-4 py-2 rounded border border-warm-300 text-warm-700 font-medium hover:bg-warm-50 transition-colors"
          >
            Quay lại chỉnh sửa
          </button>
          <button 
            @click="$emit('confirm')" 
            class="flex-1 px-4 py-2 rounded bg-warm-900 text-white font-medium hover:bg-black transition-colors"
          >
            Vẫn tiếp tục
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useEditorStore } from '@/stores/editor'

defineProps<{
  isOpen: boolean
}>()

defineEmits(['cancel', 'confirm'])

const editorStore = useEditorStore()

const incompleteCount = computed(() => {
  let count = 0
  editorStore.pageCompletionStatuses.forEach(p => {
    count += (p.requiredFrames - p.filledRequiredFrames)
  })
  return count
})
</script>
