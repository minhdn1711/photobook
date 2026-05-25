<template>
  <v-group @click="onStageClick" @tap="onStageClick">
    <!-- Background -->
    <v-rect
      :config="{
        x: 0,
        y: 0,
        width: pageConfig.canvasSize.width * scale,
        height: pageConfig.canvasSize.height * scale,
        fill: pageConfig.background,
      }"
    />

    <!-- Frames -->
    <v-group>
      <KonvaFrame
        v-for="frame in pageConfig.frames"
        :key="frame.id"
        :config="frame"
        :state="getFrameState(frame.id)!"
        :scale="scale"
      />
    </v-group>
    <!-- Texts -->
    <v-group>
      <KonvaText
        v-for="text in pageConfig.texts"
        :key="text.id"
        :config="text"
        :state="getTextState(text.id)!"
        :scale="scale"
      />
    </v-group>
  </v-group>
</template>

<script setup lang="ts">
import type { TemplatePageConfig, PageState } from '@/types'
import KonvaFrame from './KonvaFrame.vue'
import KonvaText from './KonvaText.vue'
import { useEditorStore } from '@/stores/editor'

const props = defineProps<{
  pageConfig: TemplatePageConfig
  pageState: PageState
  scale: number
}>()

const editorStore = useEditorStore()

function getFrameState(frameId: string) {
  return props.pageState.frames.find(f => f.frameId === frameId)
}

function getTextState(textId: string) {
  return props.pageState.texts.find(t => t.textId === textId)
}

function onStageClick(e: any) {
  // If clicked on empty space (background), clear selection
  if (e.target.name() !== 'frame' && !e.target.name()?.startsWith('frame-')) {
    editorStore.selectElement(null)
  }
}
</script>
