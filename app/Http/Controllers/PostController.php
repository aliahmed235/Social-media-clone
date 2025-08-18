<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Http\Resources\PostResource;

class PostController extends Controller
{
    use AuthorizesRequests;

    public function index()
    {
        return PostResource::collection(Post::latest()->paginate(10));
    }

    public function show(Post $post)
    {
        return new PostResource($post);
    }
    public function store(StorePostRequest $request)
    {
        $post = Post::create([
            'user_id' => $request->user()->id,
            ...$request->validated(),
        ]);

        return (new PostResource($post))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdatePostRequest $request, Post $post)
    {
        $post->update($request->validated());
        return new PostResource($post);
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
