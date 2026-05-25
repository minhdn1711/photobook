<template>
  <header
    class="sticky top-0 z-header bg-white/95 backdrop-blur-sm border-b border-warm-200"
    :class="{ 'shadow-sm': scrolled }"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">

        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-2 flex-shrink-0 group">
          <div class="w-8 h-8 bg-accent rounded-lg flex items-center justify-center
                      text-white font-bold text-sm shadow-sm
                      group-hover:bg-accent-dark transition-colors duration-fast">
            P
          </div>
          <span class="font-heading font-semibold text-warm-900 text-lg leading-none">
            Photo<span class="text-accent">book</span>
          </span>
        </RouterLink>

        <!-- Desktop nav -->
        <nav class="hidden md:flex items-center gap-6">
          <RouterLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="text-sm font-medium text-warm-600 hover:text-accent
                   transition-colors duration-fast relative py-1"
            active-class="text-accent"
          >
            {{ link.label }}
          </RouterLink>
        </nav>

        <!-- Right actions -->
        <div class="flex items-center gap-3">
          <!-- Authenticated -->
          <template v-if="authStore.isAuthenticated">
            <RouterLink
              to="/dashboard"
              class="hidden sm:flex items-center gap-2 text-sm font-medium
                     text-warm-700 hover:text-accent transition-colors duration-fast"
            >
              <div class="w-7 h-7 rounded-full bg-warm-200 flex items-center
                          justify-center text-xs font-semibold text-warm-700">
                {{ initials }}
              </div>
              <span class="max-w-[120px] truncate">{{ authStore.user?.name }}</span>
            </RouterLink>

            <RouterLink
              to="/dashboard/drafts"
              class="btn-primary text-sm hidden sm:flex"
            >
              + Tạo mới
            </RouterLink>
          </template>

          <!-- Guest -->
          <template v-else>
            <RouterLink
              to="/login"
              class="text-sm font-medium text-warm-700 hover:text-accent
                     transition-colors duration-fast hidden sm:inline"
            >
              Đăng nhập
            </RouterLink>
            <RouterLink
              to="/register"
              class="btn-primary text-sm"
            >
              Bắt đầu miễn phí
            </RouterLink>
          </template>

          <!-- Mobile menu toggle -->
          <button
            @click="mobileOpen = !mobileOpen"
            class="md:hidden p-2 rounded-lg text-warm-600 hover:text-warm-900
                   hover:bg-warm-100 transition-colors duration-fast"
            :aria-expanded="mobileOpen"
            aria-label="Menu"
          >
            <span v-if="!mobileOpen" class="text-lg leading-none">☰</span>
            <span v-else class="text-lg leading-none">✕</span>
          </button>
        </div>
      </div>

      <!-- Mobile nav drawer -->
      <Transition name="slide-down">
        <div
          v-if="mobileOpen"
          class="md:hidden border-t border-warm-200 py-4 space-y-1"
        >
          <RouterLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            @click="mobileOpen = false"
            class="block px-3 py-2.5 rounded-lg text-sm font-medium
                   text-warm-700 hover:text-accent hover:bg-warm-50
                   transition-colors duration-fast"
            active-class="text-accent bg-warm-50"
          >
            {{ link.label }}
          </RouterLink>

          <div class="border-t border-warm-200 pt-3 mt-3 flex flex-col gap-2">
            <RouterLink
              v-if="!authStore.isAuthenticated"
              to="/login"
              @click="mobileOpen = false"
              class="block px-3 py-2.5 text-sm font-medium text-warm-700
                     hover:text-accent transition-colors duration-fast"
            >
              Đăng nhập
            </RouterLink>
            <RouterLink
              :to="authStore.isAuthenticated ? '/dashboard/drafts' : '/register'"
              @click="mobileOpen = false"
              class="btn-primary text-center text-sm"
            >
              {{ authStore.isAuthenticated ? '+ Tạo photobook mới' : 'Bắt đầu miễn phí' }}
            </RouterLink>
          </div>
        </div>
      </Transition>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const mobileOpen = ref(false)
const scrolled    = ref(false)

const navLinks = [
  { to: '/templates', label: 'Mẫu thiết kế' },
  { to: '/pricing',   label: 'Bảng giá' },
  { to: '/faq',       label: 'Hướng dẫn' },
]

const initials = computed(() => {
  const name = authStore.user?.name ?? ''
  return name
    .split(' ')
    .map(w => w[0])
    .slice(-2)
    .join('')
    .toUpperCase()
})

function handleScroll() {
  scrolled.value = window.scrollY > 8
}

onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 200ms ease;
  overflow: hidden;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  max-height: 0;
}
.slide-down-enter-to,
.slide-down-leave-from {
  opacity: 1;
  max-height: 400px;
}
</style>
