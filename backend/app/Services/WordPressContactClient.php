<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use RuntimeException;

class WordPressContactClient
{
    public function submit(array $data): array
    {
        $url = config('services.wordpress_contact.url');
        $token = config('services.wordpress_contact.token');

        if (empty($url) || empty($token)) {
            throw new RuntimeException(
                'WordPress Contact Bridge is not configured.'
            );
        }

        $response = Http::acceptJson()
            ->withToken($token)
            ->timeout(10)
            ->post($url, $data);

        $response->throw();

        return $response->json() ?? [];
    }
}
