<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 text-center transform transition-all">
        
        <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <h3 class="text-xl font-heading font-bold text-warm-900 mb-2">Trải nghiệm không tối ưu</h3>
        <p class="text-warm-500 mb-6 text-sm">
          Trang chỉnh sửa (Editor) đòi hỏi không gian màn hình lớn để bạn dễ dàng kéo thả và thiết kế. 
          Vui lòng sử dụng <strong>Máy tính bàn hoặc Laptop</strong> để có trải nghiệm tốt nhất.
        </p>

        <div class="flex flex-col gap-3">
          <button @click="goHome" class="btn-primary w-full justify-center">
            Về trang chủ
          </button>
          <button @click="continueAnyway" class="text-sm font-medium text-warm-500 hover:text-warm-900">
            Tôi vẫn muốn tiếp tục
          </button>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isOpen = ref(false)
const hasDismissed = ref(false)

function checkMobile() {
  if (window.innerWidth < 768 && !hasDismissed.value) {
    isOpen.value = true
  } else {
    isOpen.value = false
  }
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

function continueAnyway() {
  isOpen.value = false
  hasDismissed.value = true
}

function goHome() {
  isOpen.value = false
  router.push('/')
}
</script>
