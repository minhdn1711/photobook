<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MediaController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\TemplateController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| All routes here receive the "api" middleware group automatically.
| Authentication via Laravel Sanctum token (Authorization: Bearer <token>).
|
*/

// ── Public ────────────────────────────────────────────────────────────────

Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login',    [AuthController::class, 'login']);
});

// Templates are publicly browsable (no auth required)
Route::get('templates',        [TemplateController::class, 'index']);
Route::get('templates/{slug}', [TemplateController::class, 'show']);

// ── Authenticated ─────────────────────────────────────────────────────────

Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::get('auth/me',      [AuthController::class, 'me']);

    // Projects CRUD
    Route::apiResource('projects', ProjectController::class);

    // Media nested under projects
    Route::prefix('projects/{projectId}/media')->group(function () {
        Route::get('/',       [MediaController::class, 'index']);
        Route::post('/',      [MediaController::class, 'store']);
        Route::delete('/{id}', [MediaController::class, 'destroy']);
    });
});
