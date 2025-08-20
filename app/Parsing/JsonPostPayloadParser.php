<?php
namespace App\Parsing;

use Illuminate\Http\Request;
use App\DTO\PostInputDTO;
use App\Parsing\Contracts\PayloadParser;

final class JsonPostPayloadParser implements PayloadParser
{
    public function toDto(Request $request): PostInputDTO
    {
        $data = $request->json()->all();

        return new PostInputDTO(
            title:  (string)($data['title'] ?? ''),
            body:   (string)($data['body']  ?? ''),
            userId: null,
            source: (string)($data['source'] ?? 'partner'),
            externalEventId: isset($data['event_id']) ? (string)$data['event_id'] : null
        );
    }
}
