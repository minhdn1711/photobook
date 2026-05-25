<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TemplatePage extends Model
{
    protected $fillable = [
        'template_id',
        'page_index',
        'page_size_mm',
        'canvas_size',
        'background',
        'frames',
        'texts',
        'decorative_overlay',
    ];

    protected $casts = [
        'page_size_mm' => 'array',
        'canvas_size'  => 'array',
        'frames'       => 'array',
        'texts'        => 'array',
    ];

    // ── Relationships ─────────────────────────────────────────────

    public function template(): BelongsTo
    {
        return $this->belongsTo(Template::class);
    }

    // ── Helpers ──────────────────────────────────────────────────

    /**
     * Number of required photo frames on this page.
     */
    public function requiredFrameCount(): int
    {
        return collect($this->frames)
            ->where('required', true)
            ->count();
    }

    /**
     * Page type based on index (cover=0, back-cover=15, inner=1-14).
     */
    public function getPageTypeAttribute(): string
    {
        return match ($this->page_index) {
            0       => 'cover',
            15      => 'back-cover',
            default => 'inner',
        };
    }
}
