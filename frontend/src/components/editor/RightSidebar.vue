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
              class="flex-1 py-2 bg-warm-800 hover:bg-warm-700 border border-warm-600 rounded-md text-sm font-medium transition-colors text-warm-200"
            >
              🔄 Đặt lại
            </button>
            <button 
              @click="editorStore.removePhoto(editorStore.currentPageIndex, editorStore.selectedElement.id)"
              class="flex-1 py-2 bg-red-900/30 hover:bg-red-900/50 border border-red-800/50 text-red-300 rounded-md text-sm font-medium transition-colors"
            >
              🗑️ Xóa ảnh
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
