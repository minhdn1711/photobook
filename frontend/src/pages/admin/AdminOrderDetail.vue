<template>
  <AdminLayout>
    <div class="mb-4">
      <RouterLink to="/admin/orders" class="text-sm text-warm-500 hover:text-warm-900 flex items-center gap-1">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Quay lại danh sách
      </RouterLink>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Order Info -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white rounded-xl shadow-sm border border-warm-200 p-6">
          <div class="flex justify-between items-start mb-6">
            <div>
              <h2 class="text-2xl font-heading font-bold text-warm-900">Đơn hàng {{ route.params.id }}</h2>
              <div class="text-sm text-warm-500 mt-1">Ngày đặt: 25/05/2026 lúc 10:20</div>
            </div>
            <span class="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full font-medium border border-yellow-200">
              Trạng thái: Đã cọc 30%
            </span>
          </div>

          <div class="grid grid-cols-2 gap-8 py-6 border-y border-warm-100 mb-6">
            <div>
              <h3 class="font-medium text-warm-900 mb-2">Khách hàng & Giao hàng</h3>
              <ul class="text-sm text-warm-600 space-y-1">
                <li><strong>Tên:</strong> Nguyễn Văn A</li>
                <li><strong>SĐT:</strong> 0901234567</li>
                <li><strong>Địa chỉ:</strong> 123 Lê Lợi, Phường Bến Nghé, Quận 1, TP. HCM</li>
                <li><strong>Ghi chú:</strong> Giao giờ hành chính</li>
              </ul>
            </div>
            <div>
              <h3 class="font-medium text-warm-900 mb-2">Thanh toán</h3>
              <ul class="text-sm text-warm-600 space-y-1">
                <li><strong>Tổng tiền in:</strong> 450,000đ</li>
                <li><strong>Đã cọc:</strong> 135,000đ (VNPay)</li>
                <li><strong>Còn lại:</strong> <span class="text-red-600 font-medium">315,000đ (COD)</span></li>
              </ul>
            </div>
          </div>

          <div>
            <h3 class="font-medium text-warm-900 mb-4">File thiết kế (Dự án gốc)</h3>
            <div class="flex items-center justify-between p-4 bg-warm-50 border border-warm-200 rounded-lg">
              <div class="flex items-center gap-4">
                <div class="w-16 h-16 bg-white border border-warm-200 rounded shadow-sm flex items-center justify-center">
                  <svg class="w-8 h-8 text-warm-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div>
                  <div class="font-medium text-warm-900">Album Cưới Ánh Hồng (16 trang)</div>
                  <div class="text-xs text-warm-500">ID Dự án: PRJ-9923 • Dữ liệu JSON hợp lệ</div>
                </div>
              </div>
              <RouterLink v-if="order?.project_id" :to="`/editor/${order.project_id}`" target="_blank" class="px-4 py-2 border border-warm-300 rounded text-sm text-warm-700 bg-white hover:bg-warm-50">Xem trước thiết kế (Read-only)</RouterLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Render Action Box -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-xl shadow-sm border border-warm-200 p-6 sticky top-6">
          <h3 class="text-lg font-heading font-semibold text-warm-900 mb-2">Render PDF chuẩn in</h3>
          <p class="text-sm text-warm-500 mb-6">Trích xuất cấu hình JSON và render ra PDF CMYK 300DPI để đưa xuống xưởng in.</p>
          
          <!-- State: Idle -->
          <div v-if="renderState === 'idle'" class="text-center">
            <div class="w-16 h-16 bg-warm-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-warm-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H3a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2z" /></svg>
            </div>
            <button @click="startRender" class="w-full btn-primary py-3">Bắt đầu Render</button>
          </div>

          <!-- State: Processing -->
          <div v-else-if="renderState === 'processing'" class="text-center py-4">
            <div class="w-12 h-12 border-4 border-warm-200 border-t-accent-600 rounded-full animate-spin mx-auto mb-4"></div>
            <div class="font-medium text-warm-900 mb-1">Đang xử lý PDF...</div>
            <div class="text-xs text-warm-500">Quá trình này thường mất 30s - 2 phút. Mocking: {{ progress }}%</div>
            
            <div class="w-full bg-warm-100 h-2 rounded-full mt-4 overflow-hidden">
              <div class="bg-accent-500 h-full transition-all duration-300" :style="{ width: progress + '%' }"></div>
            </div>
          </div>

          <!-- State: Completed -->
          <div v-else-if="renderState === 'completed'" class="text-center">
            <div class="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <div class="font-medium text-green-700 mb-2">Render thành công!</div>
            <div class="text-xs text-warm-500 mb-6">File đã sẵn sàng để gửi xưởng in. (Kích thước: ~45MB)</div>
            
            <button class="w-full px-4 py-3 bg-warm-900 hover:bg-black text-white rounded-md font-medium flex items-center justify-center gap-2 mb-3">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              Tải xuống PDF (CMYK)
            </button>
            <button @click="markAsPrinting" class="w-full px-4 py-3 border border-warm-300 hover:bg-warm-50 text-warm-700 rounded-md font-medium">
              Đánh dấu "Đang in ấn"
            </button>
          </div>
          
        </div>
      </div>
      
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { RouterLink } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'

const route = useRoute()
const renderState = ref<'idle' | 'processing' | 'completed'>('idle')
const progress = ref(0)

function startRender() {
  renderState.value = 'processing'
  progress.value = 0
  
  // Fake progress interval
  const interval = setInterval(() => {
    progress.value += Math.floor(Math.random() * 15) + 5
    if (progress.value >= 100) {
      progress.value = 100
      clearInterval(interval)
      setTimeout(() => {
        renderState.value = 'completed'
      }, 500)
    }
  }, 500)
}

function markAsPrinting() {
  alert('Đã cập nhật trạng thái đơn hàng thành "Đang in ấn"')
}
</script>
