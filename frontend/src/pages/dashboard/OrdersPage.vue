<template>
  <div class="bg-white rounded-xl shadow-sm border border-warm-200 p-6 min-h-[500px] flex flex-col">
    <h2 class="text-xl font-heading font-semibold text-warm-900 mb-6">Đơn hàng của tôi</h2>
    
    <div v-if="orders.length > 0" class="overflow-x-auto">
      <table class="w-full text-left">
        <thead>
          <tr class="border-b border-warm-200 text-sm text-warm-500">
            <th class="pb-3 font-medium">Mã đơn hàng</th>
            <th class="pb-3 font-medium">Sản phẩm</th>
            <th class="pb-3 font-medium">Ngày đặt</th>
            <th class="pb-3 font-medium">Tổng tiền</th>
            <th class="pb-3 font-medium">Trạng thái</th>
            <th class="pb-3 font-medium"></th>
          </tr>
        </thead>
        <tbody class="text-sm divide-y divide-warm-100">
          <tr v-for="order in orders" :key="order.id" class="hover:bg-warm-50">
            <td class="py-4 font-medium text-warm-900">{{ order.id }}</td>
            <td class="py-4">{{ order.product }}</td>
            <td class="py-4 text-warm-500">{{ order.date }}</td>
            <td class="py-4">{{ order.price }}</td>
            <td class="py-4"><span :class="order.statusClass">{{ order.status }}</span></td>
            <td class="py-4 text-right">
              <button class="text-accent-600 hover:underline">Chi tiết</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-else class="flex-1 flex flex-col items-center justify-center text-center py-12">
      <div class="w-24 h-24 bg-warm-100 rounded-full flex items-center justify-center mb-6 text-4xl">
        📦
      </div>
      <h3 class="text-xl font-heading font-semibold text-warm-900 mb-2">Chưa có đơn hàng nào</h3>
      <p class="text-warm-500 max-w-md mb-8">Bạn chưa đặt in quyển Photobook nào. Hãy tạo cuốn sách ảnh đầu tiên để lưu giữ kỷ niệm nhé!</p>
      <RouterLink to="/templates" class="btn-primary">Tạo Photobook ngay</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

// Toggle to empty array to test empty state
const orders = ref([
  { id: 'ORD-12345', product: 'Photobook Kỷ yếu lớp 12A1', date: '20/05/2026', price: '450.000đ', status: 'Đang in ấn', statusClass: 'px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full' },
  { id: 'ORD-09876', product: 'Photobook Du lịch Đà Lạt', date: '01/04/2026', price: '350.000đ', status: 'Đã giao hàng', statusClass: 'px-2 py-1 bg-green-50 text-green-600 text-xs rounded-full' },
])
</script>
