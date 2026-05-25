<template>
  <footer class="bg-warm-900 text-warm-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

      <!-- Main grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

        <!-- Brand -->
        <div class="lg:col-span-1">
          <RouterLink to="/" class="flex items-center gap-2 mb-4">
            <div class="w-8 h-8 bg-accent rounded-lg flex items-center justify-center
                        text-white font-bold text-sm">
              P
            </div>
            <span class="font-heading font-semibold text-white text-lg">
              Photo<span class="text-accent">book</span>
            </span>
          </RouterLink>
          <p class="text-sm leading-relaxed text-warm-400 mb-4">
            Tạo sách ảnh kỷ niệm in ấn chuyên nghiệp, giao hàng tận tay.
            Mỗi trang sách là một khoảnh khắc đáng trân trọng.
          </p>
          <!-- Social links -->
          <div class="flex items-center gap-3">
            <a
              v-for="social in socials"
              :key="social.label"
              :href="social.href"
              target="_blank"
              rel="noopener"
              :aria-label="social.label"
              class="w-8 h-8 rounded-full bg-warm-800 flex items-center justify-center
                     text-warm-400 hover:text-accent hover:bg-warm-700
                     transition-colors duration-fast text-sm"
            >
              {{ social.icon }}
            </a>
          </div>
        </div>

        <!-- Products -->
        <div>
          <h3 class="text-sm font-semibold text-white uppercase tracking-wider mb-4">
            Sản phẩm
          </h3>
          <ul class="space-y-2.5">
            <li v-for="link in productLinks" :key="link.to">
              <RouterLink
                :to="link.to"
                class="text-sm text-warm-400 hover:text-accent transition-colors duration-fast"
              >
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Support -->
        <div>
          <h3 class="text-sm font-semibold text-white uppercase tracking-wider mb-4">
            Hỗ trợ
          </h3>
          <ul class="space-y-2.5">
            <li v-for="link in supportLinks" :key="link.to">
              <RouterLink
                :to="link.to"
                class="text-sm text-warm-400 hover:text-accent transition-colors duration-fast"
              >
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h3 class="text-sm font-semibold text-white uppercase tracking-wider mb-4">
            Liên hệ
          </h3>
          <ul class="space-y-3 text-sm text-warm-400">
            <li class="flex items-start gap-2">
              <span>📧</span>
              <a href="mailto:hello@photobook.vn"
                 class="hover:text-accent transition-colors duration-fast">
                hello@photobook.vn
              </a>
            </li>
            <li class="flex items-start gap-2">
              <span>📞</span>
              <a href="tel:+84901234567"
                 class="hover:text-accent transition-colors duration-fast">
                0901 234 567
              </a>
            </li>
            <li class="flex items-start gap-2">
              <span>⏰</span>
              <span>Thứ 2 – Thứ 7: 8:00 – 18:00</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="border-t border-warm-800 pt-6 flex flex-col sm:flex-row
                  items-center justify-between gap-3">
        <p class="text-xs text-warm-500">
          © {{ currentYear }} Photobook Vietnam. Mọi quyền được bảo lưu.
        </p>
        <div class="flex items-center gap-4">
          <RouterLink
            v-for="link in legalLinks"
            :key="link.to"
            :to="link.to"
            class="text-xs text-warm-500 hover:text-accent transition-colors duration-fast"
          >
            {{ link.label }}
          </RouterLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

const currentYear = new Date().getFullYear()

const socials = [
  { label: 'Facebook', href: '#', icon: 'f' },
  { label: 'Instagram', href: '#', icon: '◉' },
  { label: 'Zalo', href: '#', icon: 'Z' },
]

const productLinks = [
  { to: '/templates',              label: 'Mẫu album cưới' },
  { to: '/templates?category=travel', label: 'Mẫu album du lịch' },
  { to: '/templates?category=family', label: 'Mẫu album gia đình' },
  { to: '/pricing',                label: 'Bảng giá' },
]

const supportLinks = [
  { to: '/faq',            label: 'Câu hỏi thường gặp' },
  { to: '/faq#how-to',     label: 'Hướng dẫn sử dụng' },
  { to: '/faq#shipping',   label: 'Thông tin vận chuyển' },
  { to: '/faq#quality',    label: 'Chất lượng in ấn' },
]

const legalLinks = [
  { to: '/terms',   label: 'Điều khoản dịch vụ' },
  { to: '/privacy', label: 'Chính sách bảo mật' },
]
</script>
