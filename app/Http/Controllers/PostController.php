<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Http\Resources\PostResource;
use App\DTO\Post\PostInputDTO;

class PostController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        return Post::with(['user:id,name,email'])
            ->latest()
            ->get(['id','user_id','title','body','deleted_at','created_at']);
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

    public function store(\Illuminate\Http\Request $request)
    {
        $dto = PostInputDTO::fromRequest($request);
        $dto->validate();

        // exclude any columns not in the posts table
        $post = Post::create($dto->toArrayExcept(['external_event_id']));

        return (new PostResource($post))->response()->setStatusCode(201);
    }

    public function update(\Illuminate\Http\Request $request, Post $post)
    {
        $dto = PostInputDTO::fromRequest($request);
        $dto->validate();

        // don't change owner; also drop non-existing columns
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
