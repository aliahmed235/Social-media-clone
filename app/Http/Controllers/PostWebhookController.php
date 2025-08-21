<?php

namespace App\Http\Controllers;

use App\DTO\Post\PostInputDTO;
use App\Services\PostService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PostWebhookController extends Controller
{
    public function __construct(private PostService $postService) {}

    public function store(Request $request)
    {
        // validate
        $validator = Validator::make($request->all(), PostInputDTO::rules());
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors(),
            ], 422);
        }

        // create DTO
        $dto = new PostInputDTO(
            title: $request->input('title'),
            body:  $request->input('body'),
            userId: $request->input('user_id'),
            source: $request->input('source', 'webhook'),
            externalEventId: $request->input('external_event_id')
        );

        // delegate to service
        $result = $this->postService->createFromWebhook($dto);

        return response()->json($result['post'], $result['idempotent'] ? 200 : 201);
    }
}
