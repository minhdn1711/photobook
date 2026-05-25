<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectResource;
use App\Models\Template;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    /**
     * GET /api/projects
     * Paginated list of the current user's projects.
     */
    public function index(Request $request): JsonResponse
    {
        $projects = $request->user()
            ->projects()
            ->with('template:id,name,slug,cover_image_url,price')
            ->latest('last_saved_at')
            ->paginate(20);

        return response()->json([
            'data' => ProjectResource::collection($projects->items()),
            'meta' => [
                'current_page' => $projects->currentPage(),
                'last_page'    => $projects->lastPage(),
                'total'        => $projects->total(),
            ],
        ]);
    }

    /**
     * POST /api/projects
     * Create a new project from a template; initialize empty page data.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'template_id' => ['required', 'integer', 'exists:templates,id'],
            'name'        => ['nullable', 'string', 'max:255'],
        ]);

        $template = Template::with('pages')
            ->active()
            ->findOrFail($validated['template_id']);

        // Build initial empty-page data from template frame definitions
        $pages = $template->pages->map(function ($page) {
            return [
                'pageIndex' => $page->page_index,
                'frames'    => collect($page->frames)->map(fn($f) => [
                    'frameId'  => $f['id'],
                    'photoId'  => null,
                    'cropData' => ['x' => 0.0, 'y' => 0.0, 'zoom' => 1.0],
                ])->values()->all(),
                'texts' => collect($page->texts)->map(fn($t) => [
                    'textId'  => $t['id'],
                    'content' => $t['defaultValue'] ?? '',
                    'style'   => [],
                ])->values()->all(),
            ];
        })->values()->all();

        $project = $request->user()->projects()->create([
            'template_id'   => $template->id,
            'name'          => $validated['name'] ?? "Photobook {$template->name}",
            'status'        => 'draft',
            'data'          => ['pages' => $pages],
            'last_saved_at' => now(),
        ]);

        $project->load('template');

        return response()->json(['data' => new ProjectResource($project)], 201);
    }

    /**
     * GET /api/projects/{id}
     * Full project detail — returns { project, template, media } for editor.
     * Pages are flattened from data.pages so editor can consume directly.
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $project = $request->user()
            ->projects()
            ->with(['template.pages', 'media'])
            ->findOrFail($id);

        return response()->json([
            'project' => [
                'id'            => $project->id,
                'name'          => $project->name,
                'status'        => $project->status,
                'pages'         => $project->data['pages'] ?? [],
                'last_saved_at' => $project->last_saved_at?->toISOString(),
                'created_at'    => $project->created_at->toISOString(),
            ],
            'template' => new \App\Http\Resources\TemplateResource($project->template),
            'media'    => \App\Http\Resources\MediaResource::collection($project->media),
        ]);
    }

    /**
     * PUT /api/projects/{id}
     * Autosave — update project data/name/status.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'name'   => ['sometimes', 'string', 'max:255'],
            'data'   => ['sometimes', 'array'],
            'status' => ['sometimes', 'string', 'in:draft,submitted'],
        ]);

        $project = $request->user()->projects()->findOrFail($id);

        // Prevent re-submission of already-submitted projects
        if ($project->status === 'submitted' && ($validated['status'] ?? null) === 'draft') {
            return response()->json(['message' => 'Cannot revert a submitted project.'], 422);
        }

        $project->update([
            ...$validated,
            'last_saved_at'  => now(),
            'submitted_at'   => ($validated['status'] ?? null) === 'submitted'
                ? now()
                : $project->submitted_at,
        ]);

        return response()->json(['data' => new ProjectResource($project)]);
    }

    /**
     * POST /api/projects/{id}/autosave
     * Lightweight autosave — only updates pages array, never changes status.
     */
    public function autosave(Request $request, string $id): JsonResponse
    {
        $validated = $request->validate([
            'pages' => ['required', 'array'],
        ]);

        $project = $request->user()->projects()->findOrFail($id);

        if (! in_array($project->status, ['draft'])) {
            return response()->json(['message' => 'Cannot autosave a non-draft project.'], 422);
        }

        $project->update([
            'data'          => ['pages' => $validated['pages']],
            'last_saved_at' => now(),
        ]);

        return response()->json([
            'last_saved_at' => $project->last_saved_at->toISOString(),
        ]);
    }

    /**
     * DELETE /api/projects/{id}
     * Soft-delete a draft project.
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $project = $request->user()->projects()->findOrFail($id);

        if ($project->status !== 'draft') {
            return response()->json([
                'message' => 'Chỉ có thể xóa dự án ở trạng thái bản nháp.',
            ], 422);
        }

        $project->delete();

        return response()->json(null, 204);
    }
}
