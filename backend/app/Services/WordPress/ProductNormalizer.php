<?php

namespace App\Services\WordPress;

class ProductNormalizer
{
    public function normalize(array $product): array
    {
        $brand = null;
        $categories = [];

        foreach ($product['_embedded']['wp:term'] ?? [] as $terms) {
            foreach ($terms as $term) {
                if (($term['taxonomy'] ?? '') === 'ca_brand') {
                    $brand = $term['name'];
                }

                if (($term['taxonomy'] ?? '') === 'ca_product_category') {
                    $categories[] = $term['name'];
                }
            }
        }

        return [
            'id' => $product['id'],
            'name' => $product['title']['rendered'],
            'slug' => $product['slug'],
            'brand' => $brand,
            'categories' => $categories,
        ];
    }
}
