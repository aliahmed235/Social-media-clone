<?php

namespace App\DTO;

use Illuminate\Http\Request;

final class PostInputDTO
{
    public function __construct(
        public string  $title,
        public string  $body,
        public ?int    $userId,            // user ID from request or auth user
        public string  $source,            // 'internal' | 'partner'
        public ?string $externalEventId,   // for idempotency (optional)
    ) {}

    /**
     * ✅ Factory method to create DTO directly from request
     */
    public static function fromRequest(Request $request): self
    {
        // Use user_id from request if given, otherwise fallback to authenticated user
        $userId = $request->input('user_id') ?? $request->user()?->id;

        return new self(
            title: $request->input('title'),
            body: $request->input('body'),
            userId: $userId,
            source: $request->input('source', 'internal'),   // default "internal"
            externalEventId: $request->input('external_event_id') // optional
        );
    }
}
