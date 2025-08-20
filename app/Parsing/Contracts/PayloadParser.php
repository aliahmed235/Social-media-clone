<?php
namespace App\Parsing\Contracts;

use Illuminate\Http\Request;
use App\DTO\PostInputDTO;

interface PayloadParser {
    public function toDto(Request $request): PostInputDTO;
}
