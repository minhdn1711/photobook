<template>
  <div class="min-h-screen bg-warm-50 flex flex-col">
    <!-- Header minimal -->
    <header class="bg-white border-b border-warm-100 px-6 py-4">
      <RouterLink to="/" class="font-heading text-xl font-bold text-warm-900">
        📖 Photobook
      </RouterLink>
    </header>

    <div class="flex-1 flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-md">
        <!-- Card -->
        <div class="bg-white rounded-2xl shadow-sm border border-warm-100 p-8">
          <div class="text-center mb-8">
            <h1 class="text-2xl font-heading font-bold text-warm-900 mb-2">Đăng nhập</h1>
            <p class="text-warm-500 text-sm">Chào mừng trở lại!</p>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleLogin" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-warm-700 mb-1.5">Email</label>
              <input
                v-model="form.email"
                type="email"
                required
                autocomplete="email"
                placeholder="email@example.com"
                class="w-full px-4 py-3 rounded-xl border border-warm-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition text-warm-900 placeholder-warm-400"
              />
            </div>

            <div>
              <div class="flex justify-between mb-1.5">
                <label class="text-sm font-medium text-warm-700">Mật khẩu</label>
                <RouterLink to="/forgot-password" class="text-sm text-accent hover:underline">
                  Quên mật khẩu?
                </RouterLink>
              </div>
              <input
                v-model="form.password"
                type="password"
                required
                autocomplete="current-password"
                placeholder="••••••••"
                class="w-full px-4 py-3 rounded-xl border border-warm-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition text-warm-900 placeholder-warm-400"
              />
            </div>

            <!-- Error -->
            <div v-if="errorMsg" class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
              {{ errorMsg }}
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="btn-primary w-full py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span v-if="loading" class="flex items-center justify-center gap-2">
                <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"/>
                </svg>
                Đang đăng nhập...
              </span>
              <span v-else>Đăng nhập</span>
            </button>
          </form>

          <div class="mt-6 text-center text-sm text-warm-500">
            Chưa có tài khoản?
            <RouterLink to="/register" class="text-accent font-medium hover:underline ml-1">
              Đăng ký ngay
            </RouterLink>
          </div>
        </div>

        <!-- Demo hint -->
        <div class="mt-4 bg-warm-100 rounded-xl px-4 py-3 text-xs text-warm-600 text-center space-y-1">
          <p><strong>Khách hàng:</strong> <span class="font-mono">demo@photobook.vn</span> / <span class="font-mono">Demo@12345</span></p>
          <p><strong>Admin:</strong> <span class="font-mono">admin@photobook.vn</span> / <span class="font-mono">Admin@12345</span></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router    = useRouter()
const route     = useRoute()
const authStore = useAuthStore()

const form = reactive({ email: '', password: '' })
const loading  = ref(false)
const errorMsg = ref('')

async function handleLogin() {
  loading.value  = true
  errorMsg.value = ''

  try {
    await authStore.login(form.email, form.password)
    const redirect = (route.query.redirect as string) || '/dashboard'
    router.push(redirect)
  } catch (e: any) {
    errorMsg.value = e?.response?.data?.message ?? 'Email hoặc mật khẩu không đúng'
  } finally {
    loading.value = false
  }
}
</script>
