<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        // We already check owner in route policy (can:update,post),
        // so returning true here is fine.
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes','string','min:2'],
            'body'  => ['sometimes','string','min:2'],
        ];
    }
}
