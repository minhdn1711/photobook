import type { DpiCheckResult, DpiStatus, FrameDefinition, Photo } from '@/types'

/**
 * Calculate effective DPI of a photo placed in a frame.
 *
 * Formula:
 *   Frame physical size (mm) → at 300 DPI → required pixels
 *   Actual image pixels / zoom level → effective pixels
 *   Effective DPI = (effectivePixels / requiredPixels) × 300
 */
export function calculateEffectiveDpi(
  photo: Pick<Photo, 'width' | 'height'>,
  frame: Pick<FrameDefinition, 'printSizeMM'>,
  zoomLevel = 1.0
): DpiCheckResult {
  const MM_PER_INCH = 25.4
  const TARGET_DPI = 300

  // Frame required pixels at 300 DPI
  const framePixelsW = (frame.printSizeMM.width / MM_PER_INCH) * TARGET_DPI
  const framePixelsH = (frame.printSizeMM.height / MM_PER_INCH) * TARGET_DPI

  // Effective image pixels (account for zoom — zooming in uses fewer source pixels)
  const effectiveW = photo.width / zoomLevel
  const effectiveH = photo.height / zoomLevel

  // Use the limiting dimension
  const dpiW = (effectiveW / framePixelsW) * TARGET_DPI
  const dpiH = (effectiveH / framePixelsH) * TARGET_DPI
  const effectiveDpi = Math.round(Math.min(dpiW, dpiH))

  const status = getDpiStatus(effectiveDpi)
  const message = getDpiMessage(status, effectiveDpi)

  return {
    status,
    effectiveDpi,
    framePhysicalMM: frame.printSizeMM,
    imagePixels: { width: photo.width, height: photo.height },
    zoomLevel,
    message,
  }
}

function getDpiStatus(dpi: number): DpiStatus {
  if (dpi >= 300) return 'good'
  if (dpi >= 150) return 'warning'
  if (dpi >= 72) return 'critical'
  return 'critical'
}

function getDpiMessage(status: DpiStatus, dpi: number): string {
  switch (status) {
    case 'good':
      return `Chất lượng tốt (${dpi} DPI)`
    case 'warning':
      return `Có thể in hơi mờ (${dpi} DPI). Khuyến nghị ≥300 DPI.`
    case 'critical':
      return `Ảnh quá nhỏ, sẽ in mờ (${dpi} DPI). Nên dùng ảnh khác.`
    default:
      return 'Không xác định chất lượng'
  }
}

/**
 * Get image pixel dimensions from a File object
 * using browser Canvas API (client-side, no upload needed)
 */
export function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()

    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
      URL.revokeObjectURL(url)
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }

    img.src = url
  })
}

/**
 * Generate a small thumbnail from a File object (client-side)
 * Returns a data URL for immediate display before upload completes
 */
export function generateThumbnail(
  file: File,
  maxSize = 200
): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()

    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ratio = Math.min(maxSize / img.naturalWidth, maxSize / img.naturalHeight)
      canvas.width = img.naturalWidth * ratio
      canvas.height = img.naturalHeight * ratio

      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      resolve(canvas.toDataURL('image/jpeg', 0.85))
      URL.revokeObjectURL(url)
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to generate thumbnail'))
    }

    img.src = url
  })
}
