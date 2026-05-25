<template>
  <!-- Mobile warning — editor requires desktop -->
  <MobileWarningModal v-if="showMobileWarning" @continue="showMobileWarning = false" />

  <!-- Loading state -->
  <div v-else-if="loading" class="h-screen w-screen bg-warm-900 flex flex-col items-center justify-center gap-4">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
    <p class="text-warm-400 text-sm">{{ loadingMessage }}</p>
  </div>

  <!-- Error state -->
  <div v-else-if="loadError" class="h-screen w-screen bg-warm-900 flex flex-col items-center justify-center gap-4 text-white">
    <p class="text-red-400 font-medium">{{ loadError }}</p>
    <RouterLink to="/templates" class="btn-primary">← Quay lại mẫu</RouterLink>
  </div>

  <!-- Editor — full-screen, no AppHeader/Footer -->
  <template v-else>
    <EditorLayout>
      <template #toolbar>
        <TopToolbar @continue="onContinue" />
      </template>

      <template #left-sidebar>
        <LeftSidebar />
      </template>

      <template #canvas>
        <CanvasWorkspace />
      </template>

      <template #right-sidebar>
        <RightSidebar />
      </template>

      <template #bottom-nav>
        <BottomNavigator />
      </template>
    </EditorLayout>

    <!-- Modals -->
    <PreviewModal
      v-if="editorStore.isPreviewOpen"
      @close="editorStore.closePreview()"
    />

    <CompletionGateModal
      v-if="showGateModal"
      :incomplete-count="incompleteCount"
      @cancel="showGateModal = false"
      @confirm="proceedToCheckout"
    />
  </template>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useEditorStore } from '@/stores/editor'

import EditorLayout        from '@/components/editor/EditorLayout.vue'
import TopToolbar          from '@/components/editor/TopToolbar.vue'
import LeftSidebar         from '@/components/editor/LeftSidebar.vue'
import CanvasWorkspace     from '@/components/editor/CanvasWorkspace.vue'
import RightSidebar        from '@/components/editor/RightSidebar.vue'
import BottomNavigator     from '@/components/editor/BottomNavigator.vue'
import PreviewModal        from '@/components/editor/PreviewModal.vue'
import CompletionGateModal from '@/components/editor/CompletionGateModal.vue'
import MobileWarningModal  from '@/components/editor/MobileWarningModal.vue'

const route       = useRoute()
const router      = useRouter()
const editorStore = useEditorStore()

// ── State ──────────────────────────────────────────────────────
const loading        = ref(true)
const loadingMessage = ref('Đang tải dự án...')
const loadError      = ref<string | null>(null)
const showGateModal  = ref(false)
const showMobileWarning = ref(window.innerWidth < 768)

// ── Computed ───────────────────────────────────────────────────
const incompleteCount = computed(() =>
  editorStore.pageCompletionStatuses.filter(p => !p.isComplete).length
)

// ── Init ───────────────────────────────────────────────────────
onMounted(async () => {
  try {
    if (route.name === 'editor-new') {
      // Create new project from template
      const templateId = Number(route.params.templateId)
      loadingMessage.value = 'Đang tạo dự án mới...'
      const projectId = await editorStore.createProject(templateId, '')
      // Load full project data (incl. template pages) before rendering editor
      loadingMessage.value = 'Đang tải dữ liệu...'
      await editorStore.loadProject(projectId)
      // Replace URL so back-button doesn't re-create
      router.replace({ name: 'editor', params: { projectId } })
    } else {
      // Load existing project
      const projectId = route.params.projectId as string
      await editorStore.loadProject(projectId)
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Không thể tải dự án'
    loadError.value = msg
  } finally {
    loading.value = false
  }

  // Keyboard shortcuts
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  // Final autosave on leave
  if (editorStore.saveStatus === 'unsaved') {
    editorStore.performAutosave()
  }
})

// ── Keyboard Shortcuts ─────────────────────────────────────────
function handleKeydown(e: KeyboardEvent) {
  const isMac = navigator.platform.toUpperCase().includes('MAC')
  const ctrl  = isMac ? e.metaKey : e.ctrlKey

  if (!ctrl) return

  if (e.key === 'z' && !e.shiftKey) { e.preventDefault(); editorStore.undo() }
  if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) { e.preventDefault(); editorStore.redo() }
  if (e.key === 's') { e.preventDefault(); editorStore.performAutosave() }
}

// ── Continue / Submit ──────────────────────────────────────────
function onContinue() {
  if (incompleteCount.value > 0) {
    showGateModal.value = true
  } else {
    proceedToCheckout()
  }
}

function proceedToCheckout() {
  showGateModal.value = false
  router.push({ name: 'checkout', params: { projectId: editorStore.project?.id } })
}
</script>
