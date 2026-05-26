<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TemplatePageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            // camelCase keys — must match TemplatePageConfig TypeScript interface
            'pageIndex'         => $this->page_index,
            'pageType'          => $this->page_type,   // cover | inner | back-cover
            'pageSizeMM'        => $this->page_size_mm,
            'canvasSize'        => $this->canvas_size,
            'background'        => $this->background,
            'frames'            => $this->frames,
            'texts'             => $this->texts,
            'decorativeOverlay' => $this->decorative_overlay,
        ];
    }
}
