<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TemplateResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'name'            => $this->name,
            'slug'            => $this->slug,
            'category'        => $this->category,
            'description'     => $this->description,
            'cover_image_url' => $this->cover_image_url,
            'preview_images'  => $this->preview_images ?? [],
            'price'           => $this->price,
            'deposit_percent' => $this->deposit_percent,
            'is_popular'      => $this->is_popular,
            'is_new'          => $this->is_new,
            'rating'          => (float) $this->rating,
            'review_count'    => $this->review_count,
            'page_count'      => $this->whenLoaded('pages', fn() => $this->pages->count(), 16),
            // Pages only included on detail view (when relation is loaded)
            'pages'           => $this->whenLoaded('pages', fn() =>
                TemplatePageResource::collection($this->pages)
            ),
        ];
    }
}
