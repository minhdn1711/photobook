<template>
  <div class="min-h-screen bg-warm-50 flex">
    
    <!-- Sidebar -->
    <aside 
      class="w-64 flex-shrink-0 transition-colors duration-300 border-r flex flex-col"
      :class="isDarkSidebar ? 'bg-warm-900 border-warm-800 text-white' : 'bg-white border-warm-200 text-warm-900'"
    >
      <div class="h-16 flex items-center justify-between px-6 border-b" :class="isDarkSidebar ? 'border-warm-800' : 'border-warm-200'">
        <RouterLink to="/admin/dashboard" class="font-heading font-bold text-xl flex items-center gap-2">
          <span class="text-accent-500">📸</span> Photobook 
          <span class="text-xs px-2 py-0.5 rounded bg-red-100 text-red-600 font-sans ml-1">ADMIN</span>
        </RouterLink>
      </div>

      <nav class="flex-1 py-6 px-4 space-y-1">
        <RouterLink 
          v-for="item in navItems" 
          :key="item.path"
          :to="item.path"
          class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors"
          :class="[
            route.path.startsWith(item.path) 
              ? (isDarkSidebar ? 'bg-warm-800 text-white' : 'bg-warm-100 text-accent-700')
              : (isDarkSidebar ? 'text-warm-400 hover:bg-warm-800/50 hover:text-white' : 'text-warm-600 hover:bg-warm-50 hover:text-warm-900')
          ]"
        >
          <span class="mr-3 text-lg">{{ item.icon }}</span>
          {{ item.label }}
        </RouterLink>
      </nav>

      <!-- Sidebar Toggle -->
      <div class="p-4 border-t" :class="isDarkSidebar ? 'border-warm-800' : 'border-warm-200'">
        <button 
          @click="toggleTheme" 
          class="flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors"
          :class="isDarkSidebar ? 'text-warm-400 hover:bg-warm-800 hover:text-white' : 'text-warm-600 hover:bg-warm-50 hover:text-warm-900'"
        >
          <span class="mr-3 text-lg">{{ isDarkSidebar ? '☀️' : '🌙' }}</span>
          {{ isDarkSidebar ? 'Light Sidebar' : 'Dark Sidebar' }}
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Header -->
      <header class="h-16 bg-white border-b border-warm-200 flex items-center justify-between px-8 flex-shrink-0">
        <h1 class="text-xl font-heading font-semibold text-warm-900">
          {{ currentPageTitle }}
        </h1>
        <div class="flex items-center gap-4">
          <div class="text-sm text-warm-500">Xin chào, Admin</div>
          <div class="w-8 h-8 rounded-full bg-accent-100 text-accent-700 flex items-center justify-center font-bold">A</div>
          <button 
            @click="handleLogout"
            class="text-sm text-red-500 hover:text-red-700 font-medium ml-2"
            title="Đăng xuất"
          >
            Đăng xuất
          </button>
        </div>
      </header>

      <!-- Scrollable Content -->
      <div class="flex-1 overflow-auto p-8">
        <slot></slot>
      </div>
    </main>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// Lấy theme từ localStorage nếu có, mặc định là true (Dark)
const isDarkSidebar = ref(localStorage.getItem('admin_sidebar_theme') !== 'light')

function toggleTheme() {
  isDarkSidebar.value = !isDarkSidebar.value
  localStorage.setItem('admin_sidebar_theme', isDarkSidebar.value ? 'dark' : 'light')
}

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}

const navItems = [
  { path: '/admin/dashboard', label: 'Tổng quan', icon: '📊' },
  { path: '/admin/orders', label: 'Quản lý đơn hàng', icon: '📦' },
  { path: '/admin/templates', label: 'Mẫu thiết kế (Templates)', icon: '🖼️' },
  { path: '/admin/render-queue', label: 'Tiến trình Render', icon: '⚙️' },
  { path: '/admin/users', label: 'Khách hàng', icon: '👥' },
]

const currentPageTitle = computed(() => {
  const current = navItems.find(item => route.path.startsWith(item.path))
  return current ? current.label : 'Admin'
})
</script>
