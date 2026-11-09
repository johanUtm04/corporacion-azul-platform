<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactRequest;
use App\Services\WordPressContactClient;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    public function __invoke(
        StoreContactRequest $request,
        WordPressContactClient $client
    ): JsonResponse {
        try {
            $result = $client->submit($request->validated());

            if (($result['success'] ?? false) !== true) {
                return response()->json([
                    'message' => 'Contact submission was not confirmed.',
                ], 502);
            }

            return response()->json([
                'success' => true,
                'message' => 'Your message has been received.',
            ], 201);

        } catch (RequestException $e) {
            Log::warning('WordPress contact request failed', [
                'status' => $e->response->status(),
            ]);

            return response()->json([
                'message' => 'Contact service is temporarily unavailable.',
            ], 502);

        } catch (ConnectionException $e) {
            Log::warning('WordPress contact service unreachable.');

            return response()->json([
                'message' => 'Contact service is temporarily unavailable.',
            ], 503);
        }
    }
}
