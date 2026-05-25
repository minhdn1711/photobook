<template>
  <div 
    class="absolute inset-0 flex items-center justify-center overflow-auto bg-warm-800" 
    ref="containerRef"
    @dragover.prevent
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
            v-if="editorStore.activePageConfig && editorStore.activePageState"
            :page-config="editorStore.activePageConfig"
            :page-state="editorStore.activePageState"
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

// Zoom / Scale logic
const baseScale = ref(1) // calculated to fit screen
const userScale = ref(1) // user zoom multiplier

const scale = computed(() => baseScale.value * userScale.value)

const stageConfig = computed(() => {
  if (!editorStore.activePageConfig) return { width: 0, height: 0 }
  return {
    width: editorStore.activePageConfig.canvasSize.width * scale.value,
    height: editorStore.activePageConfig.canvasSize.height * scale.value
  }
})

const scaledWidth = computed(() => stageConfig.value.width)
const scaledHeight = computed(() => stageConfig.value.height)

function calculateBaseScale() {
  if (!containerRef.value || !editorStore.activePageConfig) return
  
  // Padding around canvas
  const padding = 80 
  const containerW = containerRef.value.clientWidth - padding
  const containerH = containerRef.value.clientHeight - padding
  
  const canvasW = editorStore.activePageConfig.canvasSize.width
  const canvasH = editorStore.activePageConfig.canvasSize.height
  
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

// Drag & Drop
function onDrop(e: DragEvent) {
  const photoId = e.dataTransfer?.getData('text/plain')
  if (!photoId || !stageRef.value) return

  // We need to find which frame the pointer is over
  const stage = stageRef.value.getNode()
  stage.setPointersPositions(e)
  const pos = stage.getPointerPosition()
  
  if (!pos) return
  
  // Find frame at position
  const shape = stage.getIntersection(pos)
  if (shape && shape.name() && shape.name().startsWith('frame-')) {
    const frameId = shape.name().replace('frame-', '')
    // Assign photo
    editorStore.assignPhoto(editorStore.currentPageIndex, frameId, photoId)
    // Auto select
    editorStore.selectElement({ type: 'frame', id: frameId, pageIndex: editorStore.currentPageIndex })
  }
}
</script>
