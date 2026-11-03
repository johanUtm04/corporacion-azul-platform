<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Illuminate\Support\Facades\Route;

class SecurityHeadersTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    // public function test_example(): void
    // {
    //     $response = $this->get('/');

    //     $response->assertStatus(200);
    // }
 
    public function test_successful_api_response_has_security_headers(): void
    {
        $this->getJson('/api/v1/ping')
            ->assertOk()
            ->assertHeader('X-Content-Type-Options', 'nosniff')
            ->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    }

    public function test_404_response_has_security_headers(): void
    {
        $this->getJson('/api/v1/nonexistent')
            ->assertNotFound()
            ->assertHeader('X-Content-Type-Options', 'nosniff')
            ->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    }

    public function test_500_response_has_security_headers(): void
    {
        // This route exists only during the test.
        Route::get('/api/__security-test-500', fn () => abort(500));

        $this->getJson('/api/__security-test-500')
            ->assertInternalServerError()
            ->assertHeader('X-Content-Type-Options', 'nosniff')
            ->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    }

    public function test_local_http_does_not_send_hsts(): void
    {
        app()->instance('env', 'local');

        $this->getJson('http://localhost/api/v1/ping')
            ->assertOk()
            ->assertHeaderMissing('Strict-Transport-Security');
    }

    public function test_production_http_does_not_send_hsts(): void
    {
        app()->instance('env', 'production');

        $this->getJson('http://localhost/api/v1/ping')
            ->assertOk()
            ->assertHeaderMissing('Strict-Transport-Security');
    }

    public function test_production_https_sends_hsts(): void
    {
        app()->instance('env', 'production');

        $this->getJson('https://localhost/api/v1/ping')
            ->assertOk()
            ->assertHeader('Strict-Transport-Security', 'max-age=300');
    }
}
