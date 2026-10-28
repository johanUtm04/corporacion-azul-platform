<?php

use App\Support\Environment;

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | The CORS policy of the API is driven entirely by environment variables
    | so every environment (local, staging, production) declares exactly which
    | front-end origins are allowed to call the backend.
    |
    | The defaults are intentionally strict: the React application is the only
    | allowed client and no wildcard origin is ever accepted while cookies
    | (credentials) are enabled. An unsafe configuration is rejected at boot
    | time by App\Providers\AppServiceProvider.
    |
    | @see https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    /*
    |--------------------------------------------------------------------------
    | CORS Paths
    |--------------------------------------------------------------------------
    |
    | The route patterns the policy applies to. Requests outside of these paths
    | never receive any CORS response header.
    |
    */

    'paths' => Environment::csv('CORS_PATHS', ['api/*', 'sanctum/csrf-cookie']),

    /*
    |--------------------------------------------------------------------------
    | Allowed Methods
    |--------------------------------------------------------------------------
    |
    | The HTTP verbs the front-end is allowed to use. Enumerated explicitly
    | instead of using the "*" wildcard.
    |
    */

    'allowed_methods' => Environment::csv('CORS_ALLOWED_METHODS', [
        'GET',
        'HEAD',
        'POST',
        'PUT',
        'PATCH',
        'DELETE',
        'OPTIONS',
    ]),

    /*
    |--------------------------------------------------------------------------
    | Allowed Origins
    |--------------------------------------------------------------------------
    |
    | The exact origins (scheme + host + port) allowed to call the API. The
    | value is a comma separated list, for example:
    |
    |   CORS_ALLOWED_ORIGINS=http://localhost:5173,https://app.corporacionazul.com
    |
    | Wildcards are not allowed here: use CORS_ALLOWED_ORIGINS_PATTERNS for the
    | rare case where a deliberate pattern is required.
    |
    | The default only trusts the local Vite dev server, and nothing at all
    | outside of the "local" environment.
    |
    */

    'allowed_origins' => Environment::csv('CORS_ALLOWED_ORIGINS', env('APP_ENV', 'production') === 'local'
        ? ['http://localhost:5173', 'http://127.0.0.1:5173']
        : []),

    /*
    |--------------------------------------------------------------------------
    | Allowed Origin Patterns
    |--------------------------------------------------------------------------
    |
    | Regular expressions matched against the request origin. Leave empty to
    | trust a fixed list of origins only, which is the recommended setup.
    |
    */

    'allowed_origins_patterns' => Environment::csv('CORS_ALLOWED_ORIGINS_PATTERNS', []),

    /*
    |--------------------------------------------------------------------------
    | Allowed Headers
    |--------------------------------------------------------------------------
    |
    | The request headers the front-end is allowed to send. Keep this list as
    | small as possible: every header added here widens the attack surface.
    |
    */

    'allowed_headers' => Environment::csv('CORS_ALLOWED_HEADERS', [
        'Accept',
        'Authorization',
        'Content-Type',
        'X-Requested-With',
        'X-XSRF-TOKEN',
    ]),

    /*
    |--------------------------------------------------------------------------
    | Exposed Headers
    |--------------------------------------------------------------------------
    |
    | The response headers the browser is allowed to expose to JavaScript.
    |
    */

    'exposed_headers' => Environment::csv('CORS_EXPOSED_HEADERS', []),

    /*
    |--------------------------------------------------------------------------
    | Maximum Age
    |--------------------------------------------------------------------------
    |
    | How long (in seconds) the browser may cache the preflight response. A
    | value of 0 disables caching, which is the safest option.
    |
    */

    'max_age' => Environment::integer('CORS_MAX_AGE', 0),

    /*
    |--------------------------------------------------------------------------
    | Supports Credentials
    |--------------------------------------------------------------------------
    |
    | Whether cookies and other credentials may be sent by the front-end.
    | Required for cookie based sessions (Sanctum SPA authentication), which
    | forces the browser to refuse any wildcard origin.
    |
    */

    'supports_credentials' => Environment::boolean('CORS_SUPPORTS_CREDENTIALS', true),

];
