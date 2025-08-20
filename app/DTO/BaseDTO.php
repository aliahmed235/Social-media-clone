<?php

namespace App\DTO;

use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Validator;

abstract class BaseDTO implements DTOInterface
{
    public static function fromRequest(Request $request): self
    {
        // Must be implemented in each concrete DTO
        throw new \RuntimeException("Not Implemented");
    }

    public static function fromArray(array $data): self
    {
        // Must be implemented in each concrete DTO
        throw new \RuntimeException("Not Implemented");
    }

    /**
     * Validate current DTO instance. Throws ValidationException (422 JSON in APIs).
     */
    public function validate(): void
    {
        // Programmatic validation that throws on failure (documented in Laravel validation)
        Validator::validate($this->toArray(), static::rules());
    }

    /** Return array minus specific keys */
    public function toArrayExcept(array $except = []): array
    {
        return Arr::except($this->toArray(), $except);
    }

    /** Return array with null/empty values filtered out */
    public function toFilteredArray(): array
    {
        return array_filter($this->toArray());
    }

    /** Filter null/empty values, then remove specific keys */
    public function toFilteredArrayExcept(array $except = []): array
    {
        return Arr::except(array_filter($this->toArray()), $except);
    }

    /** Must return the DTO as an array (used by validate & persistence) */
    abstract public function toArray(): array;

    /** Must return Laravel validation rules for this DTO */
    abstract public static function rules(): array;
}
