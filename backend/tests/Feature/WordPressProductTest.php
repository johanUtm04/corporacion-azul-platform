<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class WordPressProductTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        config()->set(
            'services.wordpress.base_url',
            'http://wordpress.test'
        );

        Http::preventStrayRequests();
    }

    public function test_it_returns_a_normalized_product(): void
    {
        Http::fake([
            'http://wordpress.test/*' => Http::response([
                'id' => 10,
                'slug' => 'cemento-cruz-azul',
                'title' => [
                    'rendered' => 'Cemento Cruz Azul',
                ],
                '_embedded' => [
                    'wp:term' => [
                        [
                            [
                                'name' => 'Cruz Azul',
                                'taxonomy' => 'ca_brand',
                            ],
                        ],
                        [
                            [
                                'name' => 'Cement and Lime',
                                'taxonomy' => 'ca_product_category',
                            ],
                        ],
                    ],
                ],
            ], 200),
        ]);

        $this->getJson('/api/v1/products/10')
            ->assertOk()
            ->assertJsonPath('id', 10)
            ->assertJsonPath('name', 'Cemento Cruz Azul')
            ->assertJsonPath('brand', 'Cruz Azul')
            ->assertJsonPath('categories.0', 'Cement and Lime');

        Http::assertSentCount(1);
    }

    public function test_it_returns_404_for_a_missing_product(): void
    {
        Http::fake([
            'http://wordpress.test/*' => Http::response(
                ['message' => 'Not found'],
                404
            ),
        ]);

        $this->getJson('/api/v1/products/99999')
            ->assertNotFound()
            ->assertJson([
                'message' => 'Product not found.',
            ]);
    }

    public function test_it_handles_wordpress_server_errors(): void
    {
        Http::fake([
            'http://wordpress.test/*' => Http::response([], 500),
        ]);

        $this->getJson('/api/v1/products/10')
            ->assertStatus(502)
            ->assertJson([
                'message' => 'Product information is temporarily unavailable.',
            ]);
    }

    public function test_it_handles_connection_failures(): void
    {
        Http::fake([
            'http://wordpress.test/*' => Http::failedConnection(),
        ]);

        $this->getJson('/api/v1/products/10')
            ->assertStatus(503)
            ->assertJson([
                'message' => 'Product information is temporarily unavailable.',
            ]);
    }



public function test_it_returns_a_normalized_product_collection(): void
{
    Http::fake([
        'http://wordpress.test/*' => Http::response([
            [
                'id' => 10,
                'slug' => 'cemento-cruz-azul',
                'title' => ['rendered' => 'Cemento Cruz Azul'],
                '_embedded' => [
                    'wp:term' => [
                        [
                            ['name' => 'Cruz Azul', 'taxonomy' => 'ca_brand'],
                        ],
                        [
                            ['name' => 'Cement and Lime', 'taxonomy' => 'ca_product_category'],
                        ],
                    ],
                ],
            ],
            [
                'id' => 11,
                'slug' => 'adhesivo-cemix',
                'title' => ['rendered' => 'Adhesivo Cemix'],
                '_embedded' => [
                    'wp:term' => [
                        [
                            ['name' => 'Cemix', 'taxonomy' => 'ca_brand'],
                        ],
                    ],
                ],
            ],
        ], 200, [
            'X-WP-Total' => '2',
            'X-WP-TotalPages' => '1',
        ]),
    ]);

    $this->getJson('/api/v1/products?page=1&per_page=10')
        ->assertOk()
        ->assertJsonCount(2, 'data')
        ->assertJsonPath('data.0.name', 'Cemento Cruz Azul')
        ->assertJsonPath('data.1.brand', 'Cemix')
        ->assertJsonPath('pagination.page', 1)
        ->assertJsonPath('pagination.per_page', 10)
        ->assertJsonPath('pagination.total', 2)
        ->assertJsonPath('pagination.total_pages', 1);

    Http::assertSentCount(1);
}

    public function test_it_returns_an_empty_product_collection(): void
    {
        Http::fake([
            'http://wordpress.test/*' => Http::response([], 200, [
                'X-WP-Total' => '0',
                'X-WP-TotalPages' => '0',
            ]),
        ]);

        $this->getJson('/api/v1/products')
            ->assertOk()
            ->assertExactJson([
                'data' => [],
                'pagination' => [
                    'page' => 1,
                    'per_page' => 10,
                    'total' => 0,
                    'total_pages' => 0,
                ],
            ]);
    }

    public function test_it_handles_collection_server_errors(): void
    {
        Http::fake([
            'http://wordpress.test/*' => Http::response([], 500),
        ]);

        $this->getJson('/api/v1/products')
            ->assertStatus(502)
            ->assertJson([
                'message' => 'Product information is temporarily unavailable.',
            ]);
    }

    public function test_it_handles_collection_connection_failures(): void
    {
        Http::fake([
            'http://wordpress.test/*' => Http::failedConnection(),
        ]);

        $this->getJson('/api/v1/products')
            ->assertStatus(503)
            ->assertJson([
                'message' => 'Product information is temporarily unavailable.',
            ]);
    }


    public function test_it_handles_out_of_range_product_pages(): void
    {
        Http::fake([
            'http://wordpress.test/*' => Http::response([
                'code' => 'rest_post_invalid_page_number',
                'message' => 'The requested page is unavailable.',
                'data' => [
                    'status' => 400,
                ],
            ], 400),
        ]);

        $this->getJson('/api/v1/products?page=2&per_page=10')
            ->assertStatus(422)
            ->assertJsonPath(
                'message',
                'Requested page is outside the available range.'
            );
    }

}
