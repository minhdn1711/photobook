<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TemplatePageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                 => $this->id,
            'page_index'         => $this->page_index,
            'page_type'          => $this->page_type,  // cover | inner | back-cover
            'page_size_mm'       => $this->page_size_mm,
            'canvas_size'        => $this->canvas_size,
            'background'         => $this->background,
            'frames'             => $this->frames,
            'texts'              => $this->texts,
            'decorative_overlay' => $this->decorative_overlay,
        ];
    }
}
