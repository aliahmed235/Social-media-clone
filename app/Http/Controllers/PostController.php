<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Services\PostService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Http\Resources\PostResource;
use App\DTO\Post\PostInputDTO;
use Illuminate\Http\Request;

class PostController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        return Post::with(['user:id,name,email'])
            ->latest()
            ->get(['id','user_id','title','body','deleted_at','created_at']);
    }
    public function store(Request $request, PostService $service)
    {
        // Build DTO from the request (injects auth user id, sets source='app')
        $dto = \App\DTO\Post\PostInputDTO::fromRequest($request);

        // Delegate to service
        $post = $service->createFromUser($dto);

        // Return your resource for consistent shape
        return new \App\Http\Resources\PostResource($post->loadMissing('user'));
    }

    public function show(Post $post)
    {
        $post->loadMissing(['user:id,name,email']);
        return $post->only(['id','user_id','title','body','deleted_at','created_at']) + [
                'user' => [
                    'id'    => $post->user->id,
                    'name'  => $post->user->name,
                    'email' => $post->user->email,
                ],
            ];
    }

    public function update(Request $request, Post $post)
    {
        $dto = PostInputDTO::fromRequest($request);
        $dto->validate();

        // Don’t allow owner change; also exclude fields not in posts table
        $post->update($dto->toArrayExcept(['user_id','external_event_id']));

        return new PostResource($post->fresh());
    }

    public function destroy(Post $post)
    {
        $post->delete();
        return response()->json(['message' => 'Post soft-deleted']);
    }

    public function restore(Post $post)
    {
        $this->authorize('update', $post);
        $post->restore();
        return response()->json(['message' => 'Post restored']);
    }
}
