<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;

Route::post('/signup', [AuthController::class, 'signup']);   // public → returns token
Route::post('/login',  [AuthController::class, 'login']);    // public → returns token

Route::get('/posts',   [PostController::class, 'index']);    // public
Route::post('/posts',  [PostController::class, 'store'])     // needs Bearer token
->middleware('auth:sanctum');
