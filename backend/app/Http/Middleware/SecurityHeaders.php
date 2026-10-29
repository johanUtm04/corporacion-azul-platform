<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Continue processing the HTTP request.
        $response  = $next($request);

        // Prevent MIME type sniffing.
        $response->headers->set(
            'X-Content-Type-Options',
            'nosniff'
        );

        // Control how referrer information is shared.
        $response->headers->set(
            'Referrer-Policy',
            'strict-origin-when-cross-origin'
        );

        return $response;
    }
}
