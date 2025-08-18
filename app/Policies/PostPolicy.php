<?php

namespace App\Policies;

use App\Models\Post;
use App\Models\User;

class PostPolicy
{
    // Anyone logged in can see the list (adjust to your needs)
    public function viewAny(User $user): bool
    {
        return true;
    }

    // Public posts are viewable by anyone (or require auth if your feed is private)
    public function view(?User $user, Post $post): bool
    {
        return true;
    }

    // Any authenticated user can create a post
    public function create(User $user): bool
    {
        return true;
    }

    // Only the owner can update
    public function update(User $user, Post $post): bool
    {
        return $post->user_id === $user->id;
    }

    // Only the owner can delete (this will soft-delete in your app)
    public function delete(User $user, Post $post): bool
    {
        return $post->user_id === $user->id;
    }

    // Owner can restore their own soft-deleted post (if you add a restore route)
    public function restore(User $user, Post $post): bool
    {
        return $post->user_id === $user->id;
    }

    // Normally disallow force delete in a social app
    public function forceDelete(User $user, Post $post): bool
    {
        return false;
    }
}
