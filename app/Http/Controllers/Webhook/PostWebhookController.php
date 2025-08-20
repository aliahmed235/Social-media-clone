<?php
namespace App\Http\Controllers\Webhook;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\DTO\PostInputDTO;
use App\Services\PostService;

class PostWebhookController extends Controller
{
    protected PostService $service;

    public function __construct(PostService $service)
    {
        $this->service = $service;
    }

    public function store(Request $request)
    {
        $dto    = \App\DTO\PostInputDTO::fromRequest($request);

        // New service method that handles idempotency logic
        $result = $this->service->createFromWebhook($dto);

        return response()->json([
            'message' => $result['idempotent']
                ? 'Post already processed (idempotent replay)'
                : 'Post processed successfully',
            'data' => $result,
        ], $result['idempotent'] ? 200 : 201);
    }

}
