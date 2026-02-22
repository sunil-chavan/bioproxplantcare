<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Collection;

interface CartRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Get cart items for a specific user.
     *
     * @param string $userId
     * @return Collection
     */
    public function getByUserId(string $userId);

    /**
     * Clear all items from a user's cart.
     *
     * @param string $userId
     * @return bool
     */
    public function clearCart(string $userId);
}
