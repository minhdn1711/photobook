'use strict'

const sharp = require('sharp')
const PDFDocument = require('pdfkit')
const { Minio } = require('minio')
const axios = require('axios')
const path = require('path')
const os = require('os')
const fs = require('fs').promises

// ── MinIO Client ──────────────────────────────────────────────
const minioClient = new Minio.Client({
  endPoint:  process.env.MINIO_ENDPOINT || 'minio',
  port:      parseInt(process.env.MINIO_PORT || '9000'),
  useSSL:    process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin123',
})

const UPLOADS_BUCKET = process.env.MINIO_BUCKET_UPLOADS || 'photobook-uploads'
const RENDERS_BUCKET = process.env.MINIO_BUCKET_RENDERS || 'photobook-renders'
const TARGET_DPI     = parseInt(process.env.RENDER_DPI || '300')

/**
 * Main render job processor.
 *
 * Job data structure:
 * {
 *   orderId: string,
 *   projectId: string,
 *   pages: PageState[],         // from editor store
 *   templatePages: TemplatePageConfig[],
 *   callbackUrl: string,        // Laravel webhook to notify completion
 * }
 */
async function processRenderJob(job) {
  const { orderId, projectId, pages, templatePages, callbackUrl } = job.data

  // Create temp directory for this render
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), `photobook_${orderId}_`))

  try {
    // ── Step 1: Download all photos from MinIO ─────────────────
    await job.updateProgress(5)
    const photoBuffers = await downloadPhotos(pages)

    // ── Step 2: Render each page as high-res PNG ───────────────
    await job.updateProgress(10)
    const pageFiles = []

    for (let i = 0; i < templatePages.length; i++) {
      const pageConfig = templatePages[i]
      const pageState  = pages[i]

      await job.updateProgress(10 + Math.round((i / templatePages.length) * 60))

      const pageFile = path.join(tmpDir, `page_${String(i).padStart(2, '0')}.png`)
      await renderPage(pageConfig, pageState, photoBuffers, pageFile)
      pageFiles.push(pageFile)
    }

    // ── Step 3: Assemble pages into PDF ───────────────────────
    await job.updateProgress(75)
    const pdfFile = path.join(tmpDir, `photobook_${orderId}.pdf`)
    await assemblePdf(pageFiles, templatePages, pdfFile)

    // ── Step 4: Upload PDF to MinIO (renders bucket) ──────────
    await job.updateProgress(90)
    const outputKey = `orders/${orderId}/photobook_${orderId}_print.pdf`
    await uploadToMinio(pdfFile, RENDERS_BUCKET, outputKey)

    // ── Step 5: Notify Laravel backend ────────────────────────
    await job.updateProgress(95)
    const outputUrl = `/${RENDERS_BUCKET}/${outputKey}`
    await notifyBackend(callbackUrl, orderId, outputUrl)

    await job.updateProgress(100)

    return { success: true, outputUrl, orderId }

  } finally {
    // Cleanup temp files
    await fs.rm(tmpDir, { recursive: true, force: true }).catch(() => {})
  }
}

/**
 * Download all unique photos needed for a project.
 * Returns a Map<photoUrl, Buffer>
 */
async function downloadPhotos(pages) {
  const photoUrls = new Set()
  for (const page of pages) {
    for (const frame of page.frames) {
      if (frame.photoId && frame.photoUrl) {
        photoUrls.add(frame.photoUrl)
      }
    }
  }

  const buffers = new Map()
  await Promise.all(
    Array.from(photoUrls).map(async (url) => {
      const buffer = await downloadFromMinio(url)
      buffers.set(url, buffer)
    })
  )

  return buffers
}

/**
 * Render a single page as high-resolution PNG.
 * Composites: background + each frame image (cropped/scaled) + text overlays
 */
async function renderPage(pageConfig, pageState, photoBuffers, outputFile) {
  const { canvasSize } = pageConfig
  const WIDTH  = canvasSize.width
  const HEIGHT = canvasSize.height

  // ── Start with background ──────────────────────────────────
  let composite = sharp({
    create: {
      width: WIDTH,
      height: HEIGHT,
      channels: 3,
      background: pageConfig.background || { r: 255, g: 255, b: 255 },
    }
  }).png()

  const layers = []

  // ── Compose each frame ────────────────────────────────────
  for (const frameDef of pageConfig.frames) {
    const frameState = pageState.frames.find(f => f.frameId === frameDef.id)
    if (!frameState?.photoId || !frameState.photoUrl) continue

    const photoBuffer = photoBuffers.get(frameState.photoUrl)
    if (!photoBuffer) continue

    const crop = frameState.cropData || { x: 0, y: 0, scale: 1 }

    // Process image: scale to fit frame + apply crop offset
    const processedBuffer = await processPhotoForFrame(
      photoBuffer,
      frameDef,
      crop
    )

    layers.push({
      input: processedBuffer,
      top: Math.round(frameDef.y),
      left: Math.round(frameDef.x),
    })
  }

  // Composite all layers at once (better perf than sequential)
  if (layers.length > 0) {
    const baseBuffer = await sharp({
      create: {
        width: WIDTH,
        height: HEIGHT,
        channels: 3,
        background: pageConfig.background || '#FFFFFF',
      }
    }).png().toBuffer()

    await sharp(baseBuffer)
      .composite(layers)
      .toFile(outputFile)
  } else {
    await sharp({
      create: {
        width: WIDTH,
        height: HEIGHT,
        channels: 3,
        background: pageConfig.background || '#FFFFFF',
      }
    }).png().toFile(outputFile)
  }
}

/**
 * Process a photo to fit within a frame, applying crop data.
 * Returns a Buffer of the cropped/scaled region, sized to frame dimensions.
 */
async function processPhotoForFrame(photoBuffer, frameDef, cropData) {
  const frameW = Math.round(frameDef.width)
  const frameH = Math.round(frameDef.height)

  // Get original image dimensions
  const meta = await sharp(photoBuffer).metadata()
  const imgW = meta.width
  const imgH = meta.height

  // Calculate cover scale (fit the frame, overflow and clip)
  const scaleX = frameW / imgW
  const scaleY = frameH / imgH
  const coverScale = Math.max(scaleX, scaleY) * cropData.scale

  const scaledW = Math.round(imgW * coverScale)
  const scaledH = Math.round(imgH * coverScale)

  // Center offset + crop offset from user
  const defaultOffX = Math.round((scaledW - frameW) / 2)
  const defaultOffY = Math.round((scaledH - frameH) / 2)

  const cropX = Math.max(0, defaultOffX - Math.round(cropData.x * coverScale))
  const cropY = Math.max(0, defaultOffY - Math.round(cropData.y * coverScale))

  return sharp(photoBuffer)
    .resize(scaledW, scaledH, { fit: 'fill' })
    .extract({
      left: Math.min(cropX, scaledW - frameW),
      top: Math.min(cropY, scaledH - frameH),
      width: frameW,
      height: frameH,
    })
    .toBuffer()
}

/**
 * Assemble all page PNGs into a single print-ready PDF.
 * Each page is a new page in the PDF at the physical dimensions.
 */
async function assemblePdf(pageFiles, templatePages, outputFile) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      autoFirstPage: false,
      compress: true,
      info: {
        Title: 'Photobook — Print File',
        Creator: 'Photobook Platform',
        Producer: 'PDFKit + Sharp',
      }
    })

    const writeStream = require('fs').createWriteStream(outputFile)
    doc.pipe(writeStream)

    for (let i = 0; i < pageFiles.length; i++) {
      const pageConfig = templatePages[i]
      const sizeMM = pageConfig.pageSizeMM

      // PDF dimensions in points (1pt = 1/72 inch, 1inch = 25.4mm)
      const ptW = (sizeMM.width / 25.4) * 72
      const ptH = (sizeMM.height / 25.4) * 72

      doc.addPage({ size: [ptW, ptH], margin: 0 })
      doc.image(pageFiles[i], 0, 0, { width: ptW, height: ptH })
    }

    doc.end()

    writeStream.on('finish', resolve)
    writeStream.on('error', reject)
  })
}

/**
 * Download an object from MinIO by its URL path.
 * URL format: /bucket-name/path/to/object
 */
async function downloadFromMinio(url) {
  // Parse bucket and object key from URL
  const parts = url.replace(/^\//, '').split('/')
  const bucket = parts[0]
  const key = parts.slice(1).join('/')

  return new Promise((resolve, reject) => {
    minioClient.getObject(bucket, key, (err, stream) => {
      if (err) return reject(err)

      const chunks = []
      stream.on('data', chunk => chunks.push(chunk))
      stream.on('end', () => resolve(Buffer.concat(chunks)))
      stream.on('error', reject)
    })
  })
}

/** Upload a file to MinIO */
async function uploadToMinio(filePath, bucket, objectKey) {
  await minioClient.fPutObject(bucket, objectKey, filePath, {
    'Content-Type': 'application/pdf',
  })
}

/** Notify Laravel backend that render is complete */
async function notifyBackend(callbackUrl, orderId, outputUrl) {
  if (!callbackUrl) return

  await axios.post(
    callbackUrl,
    { order_id: orderId, output_url: outputUrl, status: 'completed' },
    {
      headers: { 'X-Renderer-Secret': process.env.BACKEND_API_SECRET },
      timeout: 10000,
    }
  )
}

module.exports = { processRenderJob }
