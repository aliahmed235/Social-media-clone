<?php

namespace App\DTO;

use App\DTO\BaseDTO;
use Illuminate\Http\Request;

final class TestNameDTO extends BaseDTO
{
    public function __construct(public ?string $name) {}

    public static function fromRequest(Request $request): self {
        return new self($request->input('name'));
    }

    public static function fromArray(array $a): self {
        return new self($a['name'] ?? null);
    }

    public function toArray(): array {
        return ['name' => $this->name];
    }

    public static function rules(): array {
        return ['name' => ['required','string']];
    }
}
