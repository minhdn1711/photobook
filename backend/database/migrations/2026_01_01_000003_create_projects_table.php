<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('template_id')->constrained();
            $table->string('name')->default('Photobook của tôi');

            $table->enum('status', [
                'draft',
                'submitted',
                'approved',
                'rendering',
                'completed',
                'cancelled'
            ])->default('draft');

            /**
             * Core project data: the user's customizations.
             * Structure: {
             *   pages: [
             *     {
             *       pageIndex: 0,
             *       frames: [{ frameId, photoId, cropData }],
             *       texts:  [{ textId, content, fontFamily, ... }]
             *     }
             *   ]
             * }
             */
            $table->json('data')->default('{"pages":[]}');

            $table->timestamp('last_saved_at')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['user_id', 'status']);
            $table->index(['user_id', 'created_at']);
            $table->index('template_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
