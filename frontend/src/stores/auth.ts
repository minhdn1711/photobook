import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'
import { api } from '@/lib/api'

export const useAuthStore = defineStore('auth', () => {
  // ── State ────────────────────────────────────────────────────
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const initialized = ref(false)

  // ── Getters ──────────────────────────────────────────────────
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  // ── Actions ──────────────────────────────────────────────────

  async function init() {
    if (initialized.value) return

    if (token.value) {
      try {
        const response = await api.get<User>('/auth/me')
        user.value = response.data
      } catch {
        // Token invalid — clear it
        token.value = null
        localStorage.removeItem('auth_token')
      }
    }

    initialized.value = true
  }

  /** Login with email/password */
  async function login(email: string, password: string) {
    const response = await api.post<{ token: string; user: User }>('/auth/login', {
      email,
      password,
    })

    token.value = response.data.token
    user.value = response.data.user
    localStorage.setItem('auth_token', token.value)
  }

  /** Register new account */
  async function register(name: string, email: string, password: string, passwordConfirmation: string) {
    const response = await api.post<{ token: string; user: User }>('/auth/register', {
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    })

    token.value = response.data.token
    user.value = response.data.user
    localStorage.setItem('auth_token', token.value)
  }

  /** Logout */
  async function logout() {
    try {
      if (token.value) {
        await api.post('/auth/logout')
      }
    } catch {
      // Ignore errors on logout
    } finally {
      user.value = null
      token.value = null
      localStorage.removeItem('auth_token')
    }
  }

  return {
    // State
    user,
    token,
    initialized,
    // Getters
    isAuthenticated,
    isAdmin,
    // Actions
    init,
    login,
    register,
    logout,
  }
})
