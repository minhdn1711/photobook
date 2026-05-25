<template>
  <div class="min-h-screen bg-warm-50">
    <nav class="bg-warm-900 text-white px-6 py-4 flex items-center justify-between">
      <span class="font-heading font-bold">Admin — Người dùng</span>
      <RouterLink to="/admin/dashboard" class="text-warm-400 hover:text-white text-sm transition">← Dashboard</RouterLink>
    </nav>
    <div class="p-8 max-w-6xl mx-auto">
      <h1 class="text-2xl font-heading font-bold text-warm-900 mb-6">Quản lý Người dùng</h1>
      <div class="bg-white rounded-2xl border border-warm-100 overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-warm-50 border-b border-warm-100">
            <tr>
              <th class="text-left px-6 py-3 text-warm-600 font-medium">Tên</th>
              <th class="text-left px-6 py-3 text-warm-600 font-medium">Email</th>
              <th class="text-left px-6 py-3 text-warm-600 font-medium">Vai trò</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in users" :key="u.email" class="border-b border-warm-50 hover:bg-warm-50/50">
              <td class="px-6 py-4 text-warm-800 font-medium">{{ u.name }}</td>
              <td class="px-6 py-4 text-warm-500">{{ u.email }}</td>
              <td class="px-6 py-4">
                <span :class="u.role === 'admin' ? 'bg-accent/10 text-accent' : 'bg-warm-100 text-warm-600'"
                  class="px-2 py-1 rounded text-xs font-medium">{{ u.role }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { RouterLink } from 'vue-router'
const users = [
  { name: 'Admin Photobook', email: 'admin@photobook.vn', role: 'admin' },
  { name: 'Demo User', email: 'demo@photobook.vn', role: 'user' },
]
</script>
