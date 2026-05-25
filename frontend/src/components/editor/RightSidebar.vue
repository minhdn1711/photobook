<template>
  <div class="h-full flex flex-col">
    <div class="p-4 border-b border-warm-800">
      <h2 class="text-sm font-semibold text-warm-200">Thuộc tính</h2>
    </div>

    <div class="flex-1 p-4 overflow-y-auto">
      <div v-if="!editorStore.selectedElement" class="text-center text-warm-400 text-sm mt-4">
        Chọn một hình ảnh hoặc văn bản<br/>để chỉnh sửa.
      </div>
      
      <!-- Frame Properties -->
      <div v-else-if="editorStore.selectedElement.type === 'frame'">
        <div class="space-y-4">
          <div class="p-3 bg-warm-800 rounded-lg border border-warm-700 text-sm">
            <p class="font-medium text-warm-200 mb-1">Khung ảnh đã chọn</p>
            <p class="text-xs text-warm-400">Bạn có thể bấm giữ và kéo ảnh trực tiếp trên trang giấy để căn chỉnh góc đẹp nhất.</p>
          </div>
          
          <div class="pt-2">
             <label class="block text-xs text-warm-400 mb-2 flex justify-between">
               <span>Thu / Phóng (Zoom)</span>
               <span>{{ Math.round(activeFrameCrop.scale * 100) }}%</span>
             </label>
             <input 
               type="range" 
               min="1" 
               max="3" 
               step="0.05" 
               :value="activeFrameCrop.scale"
               @input="updateZoom"
               class="w-full accent-accent-500" 
             />
          </div>

          <div class="flex gap-2 pt-2">
            <button 
              @click="resetCrop"
              class="flex-1 py-2 bg-warm-800 hover:bg-warm-700 border border-warm-600 rounded-md text-sm font-medium transition-colors text-warm-200 flex items-center justify-center gap-1.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Đặt lại
            </button>
            <button 
              @click="editorStore.removePhoto(editorStore.currentPageIndex, editorStore.selectedElement.id)"
              class="flex-1 py-2 bg-red-900/30 hover:bg-red-900/50 border border-red-800/50 text-red-300 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-1.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Xóa ảnh
            </button>
          </div>
        </div>
      </div>
      
      <!-- Text Properties -->
      <div v-else-if="editorStore.selectedElement.type === 'text'">
        <div class="space-y-4">
          <div class="p-3 bg-warm-800 rounded-lg border border-warm-700 text-sm">
            Văn bản đã chọn. Double-click trên canvas để sửa nội dung.
          </div>
          <!-- Properties will go here -->
          <div>
             <label class="block text-xs text-warm-400 mb-1">Cỡ chữ</label>
             <input type="range" min="10" max="72" class="w-full accent-accent-500" />
          </div>
          <div>
            <label class="block text-xs text-warm-400 mb-1">Căn lề</label>
            <div class="flex gap-1">
              <button class="flex-1 py-1 bg-warm-800 border border-warm-600 rounded">Trái</button>
              <button class="flex-1 py-1 bg-warm-800 border border-warm-600 rounded">Giữa</button>
              <button class="flex-1 py-1 bg-warm-800 border border-warm-600 rounded">Phải</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useEditorStore } from '@/stores/editor'

const editorStore = useEditorStore()

// --- Frame Tools ---
const activeFrameState = computed(() => {
  if (editorStore.selectedElement?.type !== 'frame') return null
  const page = editorStore.pages[editorStore.currentPageIndex]
  return page?.frames.find(f => f.frameId === editorStore.selectedElement!.id)
})

const activeFrameCrop = computed(() => {
  return activeFrameState.value?.cropData || { x: 0, y: 0, scale: 1 }
})

function updateZoom(e: Event) {
  if (!editorStore.selectedElement) return
  const target = e.target as HTMLInputElement
  const newScale = parseFloat(target.value)
  
  editorStore.updateCrop(
    editorStore.currentPageIndex, 
    editorStore.selectedElement.id, 
    {
      x: activeFrameCrop.value.x,
      y: activeFrameCrop.value.y,
      scale: newScale
    }
  )
}

function resetCrop() {
  if (!editorStore.selectedElement) return
  editorStore.updateCrop(
    editorStore.currentPageIndex, 
    editorStore.selectedElement.id, 
    { x: 0, y: 0, scale: 1 }
  )
  editorStore.confirmCrop(editorStore.currentPageIndex, editorStore.selectedElement.id)
}
</script>
