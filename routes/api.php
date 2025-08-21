<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;
use App\Models\Post;

Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login',  [AuthController::class, 'login']);

Route::get('/posts',        [PostController::class, 'index']);
Route::get('/posts/{post}', [PostController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    // ✅ CREATE — restore the missing POST route
    Route::post('/posts', [PostController::class, 'store'])
        ->middleware('can:create,' . Post::class);

    Route::match(['put','patch'], '/posts/{post}', [PostController::class, 'update'])
        ->middleware('can:update,post');

    Route::delete('/posts/{post}', [PostController::class, 'destroy'])
        ->middleware('can:delete,post');

    Route::post('/posts/{post}/restore', [PostController::class, 'restore'])
        ->middleware('can:update,post');
});
