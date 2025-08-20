<?php
namespace App\Http\Controllers\Webhook;

use App\DTO;
use App\Http\Controllers\Controller;
use App\Services\PostService;
use Illuminate\Http\Request;

class PostWebhookController extends Controller
{
    protected PostService $service;

    public function __construct(PostService $service)
    {
        $this->service = $service;
    }

    public function store(Request $request)
    {
        $dto    = DTO\Post\PostInputDTO::fromRequest($request);

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
