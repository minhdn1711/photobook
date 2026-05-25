<template>
  <v-group
    :config="{
      x: config.x * scale,
      y: config.y * scale,
      name: `frame-${config.id}`
    }"
    @click="onClick"
    @tap="onClick"
  >
    <!-- Background / Fill -->
    <v-rect
      :config="{
        width: config.width * scale,
        height: config.height * scale,
        fill: isFilled ? '#ffffff' : '#f3f4f6', // warm-100/white
        stroke: isSelected ? '#3b82f6' : (isHovered ? '#60a5fa' : (isFilled ? null : '#9ca3af')),
        strokeWidth: isSelected ? 4 : (isFilled ? 0 : 2),
        dash: isFilled || isSelected ? [] : [5, 5],
        cornerRadius: config.cornerRadius ? config.cornerRadius * scale : 0
      }"
    />

    <!-- Image -->
    <v-image
      v-if="imageObj"
      :config="imageConfig"
    />

    <!-- Empty State Text / Icon -->
    <v-text
      v-if="!isFilled && !imageLoading"
      :config="{
        x: 0,
        y: (config.height * scale) / 2 - 10,
        width: config.width * scale,
        text: 'Kéo ảnh vào đây',
        fontSize: 14 * scale,
        fontFamily: 'Inter',
        fill: '#9ca3af',
        align: 'center'
      }"
    />
  </v-group>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { FrameDefinition, FrameState } from '@/types'
import { useEditorStore } from '@/stores/editor'

const props = defineProps<{
  config: FrameDefinition
  state: FrameState
  scale: number
}>()

const editorStore = useEditorStore()

const isSelected = computed(() => {
  return editorStore.selectedElement?.type === 'frame' && 
         editorStore.selectedElement?.id === props.config.id
})

const isHovered = ref(false)

const photo = computed(() => {
  if (!props.state.photoId) return null
  return editorStore.uploadedPhotos.find(p => p.id === props.state.photoId) || null
})

const isFilled = computed(() => !!photo.value)

// --- Image Loading ---
const imageObj = ref<HTMLImageElement | null>(null)
const imageLoading = ref(false)

watch(() => photo.value?.url, (newUrl) => {
  if (newUrl) {
    loadImage(newUrl)
  } else {
    imageObj.value = null
  }
}, { immediate: true })

function loadImage(url: string) {
  imageLoading.value = true
  const img = new window.Image()
  if (!url.startsWith('blob:')) {
    img.crossOrigin = 'Anonymous'
  }
  img.src = url
  img.onload = () => {
    imageObj.value = img
    imageLoading.value = false
  }
  img.onerror = () => {
    imageLoading.value = false
    console.error("Failed to load image:", url)
  }
}

// --- Smart Crop Calculation ---
const imageConfig = computed(() => {
  if (!imageObj.value) return {}

  const imgW = imageObj.value.width
  const imgH = imageObj.value.height
  const frameW = props.config.width
  const frameH = props.config.height

  // Base scale to "cover" the frame
  const scaleX = frameW / imgW
  const scaleY = frameH / imgH
  const baseScale = Math.max(scaleX, scaleY)

  // Apply user crop/zoom
  const userScale = props.state.cropData.scale || 1
  const finalScale = baseScale * userScale

  // Center it by default
  const scaledImgW = imgW * finalScale
  const scaledImgH = imgH * finalScale
  
  let x = (frameW - scaledImgW) / 2 + (props.state.cropData.x || 0)
  let y = (frameH - scaledImgH) / 2 + (props.state.cropData.y || 0)

  return {
    image: imageObj.value,
    x: x * props.scale,
    y: y * props.scale,
    width: scaledImgW * props.scale,
    height: scaledImgH * props.scale,
    // Clip to frame boundary
    clipFunc: (ctx: CanvasRenderingContext2D) => {
      if (props.config.cornerRadius) {
        ctx.beginPath()
        const r = props.config.cornerRadius * props.scale
        const w = frameW * props.scale
        const h = frameH * props.scale
        ctx.moveTo(r, 0)
        ctx.lineTo(w - r, 0)
        ctx.quadraticCurveTo(w, 0, w, r)
        ctx.lineTo(w, h - r)
        ctx.quadraticCurveTo(w, h, w - r, h)
        ctx.lineTo(r, h)
        ctx.quadraticCurveTo(0, h, 0, h - r)
        ctx.lineTo(0, r)
        ctx.quadraticCurveTo(0, 0, r, 0)
        ctx.closePath()
      } else {
        ctx.rect(0, 0, frameW * props.scale, frameH * props.scale)
      }
    }
  }
})

// --- Interaction ---
function onClick(e: any) {
  // Cancel bubbling so stage click doesn't clear it
  e.cancelBubble = true
  editorStore.selectElement({
    type: 'frame',
    id: props.config.id,
    pageIndex: editorStore.currentPageIndex
  })
}
</script>
