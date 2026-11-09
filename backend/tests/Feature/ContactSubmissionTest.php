<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class ContactSubmissionTest extends TestCase
{
    public function test_valid_contact_submission(): void
    {
        config()->set('services.wordpress_contact', [
            'url' => 'https://wordpress.test/api/contact',
            'token' => 'fake-test-token',
        ]);

        Http::preventStrayRequests();

        Http::fake([
            'https://wordpress.test/api/contact' => Http::response([
                'success' => true,
                'entry_id' => 123,
            ], 201),
        ]);

        $response = $this->postJson('/api/v1/contact', [
            'first_name' => 'Laravel',
            'last_name' => 'Test',
            'email' => 'test@example.com',
            'phone' => '4431234567',
            'state' => 'Michoacán',
            'subject' => 'Solicitar cotización',
            'message' => 'Automated contact test.',
            'privacy_accepted' => true,
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true);

        Http::assertSentCount(1);
    }

    public function test_invalid_email_is_rejected(): void
    {
        Http::fake();

        $response = $this->postJson('/api/v1/contact', [
            'first_name' => 'Laravel',
            'last_name' => 'Test',
            'email' => 'invalid-email',
            'phone' => '4431234567',
            'state' => 'Michoacán',
            'subject' => 'Solicitar cotización',
            'message' => 'Testing invalid email.',
            'privacy_accepted' => true,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);

        Http::assertNothingSent();
    }

    public function test_wordpress_server_error_returns_502(): void
    {
        config()->set('services.wordpress_contact', [
            'url' => 'https://wordpress.test/api/contact',
            'token' => 'fake-test-token',
        ]);

        Http::preventStrayRequests();

        Http::fake([
            'https://wordpress.test/api/contact' =>
                Http::response(['message' => 'Internal error'], 500),
        ]);

        $response = $this->postJson('/api/v1/contact', [
            'first_name' => 'Laravel',
            'last_name' => 'Test',
            'email' => 'test@example.com',
            'phone' => '4431234567',
            'state' => 'Michoacán',
            'subject' => 'Solicitar cotización',
            'message' => 'Testing WordPress failure.',
            'privacy_accepted' => true,
        ]);

        $response->assertStatus(502)
            ->assertJsonPath(
                'message',
                'Contact service is temporarily unavailable.'
            );

        Http::assertSentCount(1);
    }

    public function test_wordpress_connection_failure_returns_503(): void
    {
        config()->set('services.wordpress_contact', [
            'url' => 'https://wordpress.test/api/contact',
            'token' => 'fake-test-token',
        ]);

        Http::preventStrayRequests();

        Http::fake(function () {
            throw new \Illuminate\Http\Client\ConnectionException(
                'Simulated connection failure.'
            );
        });

        $response = $this->postJson('/api/v1/contact', [
            'first_name' => 'Laravel',
            'last_name' => 'Test',
            'email' => 'test@example.com',
            'phone' => '4431234567',
            'state' => 'Michoacán',
            'subject' => 'Solicitar cotización',
            'message' => 'Testing connection failure.',
            'privacy_accepted' => true,
        ]);

        $response->assertStatus(503)
            ->assertJsonPath(
                'message',
                'Contact service is temporarily unavailable.'
            );
    }

    public function test_invalid_subject_is_rejected(): void
    {
        Http::fake();

        $response = $this->postJson('/api/v1/contact', [
            'first_name' => 'Laravel',
            'last_name' => 'Test',
            'email' => 'test@example.com',
            'phone' => '4431234567',
            'state' => 'Michoacán',
            'subject' => 'Unknown subject',
            'message' => 'Testing subject validation.',
            'privacy_accepted' => true,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['subject']);

        Http::assertNothingSent();
    }

    public function test_invalid_state_is_rejected(): void
    {
        Http::fake();

        $response = $this->postJson('/api/v1/contact', [
            'first_name' => 'Laravel',
            'last_name' => 'Test',
            'email' => 'test@example.com',
            'phone' => '4431234567',
            'state' => 'California',
            'subject' => 'Solicitar cotización',
            'message' => 'Testing invalid state.',
            'privacy_accepted' => true,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['state']);

        Http::assertNothingSent();
    }

    public function test_privacy_consent_is_required(): void
    {
        Http::fake();

        $response = $this->postJson('/api/v1/contact', [
            'first_name' => 'Laravel',
            'last_name' => 'Test',
            'email' => 'test@example.com',
            'phone' => '4431234567',
            'state' => 'Michoacán',
            'subject' => 'Solicitar cotización',
            'message' => 'Testing privacy consent.',
            'privacy_accepted' => false,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['privacy_accepted']);

        Http::assertNothingSent();
    }
}