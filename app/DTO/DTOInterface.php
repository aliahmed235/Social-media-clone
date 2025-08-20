<?php

namespace App\DTO;

use Illuminate\Http\Request;

interface DTOInterface
{
    public static function fromRequest(Request $request): self;

    public static function fromArray(array $data): self;

    public function toArray(): array;

    public static function rules(): array;

    /**
     * Should throw \Illuminate\Validation\ValidationException on failure.
     */
    public function validate(): void;
}
