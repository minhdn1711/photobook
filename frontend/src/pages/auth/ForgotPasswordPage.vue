<template>
  <div class="min-h-screen bg-warm-50 flex flex-col">
    <header class="bg-white border-b border-warm-100 px-6 py-4">
      <RouterLink to="/" class="font-heading text-xl font-bold text-warm-900">📖 Photobook</RouterLink>
    </header>
    <div class="flex-1 flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-md">
        <div class="bg-white rounded-2xl shadow-sm border border-warm-100 p-8">
          <div class="text-center mb-8">
            <h1 class="text-2xl font-heading font-bold text-warm-900 mb-2">Quên mật khẩu</h1>
            <p class="text-warm-500 text-sm">Nhập email để nhận link đặt lại mật khẩu</p>
          </div>
          <div v-if="!sent">
            <form @submit.prevent="handleSubmit" class="space-y-5">
              <div>
                <label class="block text-sm font-medium text-warm-700 mb-1.5">Email</label>
                <input v-model="email" type="email" required placeholder="email@example.com"
                  class="w-full px-4 py-3 rounded-xl border border-warm-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition" />
              </div>
              <button type="submit" class="btn-primary w-full py-3">Gửi link đặt lại</button>
            </form>
          </div>
          <div v-else class="text-center py-4">
            <div class="text-5xl mb-4">📬</div>
            <p class="text-warm-700 font-medium mb-2">Đã gửi email!</p>
            <p class="text-warm-500 text-sm">Kiểm tra hộp thư của bạn để đặt lại mật khẩu.</p>
          </div>
          <div class="mt-6 text-center">
            <RouterLink to="/login" class="text-accent text-sm hover:underline">← Quay lại đăng nhập</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
const email = ref('')
const sent  = ref(false)
function handleSubmit() { sent.value = true }
</script>
