<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use HasUuids, SoftDeletes;

    protected $fillable = [
        'project_id',
        'user_id',
        'status',
        'total_amount',
        'deposit_amount',
        'remaining_amount',
        'payment_method',
        'payment_ref',
        'deposit_paid_at',
        'final_paid_at',
        'shipping_address',
        'tracking_number',
        'shipped_at',
        'delivered_at',
        'admin_notes',
        'customer_notes',
    ];

    protected $casts = [
        'shipping_address' => 'array',
        'deposit_paid_at'  => 'datetime',
        'final_paid_at'    => 'datetime',
        'shipped_at'       => 'datetime',
        'delivered_at'     => 'datetime',
        'total_amount'     => 'integer',
        'deposit_amount'   => 'integer',
        'remaining_amount' => 'integer',
    ];

    // ── Status helpers ────────────────────────────────────────────

    public function isPaid(): bool
    {
        return in_array($this->status, [
            'deposit_paid', 'admin_reviewing', 'approved',
            'rendering', 'render_complete', 'printing',
            'shipping', 'delivered',
        ]);
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

    public function renderJob(): HasOne
    {
        return $this->hasOne(RenderJob::class);
    }
}
