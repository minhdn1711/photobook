<template>
  <div class="h-screen w-screen flex flex-col bg-warm-900 overflow-hidden text-warm-50 font-body">
    <!-- Top Toolbar -->
    <header class="h-14 border-b border-warm-800 bg-warm-900 flex-shrink-0 z-20">
      <slot name="toolbar"></slot>
    </header>

    <!-- Main Workspace -->
    <main class="flex-1 flex overflow-hidden">
      <!-- Left Sidebar (Upload/Photos) -->
      <aside class="w-[280px] bg-warm-900 border-r border-warm-800 flex-shrink-0 flex flex-col z-10 relative">
        <slot name="left-sidebar"></slot>
      </aside>

      <!-- Center Canvas -->
      <section class="flex-1 bg-warm-800 relative overflow-hidden flex items-center justify-center">
        <slot name="canvas"></slot>
      </section>

      <!-- Right Sidebar (Properties) -->
      <aside class="w-[260px] bg-warm-900 border-l border-warm-800 flex-shrink-0 flex flex-col z-10 overflow-y-auto">
        <slot name="right-sidebar"></slot>
      </aside>
    </main>

    <!-- Bottom Navigator -->
    <footer class="h-20 bg-warm-900 border-t border-warm-800 flex-shrink-0 z-20 flex items-center justify-center px-4">
      <slot name="bottom-nav"></slot>
    </footer>
  </div>
</template>

<script setup lang="ts">
// EditorLayout provides the basic 3-panel + toolbar + bottom nav shell.
// Slots are used so we can keep the logic inside EditorPage or specific components.
</script>
