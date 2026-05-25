import { ref, shallowRef } from 'vue'

// ── LRU Image Cache ───────────────────────────────────────────
const MAX_CACHE_SIZE = 60

class LRUImageCache {
  private cache = new Map<string, HTMLImageElement>()

  get(url: string): HTMLImageElement | undefined {
    if (!this.cache.has(url)) return undefined

    // Move to end (most recently used)
    const img = this.cache.get(url)!
    this.cache.delete(url)
    this.cache.set(url, img)
    return img
  }

  set(url: string, img: HTMLImageElement) {
    if (this.cache.has(url)) {
      this.cache.delete(url)
    } else if (this.cache.size >= MAX_CACHE_SIZE) {
      // Evict least recently used (first entry)
      const firstKey = this.cache.keys().next().value
      if (firstKey) this.cache.delete(firstKey)
    }
    this.cache.set(url, img)
  }

  has(url: string): boolean {
    return this.cache.has(url)
  }
}

const imageCache = new LRUImageCache()

// ── In-flight requests (dedup concurrent loads) ───────────────
const inFlight = new Map<string, Promise<HTMLImageElement>>()

/**
 * Load an image from URL with LRU caching.
 * Multiple calls with the same URL will share a single request.
 *
 * Usage in Konva components:
 *   const { image, isLoading } = usePhotoLoader(computedUrl)
 */
export function usePhotoLoader(url: string | null) {
  const image = shallowRef<HTMLImageElement | null>(null)
  const isLoading = ref(false)
  const hasError = ref(false)

  async function load(imageUrl: string) {
    // Check cache first
    const cached = imageCache.get(imageUrl)
    if (cached) {
      image.value = cached
      return
    }

    // Check in-flight
    if (inFlight.has(imageUrl)) {
      isLoading.value = true
      try {
        image.value = await inFlight.get(imageUrl)!
      } catch {
        hasError.value = true
      } finally {
        isLoading.value = false
      }
      return
    }

    // Load fresh
    isLoading.value = true
    hasError.value = false

    const loadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new window.Image()
      img.crossOrigin = 'anonymous'

      img.onload = () => {
        imageCache.set(imageUrl, img)
        resolve(img)
      }

      img.onerror = () => {
        reject(new Error(`Failed to load image: ${imageUrl}`))
      }

      img.src = imageUrl
    })

    inFlight.set(imageUrl, loadPromise)

    try {
      image.value = await loadPromise
    } catch {
      hasError.value = true
      image.value = null
    } finally {
      isLoading.value = false
      inFlight.delete(imageUrl)
    }
  }

  // Load immediately if URL provided
  if (url) {
    load(url)
  }

  return { image, isLoading, hasError, load }
}

/**
 * Preload an array of image URLs into cache silently.
 * Call this when template loads to warm the cache.
 */
export async function preloadImages(urls: string[]) {
  const uncached = urls.filter(url => !imageCache.has(url))

  await Promise.allSettled(
    uncached.map(url => {
      return new Promise<void>((resolve) => {
        const img = new window.Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => { imageCache.set(url, img); resolve() }
        img.onerror = () => resolve() // Fail silently for preload
        img.src = url
      })
    })
  )
}
