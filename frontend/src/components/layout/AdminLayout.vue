<template>
  <div class="min-h-screen bg-warm-50 flex">
    
    <!-- Sidebar -->
    <aside 
      class="w-64 flex-shrink-0 transition-colors duration-300 border-r flex flex-col"
      :class="isDarkSidebar ? 'bg-warm-900 border-warm-800 text-white' : 'bg-white border-warm-200 text-warm-900'"
    >
      <div class="h-16 flex items-center justify-between px-6 border-b" :class="isDarkSidebar ? 'border-warm-800' : 'border-warm-200'">
        <RouterLink to="/admin/dashboard" class="font-heading font-bold text-xl flex items-center gap-2">
          <svg class="w-6 h-6 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Photobook 
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
            <span class="mr-3 w-5 h-5 flex-shrink-0 text-current" v-html="icons[item.icon]"></span>
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
           <svg v-if="isDarkSidebar" class="mr-3 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
           <svg v-else class="mr-3 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
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
  { path: '/admin/dashboard', label: 'Tổng quan', icon: 'dashboard' },
  { path: '/admin/orders', label: 'Quản lý đơn hàng', icon: 'orders' },
  { path: '/admin/templates', label: 'Mẫu thiết kế (Templates)', icon: 'templates' },
  { path: '/admin/render-queue', label: 'Tiến trình Render', icon: 'render' },
  { path: '/admin/users', label: 'Khách hàng', icon: 'users' },
]

const icons: Record<string, string> = {
  dashboard: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1v-5m10-5v10a1 1 0 01-1 1v-4m-6 0h6" /></svg>',
  orders: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>',
  templates: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>',
  render: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>',
  users: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>',
}

const currentPageTitle = computed(() => {
  const current = navItems.find(item => route.path.startsWith(item.path))
  return current ? current.label : 'Admin'
})
</script>
