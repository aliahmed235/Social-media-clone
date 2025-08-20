<?php

namespace App\Services;

use App\DTO;
use App\Models\Post;
use Illuminate\Support\Facades\DB;

class PostService
{
    /**
     * Create a Post from a webhook in an idempotent way.
     * - If external_event_id repeats, return the existing Post (no duplicate).
     * - Wrap in a DB transaction for atomicity.
     */
    public function createFromWebhook(PostInputDTO $dto): array
    {
        return DB::transaction(function () use ($dto) {

            // Idempotency: if we already saw this external_event_id, return the same result
            if ($dto->externalEventId) {
                $existing = DB::table('webhook_events')
                    ->where('external_event_id', $dto->externalEventId)
                    ->first();

                if ($existing) {
                    $post = Post::find($existing->post_id);

                    return [
                        'id'      => $post?->id,
                        'title'   => $post?->title,
                        'body'    => $post?->body,
                        'source'  => $post?->source ?? 'partner',
                        'external_event_id' => $dto->externalEventId,
                        'idempotent' => true,
                    ];
                }
            }

            // Create the post (make sure Post::$fillable allows these fields)
            $post = Post::create([
                'title'   => $dto->title,
                'body'    => $dto->body,
                'user_id' => $dto->userId,             // can be null for partner posts
                'source'  => $dto->source ?? 'partner', // add column if you don't have it yet
            ]);

            // Record the webhook event so future retries are safe
            if ($dto->externalEventId) {
                DB::table('webhook_events')->insert([
                    'external_event_id' => $dto->externalEventId,
                    'partner'           => $dto->source ?? 'partner',
                    'post_id'           => $post->id,
                    'created_at'        => now(),
                    'updated_at'        => now(),
                ]);
            }

            return [
                'id'      => $post->id,
                'title'   => $post->title,
                'body'    => $post->body,
                'source'  => $post->source ?? 'partner',
                'external_event_id' => $dto->externalEventId,
                'idempotent' => false,
            ];
        });
    }
}
