<?php

use App\Http\Controllers\Api\V1\ProductController;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ContactController;

Route::prefix('v1')->group(function (): void {
    Route::get('/ping', fn (): JsonResponse => response()->json([
        'status' => 'ok',
        'application' => config('app.name'),
    ]));

    Route::get('/products', [ProductController::class, 'index']);

    Route::get('/products/{id}', [ProductController::class, 'show'])
        ->whereNumber('id');

    Route::post('/contact', ContactController::class)
        ->middleware('throttle:public-submissions');
});