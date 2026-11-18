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

    register_term_meta('ca_brand', 'ca_brand_logo_id', [
        'type' => 'integer',
        'single' => true,
        'sanitize_callback' => 'absint',
        'show_in_rest' => true,
    ]);

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


function caz_brand_logo_edit_field($term) {
    $logo_id = (int) get_term_meta(
        $term->term_id,
        'ca_brand_logo_id',
        true
    );

    $logo_url = $logo_id
        ? wp_get_attachment_image_url($logo_id, 'thumbnail')
        : '';

    ?>
    <tr class="form-field">
        <th scope="row">
            <label for="ca_brand_logo_id">
                Logotipo de la marca
            </label>
        </th>

        <td>
            <input
                type="hidden"
                id="ca_brand_logo_id"
                name="ca_brand_logo_id"
                value="<?php echo esc_attr($logo_id); ?>"
            >

            <div id="ca-brand-logo-preview">
                <?php if ($logo_url) : ?>
                    <img
                        src="<?php echo esc_url($logo_url); ?>"
                        alt=""
                        style="max-width:120px;height:auto;"
                    >
                <?php endif; ?>
            </div>

            <button
                type="button"
                class="button"
                id="ca-brand-logo-select"
            >
                Seleccionar logotipo
            </button>

            <?php wp_nonce_field(
                'caz_save_brand_logo',
                'caz_brand_logo_nonce'
            ); ?>
        </td>
    </tr>
    <?php
}

add_action(
    'ca_brand_edit_form_fields',
    'caz_brand_logo_edit_field'
);


function caz_brand_logo_admin_assets($hook) {
    if ($hook !== 'term.php') {
        return;
    }

    $screen = get_current_screen();

    if (!$screen || $screen->taxonomy !== 'ca_brand') {
        return;
    }

    wp_enqueue_media();

    wp_enqueue_script(
        'caz-brand-logo-admin',
        plugin_dir_url(__FILE__) . 'assets/brand-logo-admin.js',
        ['media-views'],
        '1.0.0',
        true
    );
}

add_action(
    'admin_enqueue_scripts',
    'caz_brand_logo_admin_assets'
);

function caz_save_brand_logo($term_id) {
    if (
        !isset($_POST['caz_brand_logo_nonce']) ||
        !isset($_POST['ca_brand_logo_id'])
    ) {
        return;
    }

    $nonce = sanitize_text_field(
        wp_unslash($_POST['caz_brand_logo_nonce'])
    );

    if (!wp_verify_nonce($nonce, 'caz_save_brand_logo')) {
        return;
    }

    if (!current_user_can('edit_term', $term_id)) {
        return;
    }

    $logo_id = absint(
        wp_unslash($_POST['ca_brand_logo_id'])
    );

    if ($logo_id && !wp_attachment_is_image($logo_id)) {
        return;
    }

    if ($logo_id) {
        update_term_meta(
            $term_id,
            'ca_brand_logo_id',
            $logo_id
        );
    } else {
        delete_term_meta(
            $term_id,
            'ca_brand_logo_id'
        );
    }
}

add_action(
    'edited_ca_brand',
    'caz_save_brand_logo'
);


function caz_register_brand_logo_rest_field() {
    register_rest_field('ca_brand', 'logo_url', [
        'get_callback' => function ($term) {
            $logo_id = (int) get_term_meta(
                $term['id'],
                'ca_brand_logo_id',
                true
            );

            if (!$logo_id) {
                return null;
            }

            $url = wp_get_attachment_image_url(
                $logo_id,
                'full'
            );

            return $url ?: null;
        },
        'schema' => [
            'type' => ['string', 'null'],
            'format' => 'uri',
            'context' => ['view', 'edit'],
            'readonly' => true,
        ],
    ]);
}

add_action(
    'rest_api_init',
    'caz_register_brand_logo_rest_field'
);