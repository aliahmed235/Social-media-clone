<?php
// app/DTO/Post/PostInputDTO.php
namespace App\DTO\Post;

use App\DTO\BaseDTO;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;

final class PostInputDTO extends BaseDTO
{
    public function __construct(
        public ?string $title,           // was string
        public ?string $body,            // was string
        public ?int    $userId,
        public string  $source,
        public ?string $externalEventId,
    ) {}

    public static function fromRequest(Request $request): self
    {
        $userId = $request->input('user_id') ?? $request->user()?->id;

        return new self(
            title: $request->input('title'),                 // may be null
            body:  $request->input('body'),                  // may be null
            userId: $userId,
            source: $request->input('source', 'internal'),
            externalEventId: $request->input('external_event_id'),
        );
    }

    public static function fromArray(array $data): self
    {
        return new self(
            title: Arr::get($data, 'title'),                 // remove (string) cast
            body:  Arr::get($data, 'body'),                  // remove (string) cast
            userId: Arr::get($data, 'user_id'),
            source: Arr::get($data, 'source', 'internal'),
            externalEventId: Arr::get($data, 'external_event_id'),
        );
    }

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

    public static function rules(): array
    {
        return [
            'title'             => ['required','string','min:2'],
            'body'              => ['required','string','min:2'],
            'user_id'           => ['nullable','integer','exists:users,id'],
            'source'            => ['required','string','in:internal,partner'],
        ];
    }
}
