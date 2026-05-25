# ============================================================
# Vue 3 + Vite Frontend
# ============================================================

# ── Stage: development (với HMR) ─────────────────────────────
FROM node:20-alpine AS development

WORKDIR /app

# Install dependencies first (layer cache)
COPY package*.json ./
RUN npm install

# Copy source (overridden by volume mount in dev)
COPY . .

EXPOSE 5173

# --host = listen on all interfaces inside container
# --port = explicit port
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]

# ── Stage: build ─────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --frozen-lockfile

COPY . .
RUN npm run build

# ── Stage: production (Nginx serve static) ───────────────────
FROM nginx:1.25-alpine AS production

COPY --from=builder /app/dist /usr/share/nginx/html
COPY docker/nginx-spa.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
