<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MediaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                => $this->id,
            'original_filename' => $this->original_filename,
            'url'               => $this->url,
            'thumbnail_url'     => $this->thumbnail_url,
            'width'             => $this->width,
            'height'            => $this->height,
            'file_size'         => $this->file_size,
            'mime_type'         => $this->mime_type,
            'detected_dpi'      => $this->detected_dpi,
            'aspect_ratio'      => $this->aspect_ratio,
            'created_at'        => $this->created_at->toISOString(),
        ];
    }
}
