<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;

class PostController extends Controller
{
    // GET /api/posts  (public)
    public function index()
    {
        return Post::latest()->get();
    }

    // POST /api/posts  (requires Bearer token via auth:sanctum)
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required','string','max:120'],
            'body'  => ['required','string'],
        ]);

        $post = Post::create([
            'user_id' => $request->user()->id, // from token
            'title'   => $data['title'],
            'body'    => $data['body'],
        ]);

        return response()->json($post, 201);
    }
}
