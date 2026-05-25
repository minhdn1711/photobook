<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'name'          => $this->name,
            'status'        => $this->status,
            'data'          => $this->data,
            'last_saved_at' => $this->last_saved_at?->toISOString(),
            'submitted_at'  => $this->submitted_at?->toISOString(),
            'created_at'    => $this->created_at->toISOString(),
            'updated_at'    => $this->updated_at->toISOString(),
            'template'      => $this->whenLoaded('template', fn() =>
                new TemplateResource($this->template)
            ),
            'media'         => $this->whenLoaded('media', fn() =>
                MediaResource::collection($this->media)
            ),
        ];
    }
}
