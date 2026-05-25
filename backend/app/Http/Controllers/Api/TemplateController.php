<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TemplatePageResource;
use App\Http\Resources\TemplateResource;
use App\Models\Template;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TemplateController extends Controller
{
    /**
     * GET /api/templates
     * Public — list active templates with optional filtering & pagination.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Template::active()
            ->withCount('projects as usage_count')
            ->orderByDesc('is_popular')
            ->orderByDesc('created_at');

        if ($category = $request->get('category')) {
            $query->where('category', $category);
        }

        if ($request->boolean('popular')) {
            $query->where('is_popular', true);
        }

        $templates = $query->paginate(12);

        return response()->json([
            'data' => TemplateResource::collection($templates->items()),
            'meta' => [
                'current_page' => $templates->currentPage(),
                'last_page'    => $templates->lastPage(),
                'per_page'     => $templates->perPage(),
                'total'        => $templates->total(),
            ],
        ]);
    }

    /**
     * GET /api/templates/{slug}
     * Public — template detail including all 16 page configs.
     */
    public function show(string $slug): JsonResponse
    {
        $template = Template::active()
            ->where('slug', $slug)
            ->with('pages')
            ->firstOrFail();

        return response()->json([
            'data' => new TemplateResource($template),
        ]);
    }
}
