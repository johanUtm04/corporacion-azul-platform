<?php

namespace Tests\Feature;

use App\Providers\AppServiceProvider;
use RuntimeException;
use Tests\TestCase;

class CorsTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        config()->set('cors.paths', ['api/*']);
        config()->set('cors.allowed_origins', ['http://localhost:5173', 'http://127.0.0.1:5173']);
        config()->set('cors.allowed_origins_patterns', []);
        config()->set('cors.supports_credentials', true);
    }

    public function test_request_from_an_allowed_origin_receives_cors_headers(): void
    {
        $response = $this->getJson('/api/v1/ping', ['Origin' => 'http://localhost:5173']);

        $response->assertOk()
            ->assertHeader('Access-Control-Allow-Origin', 'http://localhost:5173')
            ->assertHeader('Access-Control-Allow-Credentials', 'true');
    }

    public function test_request_from_an_unknown_origin_receives_no_cors_headers(): void
    {
        $response = $this->getJson('/api/v1/ping', ['Origin' => 'https://attacker.example.com']);

        $response->assertOk()
            ->assertHeaderMissing('Access-Control-Allow-Origin')
            ->assertHeaderMissing('Access-Control-Allow-Credentials');
    }

    public function test_preflight_request_from_an_allowed_origin_is_accepted(): void
    {
        $response = $this->call('OPTIONS', '/api/v1/ping', [], [], [], [
            'HTTP_ORIGIN' => 'http://localhost:5173',
            'HTTP_ACCESS_CONTROL_REQUEST_METHOD' => 'POST',
            'HTTP_ACCESS_CONTROL_REQUEST_HEADERS' => 'content-type',
        ]);

        $response->assertStatus(204)
            ->assertHeader('Access-Control-Allow-Origin', 'http://localhost:5173')
            ->assertHeader('Access-Control-Allow-Credentials', 'true')
            ->assertHeader('Access-Control-Allow-Methods', 'GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS');
    }

    public function test_preflight_request_from_an_unknown_origin_is_rejected(): void
    {
        $response = $this->call('OPTIONS', '/api/v1/ping', [], [], [], [
            'HTTP_ORIGIN' => 'https://attacker.example.com',
            'HTTP_ACCESS_CONTROL_REQUEST_METHOD' => 'POST',
        ]);

        $response->assertStatus(204)->assertHeaderMissing('Access-Control-Allow-Origin');
    }

    public function test_a_wildcard_origin_is_rejected_when_credentials_are_enabled(): void
    {
        config()->set('cors.allowed_origins', ['*']);

        $this->expectException(RuntimeException::class);

        (new AppServiceProvider($this->app))->boot();
    }
}
