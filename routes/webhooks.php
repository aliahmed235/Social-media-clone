<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostWebhookController;

// Public webhook create endpoint (no Sanctum)
Route::post('/posts', [PostWebhookController::class, 'store']);
