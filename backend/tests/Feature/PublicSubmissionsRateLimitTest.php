<?php

namespace Tests\Feature;
use Illuminate\Support\Facades\Route;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class PublicSubmissionsRateLimitTest extends TestCase
{
    public function test_public_submissions_are_rate_limited(): void
    {
        // Create a temporary route for this test only.
        Route::middleware(['api', 'throttle:public-submissions'])
            ->post('/api/__rate-limit-test', function () {
                return response()->json(['status' => 'ok']);
            });

        // The first five requests should succeed.
        for ($i = 1; $i <= 5; $i++) {
            $this->postJson('/api/__rate-limit-test')
                ->assertOk();
        }

        // The sixth request should be blocked.
        $this->postJson('/api/__rate-limit-test')
            ->assertStatus(429)
            ->assertHeader('Retry-After');
    }

    
    public function test_different_ips_have_independent_limits(): void
    {
        Route::middleware(['api', 'throttle:public-submissions'])
            ->post('/api/__rate-limit-ip-test', function () {
                return response()->json(['status' => 'ok']);
            });

        // Client A uses all five requests.
        $this->withServerVariables(['REMOTE_ADDR' => '192.0.2.10']);

        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/__rate-limit-ip-test')
                ->assertOk();
        }

        // Client B has a separate allowance.
        $this->withServerVariables(['REMOTE_ADDR' => '198.51.100.20']);

        $this->postJson('/api/__rate-limit-ip-test')
            ->assertOk();

        // Client A is still blocked.
        $this->withServerVariables(['REMOTE_ADDR' => '192.0.2.10']);

        $this->postJson('/api/__rate-limit-ip-test')
            ->assertStatus(429);
    }

}