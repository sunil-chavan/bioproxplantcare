<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

interface CartServiceInterface extends BaseServiceInterface
{
    public function getUserCart(string $userId): Collection;
    public function addToCart(array $data): Model;
    public function updateQuantity(string $cartItemId, int $quantity): bool;
    public function removeFromCart(string $cartItemId): bool;
    public function clearUserCart(string $userId): bool;
}
