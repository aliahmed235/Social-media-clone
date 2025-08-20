<?php
namespace App\Parsing;

use Illuminate\Http\Request;
use App\DTO;
use App\Parsing\Contracts\PayloadParser;
use SimpleXMLElement;

final class XmlPostPayloadParser implements PayloadParser
{
    public function toDto(Request $request): PostInputDTO
    {
        $xml = new SimpleXMLElement($request->getContent());

        return new PostInputDTO(
            title:  (string)($xml->title ?? ''),
            body:   (string)($xml->body  ?? ''),
            userId: null,
            source: (string)($xml->source ?? 'partner'),
            externalEventId: isset($xml->event_id) ? (string)$xml->event_id : null
        );
    }
}
