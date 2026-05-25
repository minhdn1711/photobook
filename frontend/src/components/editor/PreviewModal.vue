<template>
  <Teleport to="body">
    <div 
      v-if="editorStore.isPreviewOpen"
      class="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center backdrop-blur-sm transition-opacity duration-300"
    >
      <!-- Close Button -->
      <button 
        @click="editorStore.closePreview()" 
        class="absolute top-6 right-6 text-white hover:text-accent-400 bg-warm-900/50 p-2 rounded-full transition-colors z-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- 3D Book Container -->
      <div class="relative w-full max-w-[1200px] h-[80vh] flex items-center justify-center perspective-[2000px]">
        
        <!-- Controls Left -->
        <button 
          @click="prevSpread" 
          :class="['absolute left-4 p-4 rounded-full bg-warm-800/80 text-white hover:bg-accent-500 transition-colors z-40', currentSpread === 0 ? 'opacity-30 cursor-not-allowed' : '']"
          :disabled="currentSpread === 0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <!-- Book -->
        <div class="book relative w-[800px] h-[600px] preserve-3d">
          
          <!-- We represent the book as a stack of sheets. Each sheet has a front and back page. -->
          <!-- Sheet 0: Front=null, Back=Cover(0) -->
          <!-- Sheet 1: Front=Page 1, Back=Page 2 -->
          <!-- Sheet 2: Front=Page 3, Back=Page 4 -->
          <!-- ... -->
          <!-- Sheet 8: Front=Page 15, Back=null -->
          
          <div 
            v-for="(sheet, index) in sheets" 
            :key="index"
            class="sheet absolute top-0 right-0 w-[50%] h-full transform-origin-left preserve-3d transition-transform duration-700 ease-in-out"
            :class="{ 'flipped': currentSpread > index }"
            :style="{ zIndex: currentSpread > index ? index : 10 - index }"
          >
            <!-- Front of sheet (Left side when opened) -->
            <div class="page page-front absolute inset-0 bg-white shadow-inner backface-hidden rotate-y-180 flex items-center justify-center overflow-hidden border border-warm-200">
              <v-stage v-if="sheet.front !== null" :config="getStageConfig(sheet.front)">
                <v-layer>
                  <KonvaPage 
                    v-if="editorStore.template && editorStore.project"
                    :page-config="editorStore.template.pages[sheet.front]"
                    :page-state="editorStore.project.pages[sheet.front]"
                    :scale="getScale(sheet.front)"
                  />
                </v-layer>
              </v-stage>
              <div v-else class="w-full h-full bg-warm-800 flex items-center justify-center text-warm-500">
                (Bìa sau)
              </div>
              <div v-if="sheet.front !== null" class="absolute bottom-4 left-4 text-xs text-warm-400 bg-white/80 px-2 rounded">{{ sheet.front }}</div>
            </div>

            <!-- Back of sheet (Right side when opened) -->
            <div class="page page-back absolute inset-0 bg-white shadow-[-5px_0_15px_rgba(0,0,0,0.1)] backface-hidden flex items-center justify-center overflow-hidden border border-warm-200">
              <v-stage v-if="sheet.back !== null" :config="getStageConfig(sheet.back)">
                <v-layer>
                  <KonvaPage 
                    v-if="editorStore.template && editorStore.project"
                    :page-config="editorStore.template.pages[sheet.back]"
                    :page-state="editorStore.project.pages[sheet.back]"
                    :scale="getScale(sheet.back)"
                  />
                </v-layer>
              </v-stage>
              <div v-else class="w-full h-full bg-warm-800 flex items-center justify-center text-warm-500">
                (Mặt trong bìa)
              </div>
              <div v-if="sheet.back !== null" class="absolute bottom-4 right-4 text-xs text-warm-400 bg-white/80 px-2 rounded">{{ sheet.back === 0 ? 'Bìa' : sheet.back }}</div>
            </div>
          </div>
        </div>

        <!-- Controls Right -->
        <button 
          @click="nextSpread" 
          :class="['absolute right-4 p-4 rounded-full bg-warm-800/80 text-white hover:bg-accent-500 transition-colors z-40', currentSpread === sheets.length ? 'opacity-30 cursor-not-allowed' : '']"
          :disabled="currentSpread === sheets.length"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

      </div>
      
      <div class="mt-8 text-warm-400">Trượt hoặc bấm nút để lật trang</div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useEditorStore } from '@/stores/editor'
import KonvaPage from './KonvaPage.vue'

const editorStore = useEditorStore()

// Book state
const currentSpread = ref(0) // 0 = Cover closed.

// Generate sheets mapping
// 16 pages (0-15).
// Sheet 0: Front = null (outside back), Back = 0 (Cover)
// Sheet 1: Front = 1, Back = 2
// Sheet 2: Front = 3, Back = 4
// ...
// Sheet 8: Front = 15, Back = null (inside back)
const sheets = computed(() => {
  const s = []
  s.push({ front: null, back: 0 })
  for (let i = 1; i < 15; i += 2) {
    s.push({ front: i, back: i + 1 })
  }
  s.push({ front: 15, back: null })
  return s
})

function nextSpread() {
  if (currentSpread.value < sheets.value.length) {
    currentSpread.value++
  }
}

function prevSpread() {
  if (currentSpread.value > 0) {
    currentSpread.value--
  }
}

// Fixed dimensions for preview
const PREVIEW_WIDTH = 400
const PREVIEW_HEIGHT = 600

function getScale(pageIndex: number) {
  if (!editorStore.template) return 1
  const config = editorStore.template.pages[pageIndex]
  if (!config) return 1
  
  const scaleW = PREVIEW_WIDTH / config.canvasSize.width
  const scaleH = PREVIEW_HEIGHT / config.canvasSize.height
  return Math.min(scaleW, scaleH)
}

function getStageConfig(pageIndex: number) {
  if (!editorStore.template) return { width: 0, height: 0 }
  const config = editorStore.template.pages[pageIndex]
  if (!config) return { width: 0, height: 0 }
  
  const scale = getScale(pageIndex)
  return {
    width: config.canvasSize.width * scale,
    height: config.canvasSize.height * scale
  }
}
</script>

<style scoped>
.perspective-[2000px] {
  perspective: 2000px;
}
.preserve-3d {
  transform-style: preserve-3d;
}
.transform-origin-left {
  transform-origin: left center;
}
.backface-hidden {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
.rotate-y-180 {
  transform: rotateY(180deg);
}
.flipped {
  transform: rotateY(-180deg);
}

.book {
  /* Box shadow for the entire book block */
  box-shadow: 20px 0 50px rgba(0,0,0,0.5);
}
.sheet {
  /* Give sheet slightly different colors/shadows to feel like paper */
}
</style>
