<template>
  <div>
    <AppHeader />
    <section class="py-20 bg-warm-50">
      <div class="container mx-auto px-4 max-w-3xl">
        <h1 class="text-4xl font-heading font-bold text-warm-900 text-center mb-12">Câu hỏi thường gặp</h1>
        <div class="space-y-4">
          <div v-for="(faq, i) in faqs" :key="i" class="bg-white rounded-2xl border border-warm-200 overflow-hidden">
            <button @click="open === i ? open = -1 : open = i"
              class="w-full text-left px-6 py-5 flex items-center justify-between font-medium text-warm-800 hover:bg-warm-50 transition">
              <span>{{ faq.q }}</span>
              <span class="text-accent text-xl transition-transform" :class="open === i ? 'rotate-45' : ''">+</span>
            </button>
            <div v-show="open === i" class="px-6 pb-5 text-warm-600 text-sm leading-relaxed">{{ faq.a }}</div>
          </div>
        </div>
      </div>
    </section>
    <AppFooter />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
const open = ref(-1)
const faqs = [
  { q: 'Tôi có thể tự thiết kế bố cục không?', a: 'Hiện tại Photobook cung cấp các mẫu thiết kế cố định với bố cục được tối ưu hóa. Bạn chỉ cần chọn ảnh và đặt vào các khung sẵn có.' },
  { q: 'File PDF có được gửi cho tôi không?', a: 'Không. File PDF chỉ dành cho đội ngũ in ấn của chúng tôi để đảm bảo chất lượng tốt nhất. Bạn sẽ nhận được sản phẩm in hoàn chỉnh.' },
  { q: 'Mất bao lâu để nhận hàng?', a: 'Thông thường 7-10 ngày làm việc sau khi xác nhận đơn hàng. Dịch vụ nhanh có thể rút ngắn xuống 5-7 ngày.' },
  { q: 'Tôi có thể chỉnh sửa sau khi đặt hàng không?', a: 'Sau khi đặt hàng và thanh toán cọc, bản thiết kế sẽ được gửi vào hàng đợi in. Vui lòng liên hệ ngay nếu cần thay đổi.' },
  { q: 'Chính sách đổi trả như thế nào?', a: 'Chúng tôi hỗ trợ đổi/hoàn tiền nếu sản phẩm bị lỗi do in ấn. Không hỗ trợ đổi trả do lỗi từ phía thiết kế của khách hàng.' },
]
</script>
