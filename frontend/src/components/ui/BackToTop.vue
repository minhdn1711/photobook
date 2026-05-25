<template>
  <Teleport to="body">
    <Transition name="backtotop">
      <button
        v-if="show"
        @click="scrollToTop"
        class="fixed bottom-6 right-6 z-[350] flex h-12 w-12 items-center justify-center
               rounded-full bg-warm-900 text-white shadow-modal
               hover:bg-warm-800 active:bg-warm-950
               transition-all duration-200 focus:outline-none focus:ring-2
               focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg-primary"
        aria-label="Về đầu trang"
      >
        <span class="text-xl leading-none">↑</span>
      </button>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const show = ref(false)
const threshold = 300

function onScroll() {
  show.value = window.scrollY > threshold
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  // Check initial position
  onScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
.backtotop-enter-active,
.backtotop-leave-active {
  transition: opacity 150ms ease, transform 150ms ease;
}
.backtotop-enter-from,
.backtotop-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.95);
}
</style>
