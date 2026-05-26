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
      <div
        v-for="(status, i) in editorStore.pageCompletionStatuses"
        :key="i"
        class="relative flex-shrink-0 group/thumb"
      >
        <!-- Page thumbnail -->
        <button
          @click="editorStore.navigatePage(i)"
          class="relative w-[48px] h-[48px] rounded-md border-2 transition-all duration-200"
          :class="[
            editorStore.currentPageIndex === i
              ? 'border-accent-500 scale-110 shadow-lg shadow-accent-500/20'
              : 'border-warm-700 hover:border-warm-500',
            status.isComplete ? 'bg-warm-800' : 'bg-warm-900'
          ]"
        >
          <span
            class="absolute inset-0 flex items-center justify-center text-xs font-medium"
            :class="editorStore.currentPageIndex === i ? 'text-white' : 'text-warm-400'"
          >
            {{ i === 0 ? 'Bìa' : (i === editorStore.pages.length - 1 ? 'Bìa\nsau' : i) }}
          </span>

          <!-- Status dot (complete / partial) -->
          <div
            v-if="status.isComplete"
            class="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-warm-900"
          ></div>
          <div
            v-else-if="status.filledFrames > 0"
            class="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full border border-warm-900"
          ></div>
        </button>

        <!-- Delete ✕ — chỉ hiện ở trang nội dung (không phải bìa), khi hover, và còn đủ trang -->
        <button
          v-if="isDeletable(i)"
          @click.stop="confirmDelete(i)"
          class="absolute -top-1.5 -right-1.5 z-10 w-4 h-4 rounded-full bg-red-600 hover:bg-red-500 text-white
                 flex items-center justify-center
                 opacity-0 group-hover/thumb:opacity-100
                 transition-opacity duration-150 shadow-sm"
          title="Xóa trang này"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Add Page Button -->
      <button
        @click="editorStore.addPage()"
        class="relative w-[48px] h-[48px] flex-shrink-0 rounded-md border-2 border-dashed border-warm-600
               hover:border-accent-500 hover:text-accent-500 bg-warm-900/50
               flex items-center justify-center transition-colors text-warm-400"
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

  <!-- Confirm modal xóa trang -->
  <ConfirmModal
    v-model="showDeleteModal"
    title="Xóa trang này?"
    :message="`Trang ${pendingDeleteIndex} sẽ bị xóa vĩnh viễn khỏi album. Ảnh đã đặt vào trang này sẽ không còn xuất hiện trong thiết kế.`"
    confirm-label="Xóa trang"
    cancel-label="Giữ lại"
    variant="danger"
    @confirm="doDelete"
    @cancel="showDeleteModal = false"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useEditorStore } from '@/stores/editor'
import ConfirmModal from '@/components/ui/ConfirmModal.vue'

const editorStore = useEditorStore()

const showDeleteModal  = ref(false)
const pendingDeleteIndex = ref<number | null>(null)

/** Trang i có thể xóa không? (inner, còn đủ trang) */
function isDeletable(i: number): boolean {
  const last = editorStore.pages.length - 1
  return i > 0 && i < last && editorStore.pages.length > 3
}

function confirmDelete(i: number) {
  if (!isDeletable(i)) return
  pendingDeleteIndex.value = i
  showDeleteModal.value = true
}

function doDelete() {
  if (pendingDeleteIndex.value !== null) {
    editorStore.deletePage(pendingDeleteIndex.value)
  }
  showDeleteModal.value = false
  pendingDeleteIndex.value = null
}
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
