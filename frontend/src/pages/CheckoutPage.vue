<template>
  <div>
    <AppHeader />
    <div class="min-h-screen bg-warm-50 pt-20 pb-16">
      <div class="container mx-auto px-4 max-w-6xl">
        <h1 class="text-3xl font-heading font-bold text-warm-900 mb-8">Thanh toán đặt cọc</h1>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <!-- Shipping Form (Left Column) -->
          <div class="lg:col-span-2 space-y-6">
            <div class="bg-white p-6 rounded-xl shadow-sm border border-warm-200">
              <h2 class="text-xl font-heading font-semibold text-warm-900 mb-4">Thông tin giao hàng</h2>
              
              <form class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-warm-700 mb-1">Họ và tên</label>
                    <input type="text" v-model="shipping.fullName" class="w-full rounded-md border-warm-300 shadow-sm focus:border-accent-500 focus:ring-accent-500" placeholder="Nguyễn Văn A">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-warm-700 mb-1">Số điện thoại</label>
                    <input type="tel" v-model="shipping.phone" class="w-full rounded-md border-warm-300 shadow-sm focus:border-accent-500 focus:ring-accent-500" placeholder="0901234567">
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-warm-700 mb-1">Địa chỉ chi tiết</label>
                  <input type="text" v-model="shipping.address" class="w-full rounded-md border-warm-300 shadow-sm focus:border-accent-500 focus:ring-accent-500" placeholder="Số nhà, Tên đường...">
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-warm-700 mb-1">Tỉnh/Thành phố</label>
                    <input type="text" v-model="shipping.province" class="w-full rounded-md border-warm-300 shadow-sm focus:border-accent-500 focus:ring-accent-500" placeholder="TP. Hồ Chí Minh">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-warm-700 mb-1">Quận/Huyện</label>
                    <input type="text" v-model="shipping.district" class="w-full rounded-md border-warm-300 shadow-sm focus:border-accent-500 focus:ring-accent-500" placeholder="Quận 1">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-warm-700 mb-1">Phường/Xã</label>
                    <input type="text" v-model="shipping.ward" class="w-full rounded-md border-warm-300 shadow-sm focus:border-accent-500 focus:ring-accent-500" placeholder="Phường Bến Nghé">
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-warm-700 mb-1">Ghi chú (Tùy chọn)</label>
                  <textarea v-model="notes" rows="3" class="w-full rounded-md border-warm-300 shadow-sm focus:border-accent-500 focus:ring-accent-500" placeholder="Ghi chú giao hàng..."></textarea>
                </div>
              </form>
            </div>
            
            <div class="bg-white p-6 rounded-xl shadow-sm border border-warm-200">
              <h2 class="text-xl font-heading font-semibold text-warm-900 mb-4">Phương thức thanh toán</h2>
              <div class="space-y-3">
                <label class="flex items-center p-4 border rounded-lg cursor-pointer transition-colors" :class="paymentMethod === 'vnpay' ? 'border-accent-500 bg-accent-50' : 'border-warm-200 hover:bg-warm-50'">
                  <input type="radio" name="payment" value="vnpay" v-model="paymentMethod" class="text-accent-600 focus:ring-accent-500 h-4 w-4">
                  <div class="ml-3 flex items-center">
                    <span class="font-medium text-warm-900">VNPay</span>
                    <span class="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Thẻ ATM / QR Pay</span>
                  </div>
                </label>
                
                <label class="flex items-center p-4 border rounded-lg cursor-pointer transition-colors" :class="paymentMethod === 'momo' ? 'border-accent-500 bg-accent-50' : 'border-warm-200 hover:bg-warm-50'">
                  <input type="radio" name="payment" value="momo" v-model="paymentMethod" class="text-accent-600 focus:ring-accent-500 h-4 w-4">
                  <div class="ml-3 flex items-center">
                    <span class="font-medium text-warm-900">Ví MoMo</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
          
          <!-- Order Summary (Right Column) -->
          <div class="lg:col-span-1">
            <div class="bg-white p-6 rounded-xl shadow-sm border border-warm-200 sticky top-24">
              <h2 class="text-xl font-heading font-semibold text-warm-900 mb-6">Tóm tắt đơn hàng</h2>
              
              <div class="flex items-start gap-4 mb-6 pb-6 border-b border-warm-100">
                <div class="w-20 h-20 bg-warm-100 rounded-md flex items-center justify-center text-3xl">
                  📚
                </div>
                <div>
                  <h3 class="font-medium text-warm-900">{{ editorStore.template?.name || 'Photobook Custom' }}</h3>
                  <p class="text-sm text-warm-500">{{ editorStore.project?.pages.length || 16 }} trang • 300 DPI</p>
                </div>
              </div>
              
              <div class="space-y-3 mb-6">
                <div class="flex justify-between text-warm-700">
                  <span>Giá in ấn:</span>
                  <span>{{ formatPrice(totalPrice) }}</span>
                </div>
                <div class="flex justify-between text-warm-700">
                  <span>Phí vận chuyển:</span>
                  <span>Chưa tính</span>
                </div>
                <div class="flex justify-between font-medium text-lg text-warm-900 pt-3 border-t border-warm-100">
                  <span>Tổng cộng:</span>
                  <span>{{ formatPrice(totalPrice) }}</span>
                </div>
              </div>
              
              <div class="bg-accent-50 p-4 rounded-lg mb-6 border border-accent-100">
                <div class="flex justify-between font-bold text-lg text-accent-800 mb-1">
                  <span>Tiền cọc (30%):</span>
                  <span>{{ formatPrice(depositPrice) }}</span>
                </div>
                <p class="text-xs text-accent-700">Bạn thanh toán phần cọc để chúng tôi bắt đầu in ấn. Số còn lại thanh toán khi nhận hàng.</p>
              </div>
              
              <button 
                @click="processPayment" 
                :disabled="isProcessing"
                class="w-full btn-primary py-3 text-lg flex items-center justify-center relative"
              >
                <span :class="{'opacity-0': isProcessing}">Thanh toán cọc ngay</span>
                <span v-if="isProcessing" class="absolute inset-0 flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xử lý...
                </span>
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useEditorStore } from '@/stores/editor'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const router = useRouter()
const editorStore = useEditorStore()

const shipping = ref({
  fullName: '',
  phone: '',
  address: '',
  province: '',
  district: '',
  ward: ''
})
const notes = ref('')
const paymentMethod = ref('vnpay')
const isProcessing = ref(false)

const totalPrice = computed(() => editorStore.template?.price || 450000)
const depositPrice = computed(() => {
  const percent = editorStore.template?.deposit_percent || 30
  return (totalPrice.value * percent) / 100
})

function formatPrice(val: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)
}

function processPayment() {
  if (!shipping.value.fullName || !shipping.value.phone || !shipping.value.address) {
    alert("Vui lòng điền đầy đủ thông tin giao hàng cơ bản.")
    return
  }
  
  isProcessing.value = true
  
  // Fake API delay to simulate VNPay/MoMo redirection & processing
  setTimeout(() => {
    isProcessing.value = false
    // Clean up local draft if user paid
    if (editorStore.project) {
      editorStore.clearLocalDraft(editorStore.project.id)
    }
    router.push('/checkout/success/ORD-' + Math.floor(Math.random() * 100000))
  }, 2000)
}
</script>
