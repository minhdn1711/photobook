import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type {
  Project,
  Template,
  PageState,
  FrameState,
  TextState,
  CropData,
  Photo,
  SelectedElement,
  CropModeState,
  SaveStatus,
  PageCompletionStatus,
} from '@/types'
import { api } from '@/lib/api'
import { useUiStore } from './ui'

// ── History Entry (for Undo/Redo) ─────────────────────────────
interface HistoryEntry {
  pages: PageState[]        // deep clone of pages state
  timestamp: number
}

const MAX_HISTORY = 30

export const useEditorStore = defineStore('editor', () => {
  const uiStore = useUiStore()

  // ── Project & Template State ──────────────────────────────────
  const project = ref<Project | null>(null)
  const template = ref<Template | null>(null)
  const pages = ref<PageState[]>([])

  // ── Navigation ────────────────────────────────────────────────
  const currentPageIndex = ref(0)

  // ── Photo Library ─────────────────────────────────────────────
  const uploadedPhotos = ref<Photo[]>([])

  // ── UI State ──────────────────────────────────────────────────
  const selectedElement = ref<SelectedElement | null>(null)
  const cropMode = ref<CropModeState | null>(null)
  const isPreviewOpen = ref(false)
  const saveStatus = ref<SaveStatus>('saved')

  // ── History ───────────────────────────────────────────────────
  const history = ref<HistoryEntry[]>([])
  const historyIndex = ref(-1)

  // ── Autosave Timer ────────────────────────────────────────────
  let autosaveTimer: ReturnType<typeof setTimeout> | null = null

  // ── Computed ──────────────────────────────────────────────────
  const currentPage = computed(() => pages.value[currentPageIndex.value] ?? null)

  const pageCompletionStatuses = computed((): PageCompletionStatus[] => {
    if (!template.value) return []

    return pages.value.map((page, index) => {
      const pageConfig = template.value!.pages[index]
      const totalFrames = pageConfig.frames.length
      const requiredFrames = pageConfig.frames.filter(f => f.required).length
      const filledFrames = page.frames.filter(f => f.photoId !== null).length
      const filledRequiredFrames = page.frames.filter(
        (f) => f.photoId !== null &&
        pageConfig.frames.find(pf => pf.id === f.frameId)?.required
      ).length

      // TODO: integrate DPI check results
      const hasLowDpiWarnings = false

      return {
        pageIndex: index,
        totalFrames,
        filledFrames,
        requiredFrames,
        filledRequiredFrames,
        hasLowDpiWarnings,
        isComplete: filledRequiredFrames === requiredFrames && filledFrames > 0,
      }
    })
  })

  const totalCompletedPages = computed(
    () => pageCompletionStatuses.value.filter(p => p.isComplete).length
  )

  const canSubmit = computed(
    () => pageCompletionStatuses.value.every(p => p.isComplete)
  )

  // ── Load Project ──────────────────────────────────────────────

  async function loadProject(projectId: string) {
    const response = await api.get<{ project: Project; template: Template }>(
      `/projects/${projectId}`
    )
    project.value = response.data.project
    template.value = response.data.template
    pages.value = response.data.project.pages

    // Initialize from localStorage draft if newer
    const localDraft = getLocalDraft(projectId)
    if (localDraft && new Date(localDraft.timestamp) > new Date(project.value.lastSavedAt ?? 0)) {
      pages.value = localDraft.pages
    }

    // Load uploaded photos for this project
    await loadPhotos()

    // Push initial state to history
    pushHistory()
  }

  async function createProject(templateId: number, name: string): Promise<string> {
    const response = await api.post<Project>('/projects', { template_id: templateId, name })
    project.value = response.data
    return response.data.id
  }

  async function loadPhotos() {
    if (!project.value) return
    const response = await api.get<Photo[]>(`/projects/${project.value.id}/photos`)
    uploadedPhotos.value = response.data
  }

  // ── Navigation ────────────────────────────────────────────────

  function navigatePage(index: number) {
    if (index < 0 || index > 15) return
    currentPageIndex.value = index
    selectedElement.value = null
    cropMode.value = null
  }

  function nextPage() {
    navigatePage(currentPageIndex.value + 1)
  }

  function prevPage() {
    navigatePage(currentPageIndex.value - 1)
  }

  // ── Photo Assignment ──────────────────────────────────────────

  function assignPhoto(pageIndex: number, frameId: string, photoId: string) {
    const page = pages.value[pageIndex]
    if (!page) return

    const frame = page.frames.find(f => f.frameId === frameId)
    if (!frame) return

    frame.photoId = photoId
    frame.cropData = { x: 0, y: 0, scale: 1 } // Reset crop on new photo

    scheduleAutosave()
    pushHistory()
  }

  function removePhoto(pageIndex: number, frameId: string) {
    const page = pages.value[pageIndex]
    const frame = page?.frames.find(f => f.frameId === frameId)
    if (!frame) return

    frame.photoId = null
    frame.cropData = { x: 0, y: 0, scale: 1 }

    scheduleAutosave()
    pushHistory()
  }

  function updateCrop(pageIndex: number, frameId: string, cropData: CropData) {
    const page = pages.value[pageIndex]
    const frame = page?.frames.find(f => f.frameId === frameId)
    if (!frame) return

    frame.cropData = { ...cropData }
    scheduleAutosave()
    // Don't push history for every crop move — push on crop confirm
  }

  function confirmCrop(pageIndex: number, frameId: string) {
    pushHistory()
    cropMode.value = null
  }

  // ── Text Editing ──────────────────────────────────────────────

  function updateText(pageIndex: number, textId: string, content: string) {
    const page = pages.value[pageIndex]
    const text = page?.texts.find(t => t.textId === textId)
    if (!text) return

    text.content = content
    scheduleAutosave()
  }

  function updateTextStyle(
    pageIndex: number,
    textId: string,
    style: Partial<Pick<TextState, 'fontFamily' | 'fontSize' | 'color' | 'textAlign' | 'fontWeight'>>
  ) {
    const page = pages.value[pageIndex]
    const text = page?.texts.find(t => t.textId === textId)
    if (!text) return

    Object.assign(text, style)
    scheduleAutosave()
    pushHistory()
  }

  // ── Selection ─────────────────────────────────────────────────

  function selectElement(element: SelectedElement | null) {
    selectedElement.value = element
    if (element?.type !== 'frame') {
      cropMode.value = null
    }
  }

  function enterCropMode(pageIndex: number, frameId: string) {
    cropMode.value = { frameId, pageIndex }
    selectedElement.value = { type: 'frame', id: frameId, pageIndex }
  }

  function exitCropMode(confirm = true) {
    if (confirm && cropMode.value) {
      confirmCrop(cropMode.value.pageIndex, cropMode.value.frameId)
    }
    cropMode.value = null
  }

  // ── History (Undo/Redo) ───────────────────────────────────────

  function pushHistory() {
    // Truncate forward history when new action taken
    if (historyIndex.value < history.value.length - 1) {
      history.value = history.value.slice(0, historyIndex.value + 1)
    }

    history.value.push({
      pages: JSON.parse(JSON.stringify(pages.value)),
      timestamp: Date.now(),
    })

    // Limit history size
    if (history.value.length > MAX_HISTORY) {
      history.value.shift()
    } else {
      historyIndex.value = history.value.length - 1
    }
  }

  function undo() {
    if (historyIndex.value <= 0) return

    historyIndex.value--
    pages.value = JSON.parse(JSON.stringify(history.value[historyIndex.value].pages))
    scheduleAutosave()
  }

  function redo() {
    if (historyIndex.value >= history.value.length - 1) return

    historyIndex.value++
    pages.value = JSON.parse(JSON.stringify(history.value[historyIndex.value].pages))
    scheduleAutosave()
  }

  const canUndo = computed(() => historyIndex.value > 0)
  const canRedo = computed(() => historyIndex.value < history.value.length - 1)

  // ── Autosave ──────────────────────────────────────────────────

  function scheduleAutosave() {
    saveStatus.value = 'unsaved'

    if (autosaveTimer) clearTimeout(autosaveTimer)

    autosaveTimer = setTimeout(() => {
      performAutosave()
    }, 2500)
  }

  async function performAutosave() {
    if (!project.value) return

    saveStatus.value = 'saving'

    // 1. Always save to localStorage first (instant, offline-capable)
    saveLocalDraft(project.value.id, pages.value)

    // 2. Save to API
    try {
      await api.post(`/projects/${project.value.id}/autosave`, {
        pages: pages.value,
      })
      saveStatus.value = 'saved'
    } catch {
      saveStatus.value = 'error'
      uiStore.showToast({
        type: 'warning',
        title: 'Không thể lưu lên server',
        message: 'Bản nháp đã được lưu cục bộ. Sẽ thử lại khi có kết nối.',
      })
    }
  }

  // ── LocalStorage Draft ────────────────────────────────────────

  function saveLocalDraft(projectId: string, pagesData: PageState[]) {
    try {
      localStorage.setItem(
        `photobook_draft_${projectId}`,
        JSON.stringify({ pages: pagesData, timestamp: new Date().toISOString() })
      )
    } catch (e) {
      // localStorage might be full
      console.warn('Failed to save draft to localStorage:', e)
    }
  }

  function getLocalDraft(projectId: string): { pages: PageState[]; timestamp: string } | null {
    try {
      const raw = localStorage.getItem(`photobook_draft_${projectId}`)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  }

  function clearLocalDraft(projectId: string) {
    localStorage.removeItem(`photobook_draft_${projectId}`)
  }

  // ── Preview ───────────────────────────────────────────────────

  function openPreview() { isPreviewOpen.value = true }
  function closePreview() { isPreviewOpen.value = false }

  return {
    // State
    project,
    template,
    pages,
    currentPageIndex,
    uploadedPhotos,
    selectedElement,
    cropMode,
    isPreviewOpen,
    saveStatus,
    // Computed
    currentPage,
    pageCompletionStatuses,
    totalCompletedPages,
    canSubmit,
    canUndo,
    canRedo,
    // Actions
    loadProject,
    createProject,
    loadPhotos,
    navigatePage,
    nextPage,
    prevPage,
    assignPhoto,
    removePhoto,
    updateCrop,
    confirmCrop,
    updateText,
    updateTextStyle,
    selectElement,
    enterCropMode,
    exitCropMode,
    undo,
    redo,
    performAutosave,
    openPreview,
    closePreview,
    clearLocalDraft,
  }
})
