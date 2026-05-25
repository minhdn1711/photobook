import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ToastMessage } from '@/types'

let toastIdCounter = 0

export const useUiStore = defineStore('ui', () => {
  // ── Toasts ────────────────────────────────────────────────────
  const toasts = ref<ToastMessage[]>([])

  function showToast(toast: Omit<ToastMessage, 'id'>) {
    const id = `toast_${++toastIdCounter}`
    const duration = toast.duration ?? 4000

    toasts.value.push({ ...toast, id })

    if (duration > 0) {
      setTimeout(() => removeToast(id), duration)
    }

    return id
  }

  function removeToast(id: string) {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index !== -1) toasts.value.splice(index, 1)
  }

  // Convenience methods
  function success(title: string, message?: string) {
    return showToast({ type: 'success', title, message })
  }

  function error(title: string, message?: string) {
    return showToast({ type: 'error', title, message, duration: 6000 })
  }

  function warning(title: string, message?: string) {
    return showToast({ type: 'warning', title, message })
  }

  function info(title: string, message?: string) {
    return showToast({ type: 'info', title, message })
  }

  // ── Global Loading ────────────────────────────────────────────
  const isGlobalLoading = ref(false)

  function setLoading(loading: boolean) {
    isGlobalLoading.value = loading
  }

  // ── Mobile Sidebar ────────────────────────────────────────────
  const isMobileSidebarOpen = ref(false)

  function toggleMobileSidebar() {
    isMobileSidebarOpen.value = !isMobileSidebarOpen.value
  }

  return {
    toasts,
    showToast,
    removeToast,
    success,
    error,
    warning,
    info,
    isGlobalLoading,
    setLoading,
    isMobileSidebarOpen,
    toggleMobileSidebar,
  }
})
