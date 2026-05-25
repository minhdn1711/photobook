<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('templates', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->enum('category', [
                'wedding', 'travel', 'family', 'baby', 'graduation', 'other'
            ])->default('other');
            $table->text('description')->nullable();
            $table->string('cover_image_url')->nullable();
            $table->json('preview_images')->default('[]');    // Array of page preview URLs

            // Pricing
            $table->unsignedInteger('price');                 // VND
            $table->unsignedTinyInteger('deposit_percent')->default(30);

            // Meta
            $table->boolean('is_popular')->default(false);
            $table->boolean('is_new')->default(true);
            $table->decimal('rating', 3, 1)->default(5.0);
            $table->unsignedInteger('review_count')->default(0);

            $table->enum('status', ['active', 'draft', 'archived'])->default('draft');
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'category']);
            $table->index('is_popular');
        });

        Schema::create('template_pages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('template_id')->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('page_index');        // 0–15

            // Physical dimensions
            $table->json('page_size_mm');                     // {width, height}
            $table->json('canvas_size');                      // {width, height} in pixels

            $table->string('background')->default('#FFFFFF'); // Color or image URL

            // Frame and text definitions (the "locked layout")
            $table->json('frames');                           // FrameDefinition[]
            $table->json('texts');                            // TextDefinition[]

            $table->string('decorative_overlay')->nullable(); // Optional overlay image

            $table->timestamps();

            $table->unique(['template_id', 'page_index']);
            $table->index('template_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('template_pages');
        Schema::dropIfExists('templates');
    }
};
