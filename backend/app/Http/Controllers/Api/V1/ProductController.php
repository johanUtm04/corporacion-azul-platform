<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\WordPress\WordPressClient;
use App\Services\WordPress\ProductNormalizer;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use UnexpectedValueException;

class ProductController extends Controller
{
    /**
     * Retrieve a paginated collection of products.
     */
    public function index(
        Request $request,
        WordPressClient $client,
        ProductNormalizer $normalizer
    ): JsonResponse {
        $validated = $request->validate([
            'page' => ['sometimes', 'integer', 'min:1'],
            'per_page' => ['sometimes', 'integer', 'between:1,100'],
            'brand' => ['sometimes', 'integer', 'min:1'],
            'category' => ['sometimes', 'integer', 'min:1'],
            'search' => ['sometimes', 'string', 'max:100'],
        ]);
        $page = (int) ($validated['page'] ?? 1);
        $perPage = (int) ($validated['per_page'] ?? 10);

        $filters = [
            'brand' => $validated['brand'] ?? null,
            'category' => $validated['category'] ?? null,
            'search' => $validated['search'] ?? null,
        ];
        try {
            $result = $client->getPaginatedProducts(
                $page,
                $perPage,
                $filters
            );

            $products = array_map(
                fn (array $product): array =>
                    $normalizer->normalize($product),
                $result['products']
            );

            return response()->json([
                'data' => $products,
                'pagination' => $result['pagination'],
            ]);

        } catch (RequestException $exception) {

            // WordPress rejected an out-of-range page.
            if (
                $exception->response->status() === 400 &&
                $exception->response->json('code') ===
                    'rest_post_invalid_page_number'
            ) {
                return response()->json([
                    'message' =>
                        'Requested page is outside the available range.',
                ], 422);
            }

            report($exception);

            return response()->json([
                'message' =>
                    'Product information is temporarily unavailable.',
            ], 502);

        } catch (ConnectionException $exception) {

            report($exception);

            return response()->json([
                'message' =>
                    'Product information is temporarily unavailable.',
            ], 503);

        } catch (UnexpectedValueException $exception) {

            report($exception);

            return response()->json([
                'message' =>
                    'Product information is temporarily unavailable.',
            ], 502);
        }
    }

    /**
     * Retrieve a single product by its WordPress ID.
     */
    public function show(
        WordPressClient $client,
        ProductNormalizer $normalizer,
        int $id
    ): JsonResponse {
        try {
            $product = $client->getProduct($id);

            return response()->json(
                $normalizer->normalize($product)
            );

        } catch (RequestException $exception) {

            // The requested product does not exist.
            if ($exception->response->status() === 404) {
                return response()->json([
                    'message' => 'Product not found.',
                ], 404);
            }

            report($exception);

            return response()->json([
                'message' =>
                    'Product information is temporarily unavailable.',
            ], 502);

        } catch (ConnectionException $exception) {

            report($exception);

            return response()->json([
                'message' =>
                    'Product information is temporarily unavailable.',
            ], 503);

        } catch (UnexpectedValueException $exception) {

            report($exception);

            return response()->json([
                'message' => 'Invalid product data received.',
            ], 502);
        }
    }

    /**
     * Retrieve available product brands and categories.
     */
    public function filters(WordPressClient $client): JsonResponse
    {
        try {
            return response()->json(
                $client->getProductFilters()
            );

        } catch (RequestException $exception) {
            report($exception);

            return response()->json([
                'message' => 'Product filters are temporarily unavailable.',
            ], 502);

        } catch (ConnectionException $exception) {
            report($exception);

            return response()->json([
                'message' => 'Product filters are temporarily unavailable.',
            ], 503);

        } catch (UnexpectedValueException $exception) {
            report($exception);

            return response()->json([
                'message' => 'Invalid product filter data received.',
            ], 502);
        }
    }
}
