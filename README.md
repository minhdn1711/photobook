# 📚 Photobook Platform

> Hệ thống tạo Photobook custom in ấn vật lý — Web-to-Print Platform

## Stack

| Layer | Technology |
|---|---|
| **Frontend** | Vue 3 + Vite + Konva.js + Pinia + TypeScript + TailwindCSS |
| **Backend** | Laravel 11 + PHP 8.3 + Laravel Sanctum |
| **Database** | PostgreSQL 16 |
| **Queue/Cache** | Redis 7 + BullMQ |
| **Storage** | MinIO (S3-compatible) |
| **Render Engine** | Node.js 20 + Sharp + PDFKit |
| **Proxy** | Nginx 1.25 |
| **Container** | Docker Compose |

## Quick Start

### Prerequisites
- Docker Desktop (Windows/Mac) hoặc Docker Engine + Docker Compose (Linux)
- Make (Windows: `choco install make` hoặc dùng Git Bash)

### 1. Clone & Setup

```bash
git clone <repo-url> photobook
cd photobook

# First-time setup (copies .env, builds images, installs deps, migrates DB)
make init
```

### 2. Start Development

```bash
make up
```

| Service | URL |
|---|---|
| **App (Frontend + API)** | http://localhost |
| **Vue Vite HMR** | http://localhost:5173 |
| **MinIO Console** | http://localhost:9001 |
| **Mailpit (Email)** | http://localhost:8025 |
| **PostgreSQL** | localhost:5432 |

### 3. Common Commands

```bash
make logs              # Stream all logs
make logs s=frontend   # Stream frontend logs only
make shell-backend     # Bash into Laravel container
make migrate           # Run new migrations
make fresh             # Reset DB + reseed
make test              # Run PHPUnit tests
```

## Project Structure

```
photobook/
├── docker-compose.yml          # Service definitions
├── .env.example                # Environment template
├── Makefile                    # Dev commands
│
├── frontend/                   # Vue 3 + Vite
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ui/             # Design system components
│   │   │   ├── editor/         # Editor-specific components
│   │   │   └── layout/         # App shell components
│   │   ├── pages/              # Route-level page components
│   │   ├── stores/             # Pinia state stores
│   │   ├── composables/        # Vue composables (hooks)
│   │   ├── types/              # TypeScript interfaces
│   │   ├── lib/                # API client, utilities
│   │   └── assets/css/         # Global styles + design tokens
│   └── tailwind.config.js      # Design system → Tailwind mapping
│
├── backend/                    # Laravel 11
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   ├── Models/
│   │   ├── Jobs/               # Laravel Queue jobs
│   │   └── Services/
│   └── database/migrations/    # Database schema
│
├── renderer/                   # Node.js render microservice
│   └── src/
│       ├── index.js            # BullMQ worker + Express server
│       └── workers/
│           └── renderWorker.js # Sharp + PDFKit render pipeline
│
└── nginx/                      # Reverse proxy config
```

## Architecture

```
Browser (Vue 3 SPA)
    ↓ HTTP
Nginx (port 80)
    ↓ /api/*     → PHP-FPM (Laravel)
    ↓ /*         → Vite Dev Server (HMR)
    
Laravel → PostgreSQL (data)
Laravel → Redis (queue/cache)
Laravel → MinIO (photo upload)

Redis → BullMQ → Node.js Renderer
Node.js Renderer → MinIO (reads photos, writes PDF)
Node.js Renderer → Laravel (webhook: render complete)
```

## Design System

Xem [PHOTOBOOK_ARCHITECTURE_PLAN.md](./PHOTOBOOK_ARCHITECTURE_PLAN.md) — Section 5 cho full design system specification.

Key tokens đã được map vào `frontend/tailwind.config.js`:
- **Accent color**: `#C8956C` (Warm Gold-Rose)
- **Fonts**: Playfair Display (headings) + Inter (body)
- **Base unit**: 4px spacing grid

## Environment Variables

Xem [.env.example](./.env.example) cho danh sách đầy đủ.

Key variables:
```env
DB_DATABASE=photobook
DB_PASSWORD=secret
REDIS_PASSWORD=redissecret
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin123
```

## Development Roadmap

Xem [PHOTOBOOK_ARCHITECTURE_PLAN.md](./PHOTOBOOK_ARCHITECTURE_PLAN.md) — Section 10 cho full roadmap.

| Sprint | Focus | Duration |
|---|---|---|
| Sprint 0 | Docker + Foundation + Design tokens + DB schema | Tuần 1–2 |
| Sprint 1 | Public pages + Template listing | Tuần 3–4 |
| Sprint 2 | **Editor core** (Konva.js + Drag/Drop + DPI) | Tuần 5–7 |
| Sprint 3 | Preview + Checkout + Payment | Tuần 8–9 |
| Sprint 4 | Admin + Render pipeline (PDF) | Tuần 10–12 |
| Sprint 5 | Polish + Mobile + Launch | Tuần 13–14 |
