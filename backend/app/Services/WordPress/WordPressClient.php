<?php

namespace App\Services\WordPress;

use Illuminate\Support\Facades\Http;
use InvalidArgumentException;
use RuntimeException;
use UnexpectedValueException;

class WordPressClient
{
    /**
     * Retrieve a single product from WordPress.
     */
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

    /**
     * Retrieve the first 10 products from WordPress.
     */
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

    /**
     * Retrieve paginated products with optional filters.
     */
    public function getPaginatedProducts(
        int $page = 1,
        int $perPage = 10,
        array $filters = []
    ): array {
        if ($page < 1 || $perPage < 1 || $perPage > 100) {
            throw new InvalidArgumentException(
                'Invalid pagination parameters.'
            );
        }

        $baseUrl = $this->getBaseUrl();

        $query = [
            '_embed' => '1',
            'page' => $page,
            'per_page' => $perPage,
        ];

        // Filter by brand.
        if (isset($filters['brand'])) {
            $query['ca_brand'] = (int) $filters['brand'];
        }

        // Filter by product category.
        if (isset($filters['category'])) {
            $query['ca_product_category'] = (int) $filters['category'];
        }

        // Search products by keyword.
        if (isset($filters['search'])) {
            $search = trim((string) $filters['search']);

            if ($search !== '') {
                $query['search'] = $search;
            }
        }

        $response = Http::acceptJson()
            ->connectTimeout(3)
            ->timeout(10)
            ->get(
                "{$baseUrl}/wp-json/wp/v2/ca_product",
                $query
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

        if (
            !ctype_digit((string) $total) ||
            !ctype_digit((string) $totalPages)
        ) {
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

    /**
     * Retrieve the configured WordPress base URL.
     */
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
}
