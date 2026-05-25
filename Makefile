# ============================================================
# PHOTOBOOK PLATFORM — Makefile
# Usage: make <command>
# ============================================================

.PHONY: help init up down restart build logs shell-backend shell-frontend \
        migrate seed fresh artisan composer npm test clean

# Default target
help:
	@echo ""
	@echo "  ╔═══════════════════════════════════════════════════╗"
	@echo "  ║         PHOTOBOOK PLATFORM — Dev Commands         ║"
	@echo "  ╚═══════════════════════════════════════════════════╝"
	@echo ""
	@echo "  SETUP"
	@echo "  make init          First-time setup (copy .env, install deps, migrate)"
	@echo "  make build         Build all Docker images"
	@echo ""
	@echo "  RUNTIME"
	@echo "  make up            Start all services (detached)"
	@echo "  make down          Stop all services"
	@echo "  make restart       Restart all services"
	@echo "  make logs          Stream logs from all services"
	@echo "  make logs s=backend    Stream logs from specific service"
	@echo ""
	@echo "  DATABASE"
	@echo "  make migrate       Run Laravel migrations"
	@echo "  make seed          Seed database with demo data"
	@echo "  make fresh         Drop all tables and re-migrate + seed"
	@echo "  make db-shell      Open PostgreSQL psql shell"
	@echo ""
	@echo "  SHELLS"
	@echo "  make shell-backend     Open bash in backend container"
	@echo "  make shell-frontend    Open sh in frontend container"
	@echo "  make shell-renderer    Open sh in renderer container"
	@echo ""
	@echo "  TOOLS"
	@echo "  make artisan cmd='...'   Run artisan command"
	@echo "  make composer cmd='...'  Run composer command"
	@echo "  make npm cmd='...'       Run npm command in frontend"
	@echo "  make test                Run backend tests"
	@echo ""
	@echo "  CLEANUP"
	@echo "  make clean         Remove containers, volumes, and images"
	@echo ""

# ── Setup ─────────────────────────────────────────────────────

init:
	@echo "────────────────────────────────────────────────"
	@echo "  PHOTOBOOK — First-time setup"
	@echo "────────────────────────────────────────────────"
	@echo "→ [1/8] Copying root .env.example → .env..."
	@cp -n .env.example .env 2>/dev/null || echo "  (root .env already exists, skipping)"
	@echo "→ [2/8] Copying backend/.env.example → backend/.env..."
	@cp -n backend/.env.example backend/.env 2>/dev/null || echo "  (backend/.env already exists, skipping)"
	@echo "→ [3/8] Building Docker images..."
	@docker compose build
	@echo "→ [4/8] Starting infrastructure services (postgres, redis, minio)..."
	@docker compose up -d postgres redis minio
	@echo "→ Waiting 8s for services to become healthy..."
	@sleep 8
	@echo "→ [5/8] Bootstrap backend (vendor install + APP_KEY)..."
	@docker compose run --rm backend true
	@echo "→ Publishing Sanctum migrations (if not already done)..."
	@docker compose run --rm backend php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider" --tag="sanctum-migrations" --quiet || true
	@echo "→ [6/8] Running database migrations..."
	@docker compose run --rm backend php artisan migrate --force
	@echo "→ [7/8] Seeding demo data (users + 3 templates)..."
	@docker compose run --rm backend php artisan db:seed --force
	@echo "→ [8/8] Starting all services..."
	@docker compose up -d
	@echo ""
	@echo "  ✓ Setup complete! URLs:"
	@echo "  → App:       http://localhost"
	@echo "  → API:       http://localhost/api/up"
	@echo "  → MinIO:     http://localhost:9001  (minioadmin / minioadmin123)"
	@echo "  → Mailpit:   http://localhost:8025"
	@echo "  → Admin:     admin@photobook.vn / Admin@12345"
	@echo "  → Demo user: demo@photobook.vn  / Demo@12345"
	@echo ""

# ── Runtime ───────────────────────────────────────────────────

up:
	docker compose up -d
	@echo "→ Services started. App: http://localhost"

down:
	docker compose down

restart:
	docker compose restart

build:
	docker compose build --no-cache

logs:
ifdef s
	docker compose logs -f $(s)
else
	docker compose logs -f
endif

ps:
	docker compose ps

# ── Database ──────────────────────────────────────────────────

migrate:
	docker compose exec backend php artisan migrate

seed:
	docker compose exec backend php artisan db:seed

fresh:
	docker compose exec backend php artisan migrate:fresh --seed

db-shell:
	docker compose exec postgres psql -U photobook -d photobook

# ── Shells ────────────────────────────────────────────────────

shell-backend:
	docker compose exec backend bash

shell-frontend:
	docker compose exec frontend sh

shell-renderer:
	docker compose exec renderer sh

shell-redis:
	docker compose exec redis redis-cli -a $$(grep REDIS_PASSWORD .env | cut -d= -f2)

# ── Tools ─────────────────────────────────────────────────────

artisan:
	docker compose exec backend php artisan $(cmd)

composer:
	docker compose exec backend composer $(cmd)

npm:
	docker compose exec frontend npm $(cmd)

test:
	docker compose exec backend php artisan test

test-coverage:
	docker compose exec backend php artisan test --coverage

# ── Production ────────────────────────────────────────────────

prod-build:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml build

prod-up:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# ── Cleanup ───────────────────────────────────────────────────

clean:
	@echo "→ Stopping and removing containers, networks, volumes..."
	docker compose down -v --remove-orphans
	@echo "→ Removing unused images..."
	docker image prune -f
	@echo "✓ Cleanup complete"
