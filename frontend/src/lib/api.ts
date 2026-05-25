import axios from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'
import { useUiStore } from '@/stores/ui'

// ── Create Axios Instance ─────────────────────────────────────
const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL ?? '/api'}`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

// ── Request Interceptor (attach auth token) ───────────────────
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Response Interceptor (handle global errors) ───────────────
axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const uiStore = useUiStore()

    if (error.response?.status === 401) {
      const currentToken = localStorage.getItem('auth_token')
      if (currentToken && currentToken.startsWith('mock-')) {
        // Ignore 401 for mock mode so we can fallback to mock data without getting logged out
        console.warn('API returned 401, but keeping mock session active.')
        return Promise.reject(error)
      }

      // Token expired — clear auth and redirect
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
      return Promise.reject(error)
    }

    if (error.response?.status === 403) {
      uiStore.error('Không có quyền truy cập', 'Bạn không có quyền thực hiện thao tác này.')
    }

    if (error.response?.status === 422) {
      // Validation errors — let component handle them
      return Promise.reject(error)
    }

    if (error.response?.status >= 500) {
      // uiStore.error('Lỗi server', 'Đã có lỗi xảy ra. Vui lòng thử lại sau.')
      console.error('Server error (suppressed for mock mode):', error)
    }

    if (!error.response) {
      // uiStore.error('Mất kết nối', 'Kiểm tra kết nối internet và thử lại.')
      console.error('Network error (suppressed for mock mode):', error)
    }

    return Promise.reject(error)
  }
)

// ── Typed API wrapper ─────────────────────────────────────────
export const api = {
  get<T>(url: string, params?: Record<string, unknown>): Promise<AxiosResponse<T>> {
    return axiosInstance.get(url, { params })
  },

  post<T>(url: string, data?: unknown): Promise<AxiosResponse<T>> {
    return axiosInstance.post(url, data)
  },

  put<T>(url: string, data?: unknown): Promise<AxiosResponse<T>> {
    return axiosInstance.put(url, data)
  },

  patch<T>(url: string, data?: unknown): Promise<AxiosResponse<T>> {
    return axiosInstance.patch(url, data)
  },

  delete<T>(url: string): Promise<AxiosResponse<T>> {
    return axiosInstance.delete(url)
  },

  /** Upload with multipart/form-data and progress tracking */
  upload<T>(
    url: string,
    formData: FormData,
    onProgress?: (percent: number) => void
  ): Promise<AxiosResponse<T>> {
    return axiosInstance.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (event) => {
        if (onProgress && event.total) {
          onProgress(Math.round((event.loaded * 100) / event.total))
        }
      },
    })
  },
}

export default axiosInstance
