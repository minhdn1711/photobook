<template>
  <div class="h-full flex flex-col">
    <div class="p-4 border-b border-warm-800">
      <h2 class="text-sm font-semibold text-warm-200 mb-4">Thư viện ảnh</h2>
      <label class="flex items-center justify-center w-full p-4 border-2 border-dashed border-warm-600 rounded-lg hover:border-accent-400 hover:bg-warm-800/50 transition-colors cursor-pointer group">
        <div class="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mx-auto mb-2 text-warm-400 group-hover:text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span class="text-xs text-warm-300 group-hover:text-white font-medium">Tải ảnh lên</span>
        </div>
        <input type="file" multiple accept="image/*" class="hidden" @change="handleUpload" />
      </label>
    </div>

    <div class="flex-1 overflow-y-auto p-4">
      <div v-if="editorStore.uploadedPhotos.length === 0" class="text-center mt-10 text-warm-400 text-sm">
        Chưa có ảnh nào được tải lên.<br/>Kéo thả ảnh vào đây hoặc bấm nút phía trên.
      </div>
      
      <div v-else class="grid grid-cols-2 gap-2">
        <div 
          v-for="photo in editorStore.uploadedPhotos" 
          :key="photo.id"
          class="relative aspect-square rounded bg-warm-800 border border-warm-700 overflow-hidden cursor-grab active:cursor-grabbing hover:border-accent-400 transition-colors group"
          draggable="true"
          @dragstart="onDragStart($event, photo)"
        >
          <img :src="photo.thumbnailUrl || photo.url" class="w-full h-full object-cover pointer-events-none" />
          
          <!-- Used count indicator (optional later) -->
          <!-- <div class="absolute top-1 right-1 bg-black/60 text-[10px] px-1 rounded text-white font-medium">2</div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEditorStore } from '@/stores/editor'
import type { Photo } from '@/types'

const editorStore = useEditorStore()

function handleUpload(event: Event) {
  const target = event.target as HTMLInputElement
  if (!target.files?.length) return
  
  // TODO: Implement actual upload logic
  // For now, we just create local object URLs
  Array.from(target.files).forEach(file => {
    const url = URL.createObjectURL(file)
    const newPhoto: Photo = {
      id: Math.random().toString(36).substring(7),
      userId: 1,
      projectId: editorStore.project?.id || '1',
      originalFilename: file.name,
      url: url,
      thumbnailUrl: url,
      width: 1000, // mock
      height: 1000, // mock
      fileSize: file.size,
      mimeType: file.type,
      uploadedAt: new Date().toISOString()
    }
    // Add to store (we need a direct action if it doesn't exist, wait, loadPhotos handles array, let's just push for now)
    editorStore.uploadedPhotos.unshift(newPhoto)
  })
  
  // Reset input
  target.value = ''
}

function onDragStart(event: DragEvent, photo: Photo) {
  if (event.dataTransfer) {
    event.dataTransfer.setData('text/plain', photo.id)
    event.dataTransfer.effectAllowed = 'copy'
    // Optional: set custom drag image
  }
}
</script>
