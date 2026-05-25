<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Media extends Model
{
    use HasUuids, SoftDeletes;

    protected $fillable = [
        'user_id',
        'project_id',
        'original_filename',
        'storage_key',
        'url',
        'thumbnail_url',
        'width',
        'height',
        'file_size',
        'mime_type',
        'detected_dpi',
    ];

    protected $casts = [
        'width'        => 'integer',
        'height'       => 'integer',
        'file_size'    => 'integer',
        'detected_dpi' => 'integer',
    ];

    // ── Accessors ─────────────────────────────────────────────────

    /**
     * Pixel aspect ratio (width / height).
     */
    public function getAspectRatioAttribute(): float
    {
        return $this->height > 0
            ? round($this->width / $this->height, 4)
            : 1.0;
    }

    // ── Relationships ─────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
