#!/bin/sh
# ==============================================================
# Laravel Development Entrypoint
# Runs inside the container AFTER the host volume is mounted.
# Order matters: dirs → .env → vendor/ → APP_KEY → start
# ==============================================================
set -e

# ── 1. Required Laravel directories ──────────────────────────
# Must happen first; bootstrap/cache needed by composer post-hooks.
echo "🔧  Ensuring Laravel directories exist..."
mkdir -p \
    storage/logs \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    storage/app/public \
    bootstrap/cache

# Wide permissions in dev (www-data + host user can both write)
chmod -R 777 storage bootstrap/cache

# ── 2. .env file setup ───────────────────────────────────────
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        echo "📋  Creating .env from .env.example..."
        cp .env.example .env
    else
        echo "⚠️   No .env.example — creating minimal .env..."
        printf 'APP_NAME=Photobook\nAPP_ENV=local\nAPP_KEY=\nAPP_DEBUG=true\nAPP_URL=http://localhost\n' > .env
    fi
fi

# ── 3. Composer install (vendor must exist before php artisan) ─
if [ ! -f vendor/autoload.php ]; then
    echo "📦  vendor/ absent — running composer install..."
    composer install \
        --no-interaction \
        --prefer-dist \
        --optimize-autoloader
fi

# ── 4. Generate APP_KEY (needs vendor/ to be present) ────────
if ! grep -q "^APP_KEY=base64:" .env 2>/dev/null; then
    echo "🔑  Generating APP_KEY..."
    php artisan key:generate --ansi --force
fi

echo "✅  Bootstrap complete — starting service..."
exec "$@"
