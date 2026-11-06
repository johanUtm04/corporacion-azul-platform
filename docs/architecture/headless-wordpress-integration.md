# Headless WordPress Integration

**Project:** Corporación Azul Platform
**Status:** Backend integration implemented and tested

## Objective

Laravel retrieves product information from WordPress, normalizes the response, and exposes it through an API that React can consume.

## Architecture

WordPress → Laravel API → React

- **WordPress:** Manages products, brands, and product categories.
- **Laravel:** Retrieves and normalizes product data.
- **React:** Will consume the Laravel API to display products.

## Local setup

1. Create a local WordPress installation using Laragon.
2. Copy `wordpress/plugins/ca-content-model/` into the WordPress installation's `wp-content/plugins/` directory.
3. Activate **CAZ Content Model** in WordPress.
4. Create a brand, product category, and sample product.
5. Configure `WORDPRESS_BASE_URL` in `backend/.env` with the WordPress installation URL.
6. Run `php artisan config:clear` from `backend/`.

The current plugin registers `ca_product`, `ca_brand`, and `ca_product_category`.

## Laravel API

| Endpoint | Purpose |
|---|---|
| `GET /api/v1/products` | Paginated product collection |
| `GET /api/v1/products/{id}` | Individual product |

The collection endpoint accepts `page` and `per_page` query parameters.


### Product Catalog Filtering

The product collection endpoint supports optional query parameters:

| Parameter | Description |
|---|---|
| `brand` | Filter by WordPress brand term ID |
| `category` | Filter by WordPress category term ID |
| `search` | Search product content |
| `page` | Requested page (default: 1) |
| `per_page` | Products per page (default: 10, maximum: 100) |

Examples:

GET /api/v1/products?brand=2
GET /api/v1/products?category=3
GET /api/v1/products?search=cemento
GET /api/v1/products?brand=2&category=3&page=1

Laravel translates the filters into WordPress REST API parameters.

Responses preserve the normalized `data` array and `pagination` metadata.

Invalid filter values return HTTP 422.
Valid filters with no matches return HTTP 200 with an empty collection.

Validation: 27 Laravel tests passed, 97 assertions.

### Components

- `WordPressClient.php` — Retrieves WordPress data.
- `ProductNormalizer.php` — Transforms WordPress responses.
- `ProductController.php` — Returns normalized JSON and handles errors.

## Error handling

- `404` — Product not found.
- `422` — Invalid or out-of-range pagination.
- `502` — Unexpected WordPress response or upstream error.
- `503` — WordPress connection failure.

## Validation

Run `php artisan test` from the Laravel backend directory.

**Last verified result:** 24 tests passed, 85 assertions.

## Current limitations

- React integration is not implemented yet.
- The WordPress content model currently supports basic product information and taxonomies.
- Additional fields from the V1/V2 data model blueprint remain pending.
- The local WordPress database and uploaded content are not included in this repository.
- Production deployment and caching have not been configured.

## References

See `docs/architecture/data-model/` for the WordPress V1 / Laravel V2 data model blueprint.