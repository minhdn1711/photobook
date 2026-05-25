<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use HasUuids, SoftDeletes;

    protected $fillable = [
        'user_id',
        'template_id',
        'name',
        'status',
        'data',
        'last_saved_at',
        'submitted_at',
    ];

    protected $casts = [
        'data'          => 'array',
        'last_saved_at' => 'datetime',
        'submitted_at'  => 'datetime',
    ];

    // ── Relationships ─────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(Template::class);
    }

    public function media(): HasMany
    {
        return $this->hasMany(Media::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }
}
