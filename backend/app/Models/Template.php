<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Template extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'category',
        'description',
        'cover_image_url',
        'preview_images',
        'price',
        'deposit_percent',
        'is_popular',
        'is_new',
        'rating',
        'review_count',
        'status',
    ];

    protected $casts = [
        'preview_images' => 'array',
        'is_popular'     => 'boolean',
        'is_new'         => 'boolean',
        'rating'         => 'decimal:1',
        'price'          => 'integer',
        'review_count'   => 'integer',
    ];

    // ── Scopes ────────────────────────────────────────────────────

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    // ── Relationships ─────────────────────────────────────────────

    public function pages(): HasMany
    {
        return $this->hasMany(TemplatePage::class)->orderBy('page_index');
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }
}
