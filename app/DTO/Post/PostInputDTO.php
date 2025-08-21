<?php

namespace App\DTO\Post;

use App\DTO\BaseDTO;
use Illuminate\Http\Request;

class PostInputDTO extends BaseDTO
{
    public function __construct(
        public ?string $title,
        public ?string $body,
        public ?int    $userId,
        public string  $source,
        public ?string $externalEventId,
    ) {}

    /** Construct DTO from HTTP request (normal app create) */
    public static function fromRequest(Request $request): self
    {
        // For user-created posts, we trust the authenticated user, not client-sent user_id.
        $user = $request->user();

        return new self(
            title: $request->input('title'),
            body:  $request->input('body'),
            userId: $user?->id,          // inject server-side
            source: 'app',               // tag the source
            externalEventId: null
        );
    }

    /** Construct DTO from an array (handy for tests / services) */
    public static function fromArray(array $a): self
    {
        return new self(
            title: $a['title'] ?? null,
            body:  $a['body']  ?? null,
            userId: $a['user_id'] ?? $a['userId'] ?? null,
            source: $a['source'] ?? 'app',
            externalEventId: $a['external_event_id'] ?? $a['externalEventId'] ?? null
        );
    }

    /** Convert DTO to array for persistence / validation */
    public function toArray(): array
    {
        return [
            'title'             => $this->title,
            'body'              => $this->body,
            'user_id'           => $this->userId,
            'source'            => $this->source,
            'external_event_id' => $this->externalEventId,
        ];
    }

    /** Validation rules (works for both webhook + app because we fill user_id/source) */
    public static function rules(): array
    {
        return [
            'title'             => 'required|string|min:2',
            'body'              => 'required|string|min:2',
            'user_id'           => 'required|integer|exists:users,id',
            'source'            => 'required|string',
            'external_event_id' => 'nullable|string',
        ];
    }
}
