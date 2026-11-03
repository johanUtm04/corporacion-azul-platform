<?php

namespace App\Providers;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\ServiceProvider;
use RuntimeException;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->guardCorsConfiguration();
    }

    /**
     * Refuse to boot with a CORS policy that would expose the API to any origin.
     *
     * A wildcard origin combined with credentials would let any website read
     * authenticated responses, so the application fails fast instead.
     *
     * @throws RuntimeException
     */
    private function guardCorsConfiguration(): void
    {
        $cors = config('cors') ?? [];

        /** @var array<int, string> $origins */
        $origins = $cors['allowed_origins'] ?? [];

        /** @var array<int, string> $patterns */
        $patterns = $cors['allowed_origins_patterns'] ?? [];

        $supportsCredentials = (bool) ($cors['supports_credentials'] ?? false);

        if ($supportsCredentials && (in_array('*', $origins, true) || in_array('*', $patterns, true))) {
            throw new RuntimeException(
                'Unsafe CORS configuration: a wildcard origin ("*") cannot be used while CORS_SUPPORTS_CREDENTIALS is enabled. '
                .'List the explicit front-end origins in CORS_ALLOWED_ORIGINS instead.'
            );
        }

        if ($origins === [] && $patterns === []) {
            Log::error(
                'CORS misconfiguration: no origin is allowed, so every cross-origin request is rejected. '
                .'Set CORS_ALLOWED_ORIGINS to the origins of the front-end application.'
            );
        }
    }
}
