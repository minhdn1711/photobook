import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueKonva from 'vue-konva'

import App from './App.vue'
import router from './router'

// Global styles (Tailwind + Design tokens)
import './assets/css/main.css'

// ── Create App ────────────────────────────────────────────────
const app = createApp(App)

// ── Plugins ──────────────────────────────────────────────────
app.use(createPinia())
app.use(router)
app.use(VueKonva)

// ── Mount ────────────────────────────────────────────────────
app.mount('#app')
