<template>
  <div class="h-full flex items-center justify-center px-4 w-full relative">
    <!-- Prev Button -->
    <button 
      @click="editorStore.prevPage()" 
      :disabled="editorStore.currentPageIndex === 0"
      class="absolute left-4 p-2 rounded-full hover:bg-warm-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-warm-300"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <!-- Thumbnails Scroll Container -->
    <div class="flex items-center gap-2 overflow-x-auto no-scrollbar px-12 py-2 w-full justify-center">
      <button
        v-for="(status, i) in editorStore.pageCompletionStatuses"
        :key="i"
        @click="editorStore.navigatePage(i)"
        class="relative w-[48px] h-[48px] flex-shrink-0 rounded-md border-2 transition-all duration-200"
        :class="[
          editorStore.currentPageIndex === i ? 'border-accent-500 scale-110 shadow-lg shadow-accent-500/20' : 'border-warm-700 hover:border-warm-500',
          status.isComplete ? 'bg-warm-800' : 'bg-warm-900'
        ]"
      >
        <span class="absolute inset-0 flex items-center justify-center text-xs font-medium" :class="editorStore.currentPageIndex === i ? 'text-white' : 'text-warm-400'">
          {{ i === 0 ? 'Bìa' : (i === editorStore.pages.length - 1 ? 'Bìa sau' : i) }}
        </span>
        
        <!-- Status Indicator -->
        <div 
          v-if="status.isComplete" 
          class="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-warm-900"
        ></div>
        <div 
          v-else-if="status.filledFrames > 0" 
          class="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full border border-warm-900"
        ></div>
      </button>

      <!-- Add Page Button -->
      <button
        @click="editorStore.addPage()"
        class="relative w-[48px] h-[48px] flex-shrink-0 rounded-md border-2 border-dashed border-warm-600 hover:border-accent-500 hover:text-accent-500 bg-warm-900/50 flex items-center justify-center transition-colors text-warm-400"
        title="Thêm trang nội dung"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>

    <!-- Next Button -->
    <button 
      @click="editorStore.nextPage()" 
      :disabled="editorStore.currentPageIndex >= editorStore.pages.length - 1"
      class="absolute right-4 p-2 rounded-full hover:bg-warm-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-warm-300"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useEditorStore } from '@/stores/editor'

const editorStore = useEditorStore()
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
