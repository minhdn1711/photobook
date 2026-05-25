<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS)
    |--------------------------------------------------------------------------
    | Vue 3 SPA (Vite dev server on :5173, Nginx proxy on :80) calls the
    | Laravel API. Allow all necessary origins + headers.
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost',
        'http://localhost:80',
        'http://localhost:5173',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // Use false for token-based auth (Bearer).
    // Set to true only if using cookie-based Sanctum SPA.
    'supports_credentials' => false,
];
