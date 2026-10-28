<?php

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::get('/ping', fn (): JsonResponse => response()->json([
        'status' => 'ok',
        'application' => config('app.name'),
    ]));
});
