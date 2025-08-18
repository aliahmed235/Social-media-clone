<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id'      => $this->id,
            'title'   => $this->title,
            'body'    => $this->body,
            'user_id' => $this->user_id,
            'created' => $this->created_at,
            'updated' => $this->updated_at,
        ];
    }
}
