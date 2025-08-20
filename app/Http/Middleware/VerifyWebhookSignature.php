<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyWebhookSignature
{
    public function handle(Request $request, Closure $next): Response
    {
        $timestamp = $request->header('X-Webhook-Timestamp');
        $signature = $request->header('X-Webhook-Signature');   // hex
        $secret    = config('services.partner_webhook.secret');

        if (!$timestamp || !$signature || !$secret) {
            return response()->json(['message' => 'Webhook signature missing'], 401);
        }
        if (abs(time() - (int)$timestamp) > 300) {
            return response()->json(['message' => 'Webhook timestamp too old'], 401);
        }

        $raw = $request->getContent();
        $computed = hash_hmac('sha256', $timestamp . '.' . $raw, $secret);

        if (!hash_equals($computed, $signature)) {
            return response()->json(['message' => 'Invalid webhook signature'], 401);
        }

        return $next($request);
    }
}
