# ============================================================
# Laravel Backend — PHP 8.3 FPM Alpine
# ============================================================

# ── Stage: base ──────────────────────────────────────────────
FROM php:8.3-fpm-alpine AS base

# ── 1. System libraries (runtime deps only — no build tools here) ──
RUN apk add --no-cache \
    bash \
    curl \
    git \
    libpng \
    libjpeg-turbo \
    freetype \
    libzip \
    zip \
    unzip \
    libpq \
    oniguruma \
    icu-libs

# ── 2. Build + compile PHP extensions in one layer, then strip build tools ──
#    $PHPIZE_DEPS  = autoconf dpkg-dev file g++ gcc libc-dev make pkgconf re2c
#    *-dev packages are needed at compile time, removed afterwards via virtual pkg
RUN apk add --no-cache --virtual .build-deps \
        $PHPIZE_DEPS \
        libpng-dev \
        libjpeg-turbo-dev \
        freetype-dev \
        libzip-dev \
        postgresql-dev \
        oniguruma-dev \
        icu-dev \
        linux-headers \
    \
    # Configure GD with freetype + jpeg
    && docker-php-ext-configure gd \
        --with-freetype \
        --with-jpeg \
    \
    # Install core extensions
    && docker-php-ext-install -j$(nproc) \
        pdo \
        pdo_pgsql \
        pgsql \
        mbstring \
        exif \
        pcntl \
        bcmath \
        gd \
        zip \
        intl \
        opcache \
    \
    # Install Redis via PECL (needs $PHPIZE_DEPS present)
    && pecl install redis \
    && docker-php-ext-enable redis \
    && pecl clear-cache \
    \
    # Remove build-time deps to keep image lean
    && apk del .build-deps

# ── 3. Composer ───────────────────────────────────────────────
COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

# ── 4. Working directory ──────────────────────────────────────
WORKDIR /var/www/html

# ── Stage: development ───────────────────────────────────────
FROM base AS development

# Xdebug also needs build tools temporarily
RUN apk add --no-cache --virtual .xdebug-build-deps \
        $PHPIZE_DEPS \
        linux-headers \
    && pecl install xdebug \
    && docker-php-ext-enable xdebug \
    && pecl clear-cache \
    && apk del .xdebug-build-deps

# PHP config for development
COPY docker/php/php-dev.ini  /usr/local/etc/php/conf.d/99-dev.ini
COPY docker/php/opcache.ini  /usr/local/etc/php/conf.d/10-opcache.ini

# Copy & enable the development entrypoint script
COPY docker/entrypoint.dev.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 9000
# entrypoint creates dirs + optionally composer install → then starts php-fpm
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["php-fpm"]

# ── Stage: production ────────────────────────────────────────
FROM base AS production

# PHP config for production
COPY docker/php/php-prod.ini /usr/local/etc/php/conf.d/99-prod.ini
COPY docker/php/opcache.ini  /usr/local/etc/php/conf.d/10-opcache.ini

# Copy application files
COPY . .

# ── Create required Laravel directories BEFORE composer install ──
# bootstrap/cache is git-ignored but package:discover (post-autoload-dump)
# writes there, so it must exist before `composer install` runs.
RUN mkdir -p \
        storage/logs \
        storage/framework/cache \
        storage/framework/sessions \
        storage/framework/views \
        storage/app/public \
        bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Install production dependencies (triggers post-autoload-dump safely now)
RUN composer install \
        --no-dev \
        --optimize-autoloader \
        --no-interaction \
        --prefer-dist

# Lock down permissions for www-data
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

EXPOSE 9000
CMD ["php-fpm"]
