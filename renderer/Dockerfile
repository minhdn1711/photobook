# ============================================================
# Node.js Render Service — Sharp + PDFKit + BullMQ
# ============================================================

# ── Stage: base ──────────────────────────────────────────────
FROM node:20-alpine AS base

# Sharp requires native build tools + libvips
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    vips-dev \
    fftw-dev \
    libc6-compat

WORKDIR /app

# Copy package files first (layer cache)
COPY package*.json ./

# ── Stage: development ───────────────────────────────────────
FROM base AS development

RUN npm install

COPY . .

EXPOSE 3001

CMD ["node", "--watch", "src/index.js"]

# ── Stage: production ────────────────────────────────────────
FROM base AS production

ENV NODE_ENV=production

RUN npm ci --only=production && npm cache clean --force

COPY . .

EXPOSE 3001

CMD ["node", "src/index.js"]
