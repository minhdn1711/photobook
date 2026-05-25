<template>
  <AdminLayout>
    <div class="bg-white rounded-xl shadow-sm border border-warm-200">
      
      <!-- Toolbar -->
      <div class="p-4 border-b border-warm-200 flex flex-wrap gap-4 items-center justify-between">
        <div class="flex gap-2">
          <input type="text" placeholder="Tìm mã đơn hàng..." class="border border-warm-300 rounded-md px-3 py-1.5 text-sm w-64 focus:border-accent-500 focus:ring-accent-500">
          <button class="px-4 py-1.5 bg-warm-100 hover:bg-warm-200 text-warm-700 rounded-md text-sm font-medium transition-colors">Lọc</button>
        </div>
        
        <div class="flex gap-2 text-sm">
          <button class="px-3 py-1.5 rounded-md font-medium bg-accent-50 text-accent-700">Tất cả</button>
          <button class="px-3 py-1.5 rounded-md font-medium text-warm-600 hover:bg-warm-50">Mới đặt (3)</button>
          <button class="px-3 py-1.5 rounded-md font-medium text-warm-600 hover:bg-warm-50">Đang in (1)</button>
          <button class="px-3 py-1.5 rounded-md font-medium text-warm-600 hover:bg-warm-50">Hoàn thành (24)</button>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-warm-50 border-b border-warm-200 text-sm text-warm-600">
              <th class="py-3 px-4 font-medium">Mã Đơn</th>
              <th class="py-3 px-4 font-medium">Khách hàng</th>
              <th class="py-3 px-4 font-medium">Sản phẩm (Template)</th>
              <th class="py-3 px-4 font-medium">Ngày đặt</th>
              <th class="py-3 px-4 font-medium">Trạng thái</th>
              <th class="py-3 px-4 font-medium">Render</th>
              <th class="py-3 px-4 font-medium text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody class="text-sm divide-y divide-warm-100">
            <!-- Row 1 -->
            <tr class="hover:bg-warm-50/50 transition-colors">
              <td class="py-3 px-4 font-medium text-warm-900">ORD-20261</td>
              <td class="py-3 px-4">
                <div class="font-medium text-warm-900">Nguyễn Văn A</div>
                <div class="text-xs text-warm-500">0901234567</div>
              </td>
              <td class="py-3 px-4">Album Cưới Ánh Hồng</td>
              <td class="py-3 px-4 text-warm-500">Hôm nay 10:20</td>
              <td class="py-3 px-4"><span class="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">Đã cọc 30%</span></td>
              <td class="py-3 px-4 text-warm-400">Chưa render</td>
              <td class="py-3 px-4 text-right">
                <RouterLink to="/admin/orders/ORD-20261" class="text-accent-600 hover:text-accent-700 font-medium">Xử lý →</RouterLink>
              </td>
            </tr>
            <!-- Row 2 -->
            <tr class="hover:bg-warm-50/50 transition-colors">
              <td class="py-3 px-4 font-medium text-warm-900">ORD-20260</td>
              <td class="py-3 px-4">
                <div class="font-medium text-warm-900">Trần Thị B</div>
                <div class="text-xs text-warm-500">0912345678</div>
              </td>
              <td class="py-3 px-4">Photobook Kỷ Yếu 12A1</td>
              <td class="py-3 px-4 text-warm-500">Hôm qua 15:45</td>
              <td class="py-3 px-4"><span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">Đang in ấn</span></td>
              <td class="py-3 px-4"><span class="text-green-600 flex items-center gap-1"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Xong</span></td>
              <td class="py-3 px-4 text-right">
                <RouterLink to="/admin/orders/ORD-20260" class="text-accent-600 hover:text-accent-700 font-medium">Xem</RouterLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Placeholder -->
      <div class="p-4 border-t border-warm-200 flex items-center justify-between text-sm text-warm-500">
        <div>Hiển thị 1-10 của 120 đơn hàng</div>
        <div class="flex gap-1">
          <button class="px-3 py-1 border border-warm-200 rounded hover:bg-warm-50 disabled:opacity-50">Trước</button>
          <button class="px-3 py-1 border border-warm-200 rounded hover:bg-warm-50 disabled:opacity-50">Sau</button>
        </div>
      </div>

    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
</script>
