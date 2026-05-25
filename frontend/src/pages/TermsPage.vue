<template>
  <div class="flex flex-col min-h-screen">
    <AppHeader />
    <main class="flex-grow bg-warm-50 py-16">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-4xl font-heading font-bold text-warm-900 mb-8">Điều khoản dịch vụ</h1>
        
        <div class="prose prose-warm max-w-none text-warm-700 bg-white p-8 rounded-xl shadow-sm border border-warm-200">
          <p class="text-sm text-warm-500 mb-8">Cập nhật lần cuối: 25/05/2026</p>
          
          <h2 class="text-2xl font-heading font-semibold text-warm-900 mt-8 mb-4">1. Chấp nhận điều khoản</h2>
          <p class="mb-4">Khi bạn sử dụng nền tảng Photobook, bạn đồng ý tuân thủ các điều khoản dịch vụ này. Nếu bạn không đồng ý, vui lòng không sử dụng dịch vụ của chúng tôi.</p>

          <h2 class="text-2xl font-heading font-semibold text-warm-900 mt-8 mb-4">2. Quyền sở hữu trí tuệ</h2>
          <p class="mb-4">Các mẫu thiết kế (Templates) thuộc sở hữu bản quyền của Photobook. Bạn được cấp quyền sử dụng các mẫu này để in ấn thông qua dịch vụ của chúng tôi. Bạn không được phép trích xuất PDF thiết kế thành phẩm để mang đi in ở đơn vị khác.</p>

          <h2 class="text-2xl font-heading font-semibold text-warm-900 mt-8 mb-4">3. Trách nhiệm về nội dung hình ảnh</h2>
          <p class="mb-4">Bạn chịu hoàn toàn trách nhiệm về nội dung và bản quyền của hình ảnh bạn tải lên. Chúng tôi có quyền từ chối in ấn các ấn phẩm chứa nội dung vi phạm pháp luật, đồi trụy hoặc vi phạm thuần phong mỹ tục Việt Nam.</p>

          <h2 class="text-2xl font-heading font-semibold text-warm-900 mt-8 mb-4">4. Chính sách In ấn & Thanh toán</h2>
          <ul class="list-disc pl-5 mb-4 space-y-2">
            <li><strong>Chất lượng:</strong> Nếu hình ảnh in ra bị mờ do lỗi người dùng tải lên ảnh độ phân giải thấp (đã có cảnh báo DPI), chúng tôi không chịu trách nhiệm.</li>
            <li><strong>Đặt cọc:</strong> Khách hàng bắt buộc thanh toán cọc tối thiểu 30% trước khi đơn hàng được đưa vào sản xuất.</li>
            <li><strong>Giao hàng:</strong> Thời gian sản xuất và giao hàng ước tính là 3-7 ngày làm việc tùy khu vực.</li>
          </ul>

          <h2 class="text-2xl font-heading font-semibold text-warm-900 mt-8 mb-4">5. Đổi trả & Hoàn cọc</h2>
          <p class="mb-4">Chúng tôi cam kết hoàn cọc 100% hoặc in lại miễn phí nếu lỗi phát sinh từ khâu sản xuất (mực in lem, sách bong keo, sai khác màu sắc quá lớn so với chuẩn CMYK). Yêu cầu bảo hành cần được gửi trong vòng 3 ngày kể từ khi nhận hàng.</p>
        </div>
      </div>
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
</script>
