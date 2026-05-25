<template>
  <v-group
    :config="{
      x: config.x * scale,
      y: config.y * scale,
      name: `text-${config.id}`
    }"
  >
    <!-- Background highlight if selected -->
    <v-rect
      v-if="isSelected"
      :config="{
        width: config.width * scale,
        height: Math.max(config.height * scale, textHeight),
        stroke: '#3b82f6',
        strokeWidth: 2,
        dash: [5, 5]
      }"
    />

    <!-- The actual text node -->
    <v-text
      ref="textNodeRef"
      :config="{
        width: config.width * scale,
        text: displayText,
        fontSize: (state?.fontSize || config.defaultFontSize) * scale,
        fontFamily: state?.fontFamily || config.defaultFont,
        fontStyle: (state?.fontWeight || config.fontWeight) === 'bold' ? 'bold' : 'normal',
        fill: state?.color || config.defaultColor,
        align: state?.textAlign || config.textAlign,
        opacity: isEditing ? 0 : 1, // hide text node when HTML textarea is shown
      }"
      @click="onClick"
      @tap="onClick"
      @dblclick="onDoubleClick"
      @dbltap="onDoubleClick"
    />
  </v-group>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import type { TextDefinition, TextState } from '@/types'
import { useEditorStore } from '@/stores/editor'

const props = defineProps<{
  config: TextDefinition
  state?: TextState
  scale: number
}>()

const editorStore = useEditorStore()
const textNodeRef = ref<any>(null)
const textHeight = ref(props.config.height * props.scale)

const isSelected = computed(() => {
  return editorStore.selectedElement?.type === 'text' && 
         editorStore.selectedElement?.id === props.config.id
})

const isEditing = ref(false)

const displayText = computed(() => {
  if (!props.state || !props.state.content) return props.config.defaultText || 'Nhập văn bản...'
  return props.state.content
})

// Calculate text height so the selection bounding box covers it properly
watch([displayText, () => props.state?.fontSize, () => props.scale], () => {
  if (textNodeRef.value) {
    const node = textNodeRef.value.getNode()
    textHeight.value = node.height()
  }
})

function onClick(e: any) {
  e.cancelBubble = true
  if (!props.config.isEditable) return
  editorStore.selectElement({
    type: 'text',
    id: props.config.id,
    pageIndex: editorStore.currentPageIndex
  })
}

// Inline editing logic via floating HTML textarea
function onDoubleClick(e: any) {
  e.cancelBubble = true
  if (!props.config.isEditable) return
  
  isEditing.value = true
  
  const textNode = textNodeRef.value.getNode()
  const stage = textNode.getStage()
  
  // Create textarea
  const textarea = document.createElement('textarea')
  document.body.appendChild(textarea)
  
  // Position it
  const textPosition = textNode.absolutePosition()
  const stageBox = stage.container().getBoundingClientRect()
  
  const areaPosition = {
    x: stageBox.left + textPosition.x,
    y: stageBox.top + textPosition.y,
  }
  
  textarea.value = props.state?.content || props.config.defaultText || ''
  textarea.style.position = 'absolute'
  textarea.style.top = areaPosition.y + 'px'
  textarea.style.left = areaPosition.x + 'px'
  textarea.style.width = (textNode.width() - textNode.padding() * 2) + 'px'
  textarea.style.height = textNode.height() - textNode.padding() * 2 + 5 + 'px'
  textarea.style.fontSize = ((props.state?.fontSize || props.config.defaultFontSize) * props.scale) + 'px'
  textarea.style.border = 'none'
  textarea.style.padding = '0px'
  textarea.style.margin = '0px'
  textarea.style.overflow = 'hidden'
  textarea.style.background = 'none'
  textarea.style.outline = 'none'
  textarea.style.resize = 'none'
  textarea.style.lineHeight = textNode.lineHeight()
  textarea.style.fontFamily = props.state?.fontFamily || props.config.defaultFont
  textarea.style.transformOrigin = 'left top'
  textarea.style.textAlign = props.state?.textAlign || props.config.textAlign
  textarea.style.color = props.state?.color || props.config.defaultColor
  
  textarea.focus()
  
  // Handle removal and saving
  function removeTextarea() {
    if (textarea.parentNode) {
      textarea.parentNode.removeChild(textarea)
    }
    window.removeEventListener('click', handleOutsideClick)
    isEditing.value = false
    
    // Save
    editorStore.updateText(editorStore.currentPageIndex, props.config.id, textarea.value)
  }
  
  function handleOutsideClick(e: MouseEvent) {
    if (e.target !== textarea) {
      removeTextarea()
    }
  }
  
  // Delay attaching listener so it doesn't fire immediately
  setTimeout(() => {
    window.addEventListener('click', handleOutsideClick)
  })
  
  textarea.addEventListener('keydown', function (e) {
    // Hide on Enter
    if (e.keyCode === 13 && !e.shiftKey) {
      removeTextarea()
    }
    // Hide on Esc
    if (e.keyCode === 27) {
      removeTextarea()
    }
  })
}
</script>
