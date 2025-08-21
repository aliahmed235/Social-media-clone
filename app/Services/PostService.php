<?php

namespace App\Services;

use App\DTO\Post\PostInputDTO;
use App\Models\Post;
use Illuminate\Support\Facades\DB;

class PostService
{
    public function createFromUser(PostInputDTO $dto): Post
    {
        $dto->validate(); // uses your DTO rules

        return Post::create([
            'user_id' => $dto->userId,
            'title'   => $dto->title,
            'body'    => $dto->body,
            'source'  => $dto->source,   // "app"
        ]);
    }

    public function createFromWebhook(PostInputDTO $dto): array
    {
        // (your existing code unchanged)
        return DB::transaction(function () use ($dto) {
            if ($dto->externalEventId) {
                $existing = DB::table('webhook_events')
                    ->where('external_event_id', $dto->externalEventId)
                    ->first();

                if ($existing) {
                    $post = Post::find($existing->post_id);
                    return ['post' => $post, 'idempotent' => true];
                }
            }

            $post = Post::create([
                'user_id' => $dto->userId,
                'title'   => $dto->title,
                'body'    => $dto->body,
                'source'  => $dto->source,
            ]);

            if ($dto->externalEventId) {
                DB::table('webhook_events')->insert([
                    'external_event_id' => $dto->externalEventId,
                    'post_id'           => $post->id,
                    'created_at'        => now(),
                    'updated_at'        => now(),
                ]);
            }

            return ['post' => $post, 'idempotent' => false];
        });
    }
}
