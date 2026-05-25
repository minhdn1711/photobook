import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Template } from '@/types'
import { api } from '@/lib/api'

interface FetchParams {
  category?: string | null
  popular?: boolean
  page?: number
  per_page?: number
  sort?: string
}

export const useTemplateStore = defineStore('templates', () => {
  // ── State ────────────────────────────────────────────────────
  const cache = ref<Map<string, Template>>(new Map())

  // ── Actions ──────────────────────────────────────────────────

  /** Fetch paginated list */
  async function fetchList(params: FetchParams = {}) {
    const query: Record<string, string | number | boolean> = {}
    if (params.category) query.category = params.category
    if (params.popular)  query.popular  = 1
    if (params.page)     query.page     = params.page
    if (params.per_page) query.per_page = params.per_page
    if (params.sort)     query.sort     = params.sort

    const res = await api.get<{ data: Template[]; meta: { last_page: number; total: number } }>(
      '/templates', query
    )
    return res.data
  }

  /** Fetch single template by slug (with pages) — cached */
  async function fetchBySlug(slug: string): Promise<Template> {
    if (cache.value.has(slug)) {
      return cache.value.get(slug)!
    }
    const res = await api.get<{ data: Template }>(`/templates/${slug}`)
    const t = res.data.data
    cache.value.set(slug, t)
    return t
  }

  return { cache, fetchList, fetchBySlug }
})
