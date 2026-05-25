<template>
  <div class="h-full flex items-center justify-between px-4">
    <div class="flex items-center gap-4">
      <RouterLink to="/templates" class="text-warm-300 hover:text-white transition-colors" title="Trở lại">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </RouterLink>
      
      <div class="flex flex-col">
        <h1 class="text-sm font-semibold text-white">{{ editorStore.project?.name || 'Đang tải...' }}</h1>
        <span class="text-xs text-warm-400">
          <template v-if="editorStore.saveStatus === 'saved'">Đã lưu</template>
          <template v-else-if="editorStore.saveStatus === 'saving'">Đang lưu...</template>
          <template v-else-if="editorStore.saveStatus === 'unsaved'">Chưa lưu</template>
          <template v-else>Lỗi lưu</template>
        </span>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <button 
        @click="editorStore.undo()" 
        :disabled="!editorStore.canUndo"
        class="p-2 text-warm-300 hover:text-white disabled:opacity-50 disabled:hover:text-warm-300"
        title="Hoàn tác (Ctrl+Z)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
      </button>
      
      <button 
        @click="editorStore.redo()" 
        :disabled="!editorStore.canRedo"
        class="p-2 text-warm-300 hover:text-white disabled:opacity-50 disabled:hover:text-warm-300"
        title="Làm lại (Ctrl+Y)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
        </svg>
      </button>

      <div class="w-px h-6 bg-warm-700 mx-2"></div>

      <button 
        @click="editorStore.openPreview()"
        class="px-4 py-1.5 rounded-md border border-warm-600 text-warm-200 hover:bg-warm-800 hover:text-white transition-colors text-sm font-medium"
      >
        Preview
      </button>
      
      <button 
        @click="$emit('continue')"
        class="px-4 py-1.5 rounded-md bg-accent-500 hover:bg-accent-600 text-white transition-colors text-sm font-medium"
      >
        Tiếp tục →
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEditorStore } from '@/stores/editor'
import { RouterLink } from 'vue-router'

const editorStore = useEditorStore()
defineEmits(['continue'])
</script>
