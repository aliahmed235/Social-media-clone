<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Webhook\PostWebhookController;

Route::post('/posts', [PostWebhookController::class, 'store'])
    ->middleware('verify.webhook');
