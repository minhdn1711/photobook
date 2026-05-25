<template>
  <div class="min-h-screen bg-warm-50 flex flex-col">
    <header class="bg-white border-b border-warm-100 px-6 py-4">
      <RouterLink to="/" class="font-heading text-xl font-bold text-warm-900">
        📖 Photobook
      </RouterLink>
    </header>

    <div class="flex-1 flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-md">
        <div class="bg-white rounded-2xl shadow-sm border border-warm-100 p-8">
          <div class="text-center mb-8">
            <h1 class="text-2xl font-heading font-bold text-warm-900 mb-2">Tạo tài khoản</h1>
            <p class="text-warm-500 text-sm">Miễn phí — bắt đầu ngay hôm nay</p>
          </div>

          <form @submit.prevent="handleRegister" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-warm-700 mb-1.5">Họ và tên</label>
              <input
                v-model="form.name"
                type="text"
                required
                autocomplete="name"
                placeholder="Nguyễn Văn A"
                class="w-full px-4 py-3 rounded-xl border border-warm-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition text-warm-900 placeholder-warm-400"
              />
            </div>

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
              <p v-if="fieldErrors.email" class="text-red-600 text-xs mt-1">{{ fieldErrors.email[0] }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-warm-700 mb-1.5">Số điện thoại</label>
              <input
                v-model="form.phone"
                type="tel"
                autocomplete="tel"
                placeholder="0901 234 567"
                class="w-full px-4 py-3 rounded-xl border border-warm-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition text-warm-900 placeholder-warm-400"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-warm-700 mb-1.5">Mật khẩu</label>
              <input
                v-model="form.password"
                type="password"
                required
                autocomplete="new-password"
                placeholder="Ít nhất 8 ký tự"
                class="w-full px-4 py-3 rounded-xl border border-warm-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition text-warm-900 placeholder-warm-400"
              />
              <p v-if="fieldErrors.password" class="text-red-600 text-xs mt-1">{{ fieldErrors.password[0] }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-warm-700 mb-1.5">Xác nhận mật khẩu</label>
              <input
                v-model="form.password_confirmation"
                type="password"
                required
                autocomplete="new-password"
                placeholder="Nhập lại mật khẩu"
                class="w-full px-4 py-3 rounded-xl border border-warm-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition text-warm-900 placeholder-warm-400"
              />
            </div>

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
                Đang tạo tài khoản...
              </span>
              <span v-else>Tạo tài khoản miễn phí</span>
            </button>
          </form>

          <div class="mt-6 text-center text-sm text-warm-500">
            Đã có tài khoản?
            <RouterLink to="/login" class="text-accent font-medium hover:underline ml-1">
              Đăng nhập
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router    = useRouter()
const authStore = useAuthStore()

const form = reactive({
  name: '', email: '', phone: '', password: '', password_confirmation: ''
})
const loading     = ref(false)
const errorMsg    = ref('')
const fieldErrors = ref<Record<string, string[]>>({})

async function handleRegister() {
  loading.value     = true
  errorMsg.value    = ''
  fieldErrors.value = {}

  try {
    await authStore.register(form.name, form.email, form.password, form.password_confirmation)
    router.push('/dashboard')
  } catch (e: any) {
    const data = e?.response?.data
    if (data?.errors) {
      fieldErrors.value = data.errors
    } else {
      errorMsg.value = data?.message ?? 'Đăng ký thất bại, vui lòng thử lại'
    }
  } finally {
    loading.value = false
  }
}
</script>
