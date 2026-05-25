<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MediaResource;
use App\Models\Media;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaController extends Controller
{
    private const MAX_FILE_SIZE_KB = 20 * 1024;   // 20 MB in KB
    private const THUMBNAIL_WIDTH  = 400;

    /**
     * GET /api/projects/{projectId}/media
     * All uploaded photos for a project.
     */
    public function index(Request $request, string $projectId): JsonResponse
    {
        $project = $request->user()->projects()->findOrFail($projectId);

        return response()->json([
            'data' => MediaResource::collection(
                $project->media()->latest()->get()
            ),
        ]);
    }

    /**
     * POST /api/projects/{projectId}/media
     * Upload a single photo (JPEG / PNG / WebP, max 20 MB).
     */
    public function store(Request $request, string $projectId): JsonResponse
    {
        $request->validate([
            'file' => [
                'required',
                'file',
                'mimes:jpg,jpeg,png,webp',
                'max:' . self::MAX_FILE_SIZE_KB,
            ],
        ]);

        $project = $request->user()->projects()->findOrFail($projectId);

        $file      = $request->file('file');
        $extension = $file->guessExtension() ?? 'jpg';

        // Read native image dimensions
        [$width, $height] = @getimagesize($file->getPathname()) ?: [0, 0];

        // Generate storage key: uploads/{userId}/{projectId}/{uuid}.{ext}
        $key = sprintf(
            'uploads/%s/%s/%s.%s',
            $request->user()->id,
            $projectId,
            Str::uuid(),
            $extension
        );

        // Upload to S3 / MinIO (private)
        Storage::disk('s3')->put(
            $key,
            file_get_contents($file->getPathname()),
            'private'
        );

        $media = Media::create([
            'user_id'           => $request->user()->id,
            'project_id'        => $projectId,
            'original_filename' => $file->getClientOriginalName(),
            'storage_key'       => $key,
            'url'               => Storage::disk('s3')->url($key),
            'thumbnail_url'     => null,   // generated async by renderer
            'width'             => $width,
            'height'            => $height,
            'file_size'         => $file->getSize(),
            'mime_type'         => $file->getMimeType(),
            'detected_dpi'      => $this->detectDpi($file->getPathname()),
        ]);

        return response()->json(['data' => new MediaResource($media)], 201);
    }

    /**
     * DELETE /api/projects/{projectId}/media/{id}
     */
    public function destroy(Request $request, string $projectId, string $id): JsonResponse
    {
        $project = $request->user()->projects()->findOrFail($projectId);
        $media   = $project->media()->findOrFail($id);

        // Remove from object storage
        Storage::disk('s3')->delete($media->storage_key);

        $media->delete();

        return response()->json(null, 204);
    }

    // ── Private helpers ───────────────────────────────────────────

    /**
     * Attempt to read DPI from EXIF IFD0. Returns null if unavailable.
     */
    private function detectDpi(string $filePath): ?int
    {
        $exif = @exif_read_data($filePath, 'IFD0', false);

        if (! $exif || empty($exif['XResolution'])) {
            return null;
        }

        $xRes = $exif['XResolution'];

        // EXIF stores fractions as "numerator/denominator" strings
        if (is_string($xRes) && str_contains($xRes, '/')) {
            [$num, $den] = explode('/', $xRes);
            $xRes = (float) $den > 0 ? (float) $num / (float) $den : 72.0;
        }

        // ResolutionUnit: 1=no-unit 2=inch 3=cm
        $unit = (int) ($exif['ResolutionUnit'] ?? 2);

        return $unit === 3
            ? (int) round((float) $xRes * 2.54)   // cm → inch → DPI
            : (int) round((float) $xRes);
    }
}
