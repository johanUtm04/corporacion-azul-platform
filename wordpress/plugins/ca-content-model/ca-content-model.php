<?php
/**
 * Plugin Name: CAZ Content Model
 * Description: Custom content structure for Corporación Azul.
 * Version: 0.1.0
 */

if (!defined('ABSPATH')) {
    exit;
}

function caz_register_products() {
    register_post_type('ca_product', [
    'taxonomies' => ['ca_brand', 'ca_product_category'],
        'labels' => [
            'name' => 'Products',
            'singular_name' => 'Product',
            'add_new_item' => 'Add New Product',
        ],
        'public' => true,
        'show_in_rest' => true,
        'menu_icon' => 'dashicons-products',
        'supports' => [
            'title',
            'editor',
            'excerpt',
            'thumbnail',
        ],
    ]);
}

function caz_register_product_taxonomies() {

    register_taxonomy('ca_brand', ['ca_product'], [
        'label' => 'Brands',
        'public' => true,
        'hierarchical' => true,
        'show_in_rest' => true,
        'show_admin_column' => true,
    ]);

    register_taxonomy('ca_product_category', ['ca_product'], [
        'label' => 'Product Categories',
        'public' => true,
        'hierarchical' => true,
        'show_in_rest' => true,
        'show_admin_column' => true,
    ]);
}

add_action('init', 'caz_register_products', 10);
add_action('init', 'caz_register_product_taxonomies', 11);
