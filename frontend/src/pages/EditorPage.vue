<template>
  <div v-if="isLoading" class="min-h-screen bg-warm-900 flex items-center justify-center text-white">
    <div class="animate-pulse">Đang tải project...</div>
  </div>
  
  <EditorLayout v-else>
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

  <PreviewModal />
  <CompletionGateModal 
    :is-open="isGateOpen" 
    @cancel="isGateOpen = false" 
    @confirm="proceedToCheckout" 
  />
  <MobileWarningModal />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEditorStore } from '@/stores/editor'
import type { Project, Template } from '@/types'

import EditorLayout from '@/components/editor/EditorLayout.vue'
import TopToolbar from '@/components/editor/TopToolbar.vue'
import LeftSidebar from '@/components/editor/LeftSidebar.vue'
import RightSidebar from '@/components/editor/RightSidebar.vue'
import BottomNavigator from '@/components/editor/BottomNavigator.vue'
import CanvasWorkspace from '@/components/editor/CanvasWorkspace.vue'
import PreviewModal from '@/components/editor/PreviewModal.vue'
import CompletionGateModal from '@/components/editor/CompletionGateModal.vue'
import MobileWarningModal from '@/components/editor/MobileWarningModal.vue'

const route = useRoute()
const router = useRouter()
const editorStore = useEditorStore()
const isLoading = ref(true)
const isGateOpen = ref(false)

function onContinue() {
  if (!editorStore.canSubmit) {
    isGateOpen.value = true
  } else {
    proceedToCheckout()
  }
}

function proceedToCheckout() {
  isGateOpen.value = false
  router.push(`/checkout/${editorStore.project?.id || 1}`)
}

onMounted(async () => {
  const projectId = route.params.projectId as string
  const templateId = route.params.templateId as string
  
  try {
    if (templateId) {
      // Logic for new project (not fully implemented in mock, just use mock)
      throw new Error("New project mock")
    } else {
      // Try to load from API (this is already in the store)
      await editorStore.loadProject(projectId)
    }
  } catch (err) {
    console.warn("Failed to load project from API, using mock data for development")
    // Mock data for development
    const mockTemplate: Template = {
      id: 1,
      name: "Đám Cưới — Ánh Hồng",
      slug: "dam-cuoi-anh-hong",
      category: "wedding",
      description: "Mock template",
      cover_image_url: null,
      preview_images: [],
      price: 450000,
      deposit_percent: 30,
      is_popular: true,
      is_new: false,
      rating: 5,
      review_count: 100,
      page_count: 16,
      pages: Array.from({length: 16}).map((_, i) => ({
        pageIndex: i,
        pageSizeMM: { width: 200, height: 200 },
        canvasSize: { width: 800, height: 800 },
        background: i === 0 ? '#FDF8F4' : '#FFFFFF',
        frames: [
          {
            id: `f-${i}-1`,
            x: 80, y: 80, width: 640, height: 640,
            shape: 'rect',
            printSizeMM: { width: 160, height: 160 },
            required: true,
            tabIndex: 1
          }
        ],
        texts: []
      }))
    }
    
    const mockProject: Project = {
      id: projectId || "mock-1",
      userId: 1,
      templateId: Number(templateId) || 1,
      name: "Album Cưới của tôi",
      status: "draft",
      lastSavedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pages: Array.from({length: 16}).map((_, i) => ({
        pageIndex: i,
        frames: [
           { frameId: `f-${i}-1`, photoId: null, cropData: { x: 0, y: 0, scale: 1 } }
        ],
        texts: []
      }))
    }
    
    editorStore.initProject(mockProject, mockTemplate)
  } finally {
    isLoading.value = false
  }
})

onUnmounted(() => {
  // Clear editor state when leaving
  // Alternatively keep it if we want to resume quickly
})
</script>
