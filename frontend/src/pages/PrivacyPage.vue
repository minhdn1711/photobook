<template>
  <div class="flex flex-col min-h-screen">
    <AppHeader />
    <main class="flex-grow bg-warm-50 py-16">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-4xl font-heading font-bold text-warm-900 mb-8">Chính sách bảo mật</h1>
        
        <div class="prose prose-warm max-w-none text-warm-700 bg-white p-8 rounded-xl shadow-sm border border-warm-200">
          <p class="text-sm text-warm-500 mb-8">Cập nhật lần cuối: 25/05/2026</p>
          
          <h2 class="text-2xl font-heading font-semibold text-warm-900 mt-8 mb-4">1. Thu thập thông tin cá nhân</h2>
          <p class="mb-4">Chúng tôi thu thập các thông tin cá nhân mà bạn tự nguyện cung cấp cho chúng tôi, bao gồm nhưng không giới hạn ở: họ tên, địa chỉ email, số điện thoại, và địa chỉ giao hàng. Các thông tin này được sử dụng mục đích duy nhất là để xử lý đơn hàng và giao sản phẩm đến bạn.</p>

          <h2 class="text-2xl font-heading font-semibold text-warm-900 mt-8 mb-4">2. Bảo mật hình ảnh (Dữ liệu khách hàng)</h2>
          <p class="mb-4">Photobook hiểu rằng hình ảnh của bạn chứa đựng những khoảnh khắc riêng tư và quý giá. Chúng tôi cam kết:</p>
          <ul class="list-disc pl-5 mb-4 space-y-2">
            <li>Hình ảnh tải lên được lưu trữ trên server bảo mật cao bằng Amazon S3.</li>
            <li>Hình ảnh <strong>CHỈ</strong> được sử dụng để in ấn theo yêu cầu của bạn.</li>
            <li>Chúng tôi <strong>KHÔNG</strong> chia sẻ, bán, hoặc dùng hình ảnh của bạn vào mục đích quảng cáo nếu không có sự đồng ý bằng văn bản.</li>
            <li>Tất cả hình ảnh gốc sẽ tự động được xóa khỏi server của chúng tôi trong vòng 30 ngày kể từ khi đơn hàng được giao thành công.</li>
          </ul>

          <h2 class="text-2xl font-heading font-semibold text-warm-900 mt-8 mb-4">3. Cookie và Công nghệ theo dõi</h2>
          <p class="mb-4">Ứng dụng sử dụng cookies và local storage để lưu trữ các bản nháp (drafts) thiết kế của bạn, giúp bạn không bị mất dữ liệu khi vô tình đóng trình duyệt. Chúng tôi không sử dụng các công nghệ theo dõi bên thứ ba nhằm mục đích bán dữ liệu.</p>

          <h2 class="text-2xl font-heading font-semibold text-warm-900 mt-8 mb-4">4. Quyền của người dùng</h2>
          <p class="mb-4">Bạn có quyền yêu cầu xem, chỉnh sửa hoặc xóa toàn bộ dữ liệu cá nhân (bao gồm cả tài khoản và hình ảnh đã tải lên) bất kỳ lúc nào bằng cách liên hệ với bộ phận hỗ trợ khách hàng của chúng tôi.</p>
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
