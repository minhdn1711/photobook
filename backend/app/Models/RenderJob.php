<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RenderJob extends Model
{
    use HasUuids;

    protected $fillable = [
        'order_id',
        'bullmq_job_id',
        'status',
        'progress',
        'output_path',
        'output_url',
        'error_log',
        'attempt',
        'started_at',
        'completed_at',
    ];

    protected $casts = [
        'progress'     => 'integer',
        'attempt'      => 'integer',
        'started_at'   => 'datetime',
        'completed_at' => 'datetime',
    ];

    // ── Helpers ──────────────────────────────────────────────────

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function hasFailed(): bool
    {
        return $this->status === 'failed';
    }

    // ── Relationships ─────────────────────────────────────────────

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
