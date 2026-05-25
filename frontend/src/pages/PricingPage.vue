<template>
  <div>
    <AppHeader />
    <section class="py-20 bg-warm-50">
      <div class="container mx-auto px-4 max-w-4xl text-center">
        <h1 class="text-4xl font-heading font-bold text-warm-900 mb-4">Bảng giá</h1>
        <p class="text-warm-500 mb-12">Giá đơn giản, minh bạch — không phụ phí ẩn</p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="plan in plans" :key="plan.name"
            class="bg-white rounded-2xl border p-8 text-left"
            :class="plan.featured ? 'border-accent shadow-lg shadow-accent/10' : 'border-warm-200'">
            <div v-if="plan.featured" class="text-xs font-bold text-accent uppercase tracking-wider mb-3">Phổ biến nhất</div>
            <h3 class="text-xl font-heading font-bold text-warm-900 mb-2">{{ plan.name }}</h3>
            <p class="text-3xl font-bold text-accent mb-1">{{ plan.price }}</p>
            <p class="text-warm-400 text-sm mb-6">{{ plan.desc }}</p>
            <ul class="space-y-2 text-sm text-warm-600">
              <li v-for="f in plan.features" :key="f" class="flex items-start gap-2">
                <span class="text-accent mt-0.5">✓</span> {{ f }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    <AppFooter />
  </div>
</template>
<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
const plans = [
  { name: 'Tiêu chuẩn', price: '390.000₫', desc: 'Square 20×20cm', featured: false, features: ['16 trang', 'Bìa cứng', 'In màu HD', 'Giao hàng 7-10 ngày'] },
  { name: 'Nâng cao', price: '450.000₫', desc: 'Square 20×20cm', featured: true, features: ['16 trang', 'Bìa cứng cao cấp', 'In màu UHD', 'Giao hàng 5-7 ngày', 'Đóng gói quà tặng'] },
  { name: 'Cao cấp', price: '520.000₫', desc: 'Landscape 26×20cm', featured: false, features: ['16 trang ngang', 'Bìa da PU', 'In màu UHD', 'Giao hàng 5-7 ngày', 'Hộp đựng sang trọng'] },
]
</script>
