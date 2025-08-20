<?php
namespace App\Parsing\Contracts;

use Illuminate\Http\Request;
use App\DTO;

interface PayloadParser {
    public function toDto(Request $request): PostInputDTO;
}
