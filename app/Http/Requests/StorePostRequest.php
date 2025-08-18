<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Any authenticated user can create a post (policy also protects route)
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required','string','min:2'],
            'body'  => ['required','string','min:2'],
        ];
    }
}
