<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ── Media (user uploaded photos) ─────────────────────────
        Schema::create('media', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->uuid('project_id');
            $table->foreign('project_id')->references('id')->on('projects')->cascadeOnDelete();

            $table->string('original_filename');
            $table->string('storage_key');              // MinIO object key
            $table->string('url');                      // Full public URL
            $table->string('thumbnail_url')->nullable();// 200x200 thumbnail URL

            // Image metadata
            $table->unsignedInteger('width');           // pixels
            $table->unsignedInteger('height');          // pixels
            $table->unsignedBigInteger('file_size');    // bytes
            $table->string('mime_type', 50);
            $table->unsignedSmallInteger('detected_dpi')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index(['user_id', 'project_id']);
            $table->index('project_id');
        });

        // ── Orders ────────────────────────────────────────────────
        Schema::create('orders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('project_id');
            $table->foreign('project_id')->references('id')->on('projects');
            $table->foreignId('user_id')->constrained();

            $table->enum('status', [
                'pending_payment',
                'deposit_paid',
                'admin_reviewing',
                'approved',
                'rendering',
                'render_complete',
                'printing',
                'shipping',
                'delivered',
                'cancelled',
            ])->default('pending_payment');

            // Pricing
            $table->unsignedInteger('total_amount');     // VND
            $table->unsignedInteger('deposit_amount');   // VND
            $table->unsignedInteger('remaining_amount'); // VND

            // Payment
            $table->string('payment_method')->nullable();
            $table->string('payment_ref')->nullable();   // Payment gateway reference
            $table->timestamp('deposit_paid_at')->nullable();
            $table->timestamp('final_paid_at')->nullable();

            // Shipping
            $table->json('shipping_address')->nullable();
            $table->string('tracking_number')->nullable();
            $table->timestamp('shipped_at')->nullable();
            $table->timestamp('delivered_at')->nullable();

            $table->text('admin_notes')->nullable();
            $table->text('customer_notes')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index(['user_id', 'status']);
            $table->index(['status', 'created_at']);
            $table->index('project_id');
        });

        // ── Render Jobs ───────────────────────────────────────────
        Schema::create('render_jobs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('order_id');
            $table->foreign('order_id')->references('id')->on('orders')->cascadeOnDelete();

            $table->string('bullmq_job_id')->nullable();  // BullMQ job ID for status polling

            $table->enum('status', [
                'queued',
                'processing',
                'completed',
                'failed',
            ])->default('queued');

            $table->unsignedTinyInteger('progress')->default(0);    // 0–100

            $table->string('output_path')->nullable();    // MinIO key for final PDF
            $table->string('output_url')->nullable();     // Public URL to download (admin only)

            $table->text('error_log')->nullable();
            $table->unsignedTinyInteger('attempt')->default(1);

            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->index(['order_id', 'status']);
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('render_jobs');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('media');
    }
};
