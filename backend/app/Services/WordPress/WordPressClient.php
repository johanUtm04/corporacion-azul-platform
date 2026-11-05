<?php

namespace App\Services\WordPress;

use Illuminate\Support\Facades\Http;
use RuntimeException;
use UnexpectedValueException;

class WordPressClient
{
    // Retrieve a single product
    public function getProduct(int $id): array
    {
        $baseUrl = $this->getBaseUrl();

        $response = Http::acceptJson()
            ->connectTimeout(3)
            ->timeout(10)
            ->get(
                "{$baseUrl}/wp-json/wp/v2/ca_product/{$id}",
                ['_embed' => '1']
            )
            ->throw();

        $product = $response->json();

        if (!is_array($product) || array_is_list($product)) {
            throw new UnexpectedValueException(
                'Invalid WordPress product response.'
            );
        }

        return $product;
    }

    // Retrieve a collection of products
    public function getProducts(): array
    {
        $baseUrl = $this->getBaseUrl();

        $response = Http::acceptJson()
            ->connectTimeout(3)
            ->timeout(10)
            ->get(
                "{$baseUrl}/wp-json/wp/v2/ca_product",
                [
                    '_embed' => '1',
                    'page' => 1,
                    'per_page' => 10,
                ]
            )
            ->throw();

        $products = $response->json();

        if (!is_array($products) || !array_is_list($products)) {
            throw new UnexpectedValueException(
                'Invalid WordPress product collection.'
            );
        }

        return $products;
    }

    // Shared WordPress configuration
    private function getBaseUrl(): string
    {
        $baseUrl = rtrim(
            (string) config('services.wordpress.base_url'),
            '/'
        );

        if ($baseUrl === '') {
            throw new RuntimeException(
                'WordPress base URL is not configured.'
            );
        }

        return $baseUrl;
    }


    public function getPaginatedProducts(
        int $page = 1,
        int $perPage = 10
    ): array {
        if ($page < 1 || $perPage < 1 || $perPage > 100) {
            throw new \InvalidArgumentException(
                'Invalid pagination parameters.'
            );
        }

        $baseUrl = $this->getBaseUrl();

        $response = Http::acceptJson()
            ->connectTimeout(3)
            ->timeout(10)
            ->get(
                "{$baseUrl}/wp-json/wp/v2/ca_product",
                [
                    '_embed' => '1',
                    'page' => $page,
                    'per_page' => $perPage,
                ]
            )
            ->throw();

        $products = $response->json();

        if (!is_array($products) || !array_is_list($products)) {
            throw new UnexpectedValueException(
                'Invalid WordPress product collection.'
            );
        }

        $total = $response->header('X-WP-Total');
        $totalPages = $response->header('X-WP-TotalPages');

        if (!ctype_digit((string) $total) ||
            !ctype_digit((string) $totalPages)) {
            throw new UnexpectedValueException(
                'Invalid WordPress pagination headers.'
            );
        }

        return [
            'products' => $products,
            'pagination' => [
                'page' => $page,
                'per_page' => $perPage,
                'total' => (int) $total,
                'total_pages' => (int) $totalPages,
            ],
        ];
    }

}