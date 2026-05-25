<template>
  <div class="min-h-screen">
    <AppHeader />

    <main>
      <!-- ══ HERO ══════════════════════════════════════════════ -->
      <section
        class="relative bg-gradient-to-br from-warm-50 via-white to-warm-100
               overflow-hidden pt-16 pb-24 sm:pt-24 sm:pb-32"
      >
        <!-- Decorative background blobs -->
        <div class="absolute inset-0 pointer-events-none overflow-hidden">
          <div class="absolute -top-32 -right-32 w-96 h-96 rounded-full
                      bg-accent/8 blur-3xl" />
          <div class="absolute -bottom-20 -left-20 w-80 h-80 rounded-full
                      bg-warm-300/30 blur-3xl" />
        </div>

        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid lg:grid-cols-2 gap-16 items-center">

            <!-- Left: copy -->
            <div class="text-center lg:text-left">
              <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full
                          bg-accent/10 text-accent text-sm font-medium mb-6">
                ✨ In ấn chuyên nghiệp · Giao hàng toàn quốc
              </div>

              <h1 class="font-heading text-4xl sm:text-5xl lg:text-6xl
                         font-bold text-warm-900 leading-tight mb-6">
                Sách ảnh<br />
                <span class="text-accent">kỷ niệm đẹp</span><br />
                <span class="text-3xl sm:text-4xl lg:text-5xl font-medium text-warm-600">
                  chỉ trong vài bước
                </span>
              </h1>

              <p class="text-lg text-warm-600 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                Chọn mẫu đẹp, tải ảnh lên, điền tên — chúng tôi lo phần còn lại.
                Album in chất lượng cao, giao tận tay bạn.
              </p>

              <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <RouterLink
                  to="/templates"
                  class="btn-primary text-base px-8 py-3.5 shadow-lg shadow-accent/25
                         hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5
                         transition-all duration-200"
                >
                  Khám phá mẫu thiết kế →
                </RouterLink>
                <RouterLink
                  to="/faq"
                  class="btn-ghost text-base px-8 py-3.5"
                >
                  Xem cách hoạt động
                </RouterLink>
              </div>

              <!-- Social proof -->
              <div class="flex items-center gap-4 mt-10 justify-center lg:justify-start">
                <div class="flex -space-x-2">
                  <div
                    v-for="i in 5"
                    :key="i"
                    class="w-8 h-8 rounded-full border-2 border-white
                           bg-gradient-to-br from-warm-300 to-warm-400"
                  />
                </div>
                <div class="text-sm">
                  <div class="flex items-center gap-1">
                    <span v-for="n in 5" :key="n" class="text-amber-400 text-xs">★</span>
                    <span class="font-semibold text-warm-800 ml-1">4.9</span>
                  </div>
                  <p class="text-warm-500">Hơn 500+ khách hàng hài lòng</p>
                </div>
              </div>
            </div>

            <!-- Right: mockup -->
            <div class="relative flex justify-center lg:justify-end">
              <div class="relative w-72 sm:w-80 lg:w-96">
                <!-- Book mockup stack -->
                <div class="relative">
                  <!-- Shadow book (back) -->
                  <div class="absolute -top-3 -left-3 w-full h-full rounded-2xl
                              bg-warm-300/50 rotate-3" />
                  <!-- Main book -->
                  <div class="relative bg-white rounded-2xl shadow-2xl overflow-hidden
                              border border-warm-200 aspect-square">
                    <div class="w-full h-full bg-gradient-to-br
                                from-warm-100 via-warm-50 to-white
                                flex items-center justify-center">
                      <div class="text-center p-8">
                        <div class="text-7xl mb-4">📖</div>
                        <p class="font-heading text-warm-700 font-semibold text-lg">
                          Album Cưới
                        </p>
                        <p class="text-warm-400 text-sm mt-1">16 trang · In 300 DPI</p>
                        <div class="mt-4 flex justify-center gap-2">
                          <div class="w-3 h-3 rounded-full bg-accent" />
                          <div class="w-3 h-3 rounded-full bg-warm-300" />
                          <div class="w-3 h-3 rounded-full bg-warm-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Floating badge: pages -->
                <div class="absolute -bottom-4 -right-4 bg-accent text-white
                            rounded-2xl shadow-lg px-4 py-3 text-center">
                  <div class="text-2xl font-bold leading-none">16</div>
                  <div class="text-xs opacity-80 mt-0.5">trang</div>
                </div>
                <!-- Floating badge: DPI -->
                <div class="absolute -top-4 -right-4 bg-white text-warm-800
                            rounded-2xl shadow-lg px-3 py-2 text-center
                            border border-warm-200">
                  <div class="text-sm font-bold leading-none text-green-600">300 DPI</div>
                  <div class="text-xs text-warm-500 mt-0.5">In sắc nét</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ══ HOW IT WORKS ════════════════════════════════════════ -->
      <section class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-14">
            <h2 class="font-heading text-3xl sm:text-4xl font-bold text-warm-900 mb-4">
              Chỉ <span class="text-accent">3 bước đơn giản</span>
            </h2>
            <p class="text-warm-500 text-lg max-w-xl mx-auto">
              Không cần kỹ năng thiết kế. Chúng tôi đã chuẩn bị mẫu đẹp cho bạn.
            </p>
          </div>

          <div class="grid sm:grid-cols-3 gap-8 lg:gap-12 relative">
            <!-- Connector line (desktop only) -->
            <div class="hidden sm:block absolute top-12 left-[calc(16.67%+24px)]
                        right-[calc(16.67%+24px)] h-px bg-warm-200" />

            <div
              v-for="(step, i) in steps"
              :key="i"
              class="relative text-center"
            >
              <div class="relative inline-flex">
                <div class="w-16 h-16 rounded-2xl bg-accent/10 text-accent
                            flex items-center justify-center text-2xl
                            mx-auto mb-6 shadow-sm relative z-10">
                  {{ step.icon }}
                </div>
                <div class="absolute -top-1 -right-1 w-5 h-5 rounded-full
                            bg-accent text-white text-xs font-bold
                            flex items-center justify-center z-20 shadow-sm">
                  {{ i + 1 }}
                </div>
              </div>
              <h3 class="font-heading text-lg font-semibold text-warm-900 mb-2">
                {{ step.title }}
              </h3>
              <p class="text-warm-500 text-sm leading-relaxed">
                {{ step.desc }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- ══ FEATURED TEMPLATES ══════════════════════════════════ -->
      <section class="py-20 bg-warm-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-end justify-between mb-10">
            <div>
              <h2 class="font-heading text-3xl sm:text-4xl font-bold text-warm-900 mb-2">
                Mẫu <span class="text-accent">nổi bật</span>
              </h2>
              <p class="text-warm-500">Được yêu thích nhất bởi khách hàng</p>
            </div>
            <RouterLink
              to="/templates"
              class="hidden sm:flex items-center gap-1 text-sm font-medium
                     text-accent hover:text-accent-dark transition-colors duration-fast"
            >
              Xem tất cả <span>→</span>
            </RouterLink>
          </div>

          <!-- Loading skeleton -->
          <div
            v-if="loading"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <div
              v-for="i in 3"
              :key="i"
              class="rounded-2xl overflow-hidden bg-white border border-warm-200"
            >
              <div class="aspect-square bg-warm-200 animate-pulse" />
              <div class="p-4 space-y-2">
                <div class="h-4 bg-warm-200 rounded animate-pulse w-3/4" />
                <div class="h-3 bg-warm-200 rounded animate-pulse w-1/2" />
              </div>
            </div>
          </div>

          <!-- Template cards -->
          <div
            v-else
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <TemplateCard
              v-for="template in featuredTemplates"
              :key="template.id"
              :template="template"
            />
          </div>

          <div class="mt-8 text-center sm:hidden">
            <RouterLink to="/templates" class="btn-ghost">
              Xem tất cả mẫu →
            </RouterLink>
          </div>
        </div>
      </section>

      <!-- ══ FEATURES ════════════════════════════════════════════ -->
      <section class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-14">
            <h2 class="font-heading text-3xl sm:text-4xl font-bold text-warm-900 mb-4">
              Tại sao chọn <span class="text-accent">Photobook?</span>
            </h2>
          </div>

          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div
              v-for="feature in features"
              :key="feature.title"
              class="rounded-2xl p-6 bg-warm-50 border border-warm-200
                     hover:border-accent/30 hover:shadow-sm
                     transition-all duration-200 group"
            >
              <div class="w-12 h-12 rounded-xl bg-accent/10 flex items-center
                          justify-center text-2xl mb-4 group-hover:bg-accent/15
                          transition-colors duration-fast">
                {{ feature.icon }}
              </div>
              <h3 class="font-heading text-base font-semibold text-warm-900 mb-2">
                {{ feature.title }}
              </h3>
              <p class="text-sm text-warm-500 leading-relaxed">
                {{ feature.desc }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- ══ CTA BAND ════════════════════════════════════════════ -->
      <section
        class="py-20 bg-gradient-to-r from-accent to-accent-dark
               relative overflow-hidden"
      >
        <div class="absolute inset-0 opacity-10 pointer-events-none">
          <div class="absolute top-0 left-1/4 w-64 h-64 rounded-full
                      bg-white blur-3xl" />
          <div class="absolute bottom-0 right-1/4 w-48 h-48 rounded-full
                      bg-white blur-3xl" />
        </div>

        <div class="relative max-w-3xl mx-auto px-4 text-center">
          <h2 class="font-heading text-3xl sm:text-4xl font-bold text-white mb-4">
            Bắt đầu tạo photobook ngay hôm nay
          </h2>
          <p class="text-white/80 text-lg mb-8">
            Miễn phí thiết kế. Chỉ thanh toán khi bạn đặt in.
          </p>
          <RouterLink
            to="/templates"
            class="inline-flex items-center gap-2 bg-white text-accent
                   font-semibold px-8 py-4 rounded-xl shadow-lg
                   hover:bg-warm-50 hover:-translate-y-0.5
                   transition-all duration-200 text-base"
          >
            Chọn mẫu ngay →
          </RouterLink>
        </div>
      </section>
    </main>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { api } from '@/lib/api'
import type { Template } from '@/types'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import TemplateCard from '@/components/templates/TemplateCard.vue'

// ── Data ──────────────────────────────────────────────────────
const featuredTemplates = ref<Template[]>([])
const loading           = ref(true)

const steps = [
  {
    icon: '🎨',
    title: 'Chọn mẫu thiết kế',
    desc: 'Duyệt bộ sưu tập mẫu đẹp cho Đám cưới, Du lịch, Gia đình...',
  },
  {
    icon: '📸',
    title: 'Tải ảnh & điền tên',
    desc: 'Kéo ảnh vào khung, chỉnh crop vừa ý, điền tên và ngày tháng.',
  },
  {
    icon: '🚚',
    title: 'Đặt in & nhận hàng',
    desc: 'Chúng tôi in ở độ phân giải 300 DPI và giao tận tay trong 7–10 ngày.',
  },
]

const features = [
  {
    icon: '🖼️',
    title: 'Mẫu thiết kế chuyên nghiệp',
    desc: 'Hàng chục mẫu được thiết kế bởi nghệ nhân, sẵn sàng điền ảnh.',
  },
  {
    icon: '🖨️',
    title: 'In ấn chất lượng cao',
    desc: '300 DPI, giấy ảnh cao cấp, màu sắc trung thực, bền đẹp theo thời gian.',
  },
  {
    icon: '🔒',
    title: 'Bảo mật tuyệt đối',
    desc: 'Ảnh cá nhân được mã hóa và lưu trữ an toàn. Chỉ bạn mới thấy được.',
  },
  {
    icon: '💾',
    title: 'Tự động lưu bản nháp',
    desc: 'Dự án được lưu tự động mỗi vài giây. Đóng trình duyệt và quay lại lúc nào cũng được.',
  },
  {
    icon: '📱',
    title: 'Dùng được trên mọi thiết bị',
    desc: 'Truy cập và chỉnh sửa trên máy tính hoặc điện thoại đều mượt mà.',
  },
  {
    icon: '🎁',
    title: 'Gói quà sang trọng',
    desc: 'Album được đóng gói hộp gift cao cấp, sẵn sàng làm quà tặng ý nghĩa.',
  },
]

// ── Load featured templates ────────────────────────────────────
onMounted(async () => {
  try {
    const res = await api.get<{ data: Template[] }>('/templates?popular=1')
    featuredTemplates.value = res.data.data.slice(0, 3)
  } catch {
    // Silently fail — page still usable without templates
  } finally {
    loading.value = false
  }
})
</script>
