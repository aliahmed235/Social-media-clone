<?php
// routes/api.php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;
use App\Models\Post;

Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login',  [AuthController::class, 'login']);

Route::get('/posts',        [PostController::class, 'index']);
Route::get('/posts/{post}', [PostController::class, 'show']);

// Mount webhooks (public) — OUTSIDE Sanctum:
Route::prefix('webhooks')->group(function () {
    require base_path('routes/webhooks.php');
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/posts', [PostController::class, 'store'])
        ->middleware('can:create,' . Post::class);

    Route::match(['put','patch'], '/posts/{post}', [PostController::class, 'update'])
        ->middleware('can:update,post');

    Route::delete('/posts/{post}', [PostController::class, 'destroy'])
        ->middleware('can:delete,post');

    Route::post('/posts/{post}/restore', [PostController::class, 'restore'])
        ->withTrashed()
        ->middleware('can:update,post');

    Route::post('/logout', [AuthController::class, 'logout']);
});
