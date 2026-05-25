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
            Khung ảnh đã chọn.
          </div>
          <button 
            @click="editorStore.enterCropMode(editorStore.currentPageIndex, editorStore.selectedElement.id)"
            class="w-full py-2 bg-warm-800 hover:bg-warm-700 border border-warm-600 rounded-md text-sm font-medium transition-colors"
          >
            ✂️ Cắt / Căn chỉnh
          </button>
          <button 
            @click="editorStore.removePhoto(editorStore.currentPageIndex, editorStore.selectedElement.id)"
            class="w-full py-2 bg-red-900/30 hover:bg-red-900/50 border border-red-800/50 text-red-300 rounded-md text-sm font-medium transition-colors"
          >
            🗑️ Xóa ảnh
          </button>
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
import { useEditorStore } from '@/stores/editor'

const editorStore = useEditorStore()
</script>
