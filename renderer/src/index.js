'use strict'

require('dotenv').config()
const { Worker, Queue } = require('bullmq')
const express = require('express')
const { createLogger, format, transports } = require('winston')

// ── Logger ────────────────────────────────────────────────────
const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: format.combine(
    format.timestamp(),
    format.colorize(),
    format.printf(({ timestamp, level, message, ...meta }) => {
      const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : ''
      return `[${timestamp}] ${level}: ${message}${metaStr}`
    })
  ),
  transports: [new transports.Console()],
})

// ── Redis Connection ──────────────────────────────────────────
const redisConnection = {
  host: process.env.REDIS_HOST || 'redis',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null, // Required for BullMQ
}

// ── BullMQ Worker ─────────────────────────────────────────────
const renderWorker = new Worker(
  'render-jobs',
  async (job) => {
    const { processRenderJob } = require('./workers/renderWorker')
    logger.info(`Processing render job: ${job.id}`, {
      orderId: job.data.orderId,
      projectId: job.data.projectId,
    })

    try {
      const result = await processRenderJob(job)
      logger.info(`Render job completed: ${job.id}`, { outputUrl: result.outputUrl })
      return result
    } catch (error) {
      logger.error(`Render job failed: ${job.id}`, { error: error.message })
      throw error
    }
  },
  {
    connection: redisConnection,
    concurrency: parseInt(process.env.RENDER_CONCURRENCY || '2'),
    limiter: {
      max: 5,       // Max 5 jobs per...
      duration: 60000, // ...minute (rate limiting)
    },
  }
)

// Worker event handlers
renderWorker.on('completed', (job, result) => {
  logger.info(`✓ Job ${job.id} completed`, result)
})

renderWorker.on('failed', (job, error) => {
  logger.error(`✗ Job ${job.id} failed`, { error: error.message, attempt: job.attemptsMade })
})

renderWorker.on('stalled', (jobId) => {
  logger.warn(`⚠ Job ${jobId} stalled`)
})

// ── Express Health Check Server ───────────────────────────────
const app = express()
app.use(express.json())

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'photobook-renderer',
    timestamp: new Date().toISOString(),
    worker: {
      running: !renderWorker.closing,
    },
  })
})

// Render queue status
app.get('/queue/stats', async (req, res) => {
  // Verify internal API secret
  const secret = req.headers['x-renderer-secret']
  if (secret !== process.env.BACKEND_API_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const queue = new Queue('render-jobs', { connection: redisConnection })
  const [waiting, active, completed, failed] = await Promise.all([
    queue.getWaitingCount(),
    queue.getActiveCount(),
    queue.getCompletedCount(),
    queue.getFailedCount(),
  ])

  res.json({ waiting, active, completed, failed })
})

// Start HTTP server
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  logger.info(`🎨 Renderer service started on port ${PORT}`)
  logger.info(`📡 Redis: ${redisConnection.host}:${redisConnection.port}`)
  logger.info(`🗄️  MinIO: ${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}`)
})

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully...')
  await renderWorker.close()
  process.exit(0)
})
