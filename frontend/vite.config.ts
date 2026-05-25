import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      vue(),
    ],

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
        '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
        '@stores': fileURLToPath(new URL('./src/stores', import.meta.url)),
        '@composables': fileURLToPath(new URL('./src/composables', import.meta.url)),
        '@types': fileURLToPath(new URL('./src/types', import.meta.url)),
        '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
      },
    },

    server: {
      // Must be 0.0.0.0 to be accessible from outside Docker container
      host: '0.0.0.0',
      port: 5173,
      strictPort: true,

      // HMR config for Docker (WebSocket needs to point to host machine)
      hmr: {
        host: 'localhost',
        port: 5173,
        protocol: 'ws',
      },

      // Required for file watching inside Docker volumes
      watch: {
        usePolling: true,
        interval: 300,
      },

      // Proxy API calls to Laravel backend (via Nginx)
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://nginx',
          changeOrigin: true,
          secure: false,
        },
        '/sanctum': {
          target: env.VITE_API_URL || 'http://nginx',
          changeOrigin: true,
          secure: false,
        },
      },
    },

    build: {
      outDir: 'dist',
      sourcemap: false,
      minify: 'esbuild',
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            // Separate heavy deps into their own chunks
            'vue-core': ['vue', 'vue-router', 'pinia'],
            'konva-core': ['konva', 'vue-konva'],
            'utils': ['axios', '@vueuse/core'],
          },
        },
      },
    },

    optimizeDeps: {
      include: ['vue', 'vue-router', 'pinia', 'konva', 'vue-konva', 'axios'],
    },
  }
})
