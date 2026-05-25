<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
| The frontend (Vue 3 SPA) is served by Nginx → Vite dev server.
| This Laravel app is purely an API; no web views are rendered here.
*/

Route::get('/', fn() => response()->json([
    'service' => 'Photobook API',
    'version' => '1.0.0',
    'docs'    => '/api/up',
]));
