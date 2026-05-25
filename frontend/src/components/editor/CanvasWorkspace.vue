<template>
  <div 
    class="absolute inset-0 flex items-center justify-center overflow-auto bg-warm-800" 
    ref="containerRef"
    @dragenter.prevent
    @dragover.prevent="onDragOver"
    @drop.prevent="onDrop"
  >
    <div 
      class="relative shadow-2xl transition-transform duration-200 bg-white"
      :style="{
        width: `${scaledWidth}px`,
        height: `${scaledHeight}px`
      }"
    >
      <v-stage :config="stageConfig" ref="stageRef">
        <v-layer>
          <KonvaPage 
            v-if="activePageConfig && activePageState"
            :page-config="activePageConfig"
            :page-state="activePageState"
            :scale="scale"
          />
        </v-layer>
      </v-stage>
    </div>
    
    <!-- Zoom Controls -->
    <div class="absolute bottom-4 right-4 flex items-center bg-warm-900 rounded-lg shadow-lg border border-warm-700 overflow-hidden text-sm">
      <button @click="zoomOut" class="p-2 text-warm-300 hover:text-white hover:bg-warm-800" title="Thu nhỏ">-</button>
      <span class="px-2 text-warm-200 min-w-[3rem] text-center">{{ Math.round(scale * 100) }}%</span>
      <button @click="zoomIn" class="p-2 text-warm-300 hover:text-white hover:bg-warm-800" title="Phóng to">+</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useEditorStore } from '@/stores/editor'
import KonvaPage from './KonvaPage.vue'
import { useWindowSize } from '@vueuse/core'

const editorStore = useEditorStore()
const containerRef = ref<HTMLElement | null>(null)
const stageRef = ref<any>(null)
const { width: windowWidth, height: windowHeight } = useWindowSize()

const activePageConfig = computed(() => editorStore.template?.pages[editorStore.currentPageIndex] ?? null)
const activePageState = computed(() => editorStore.pages[editorStore.currentPageIndex] ?? null)

// Zoom / Scale logic
const baseScale = ref(1) // calculated to fit screen
const userScale = ref(1) // user zoom multiplier

const scale = computed(() => baseScale.value * userScale.value)

const stageConfig = computed(() => {
  if (!activePageConfig.value) return { width: 0, height: 0 }
  return {
    width: activePageConfig.value.canvasSize.width * scale.value,
    height: activePageConfig.value.canvasSize.height * scale.value
  }
})

const scaledWidth = computed(() => stageConfig.value.width)
const scaledHeight = computed(() => stageConfig.value.height)

function calculateBaseScale() {
  if (!containerRef.value || !activePageConfig.value) return
  
  // Padding around canvas
  const padding = 80 
  const containerW = containerRef.value.clientWidth - padding
  const containerH = containerRef.value.clientHeight - padding
  
  const canvasW = activePageConfig.value.canvasSize.width
  const canvasH = activePageConfig.value.canvasSize.height
  
  const scaleW = containerW / canvasW
  const scaleH = containerH / canvasH
  
  // Fit within container
  baseScale.value = Math.min(scaleW, scaleH)
}

watch([windowWidth, windowHeight, () => editorStore.activePageIndex], () => {
  // Re-calculate when window resizes or page changes
  userScale.value = 1
  calculateBaseScale()
})

onMounted(() => {
  setTimeout(calculateBaseScale, 100)
})

function zoomIn() {
  userScale.value = Math.min(userScale.value + 0.1, 3)
}

function zoomOut() {
  userScale.value = Math.max(userScale.value - 0.1, 0.2)
}

// Drag & Drop Workaround for clientX=0 bug in some browsers
const lastDragPos = ref({ x: 0, y: 0 })

function onDragOver(e: DragEvent) {
  if (e.clientX !== 0 || e.clientY !== 0) {
    lastDragPos.value = { x: e.clientX, y: e.clientY }
  }
}

function onDrop(e: DragEvent) {
  console.log('Drop event triggered!')
  const photoId = e.dataTransfer?.getData('text/plain')
  if (!photoId || !stageRef.value) {
    console.warn('No photoId or stageRef missing', { photoId })
    return
  }

  // We need to find which frame the pointer is over
  const stage = stageRef.value.getNode()
  const stageRect = stage.container().getBoundingClientRect()
  
  // Fallback to last known position if drop event is bugged (clientX/Y = 0)
  const clientX = (e.clientX === 0 && lastDragPos.value.x !== 0) ? lastDragPos.value.x : e.clientX
  const clientY = (e.clientY === 0 && lastDragPos.value.y !== 0) ? lastDragPos.value.y : e.clientY

  // Calculate pointer position relative to the stage
  const pointerX = clientX - stageRect.left
  const pointerY = clientY - stageRect.top
  
  console.log('Pointer relative to stage:', { pointerX, pointerY, clientX, clientY })
  
  let frameId = null
  const pageConfig = activePageConfig.value
  
  if (pageConfig) {
    // Find frame mathematically
    for (const frame of pageConfig.frames) {
      const fx = frame.x * scale.value
      const fy = frame.y * scale.value
      const fw = frame.width * scale.value
      const fh = frame.height * scale.value
      
      if (pointerX >= fx && pointerX <= fx + fw && pointerY >= fy && pointerY <= fy + fh) {
        frameId = frame.id
        break
      }
    }
    
    // Auto-fallback: if we still couldn't find a frame, and there's only 1 frame on the page, use it.
    if (!frameId && pageConfig.frames.length === 1) {
      frameId = pageConfig.frames[0].id
      console.log('Fallback: assigned to the only frame on page.')
    }
  }

  console.log('Resolved frameId:', frameId)

  if (frameId) {
    // Assign photo
    editorStore.assignPhoto(editorStore.currentPageIndex, frameId, photoId)
    // Auto select
    editorStore.selectElement({ type: 'frame', id: frameId, pageIndex: editorStore.currentPageIndex })
  }
}
</script>
