<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Post extends Model
{
    use HasFactory, SoftDeletes; // ⬅️ add SoftDeletes

    // Allow mass assignment (add image here if you use it)
    protected $fillable = ['user_id', 'title', 'body', 'source'];

    protected $guarded = [];
    public function user()
    {
        return $this->belongsTo(\App\Models\User::class);
    }
}
