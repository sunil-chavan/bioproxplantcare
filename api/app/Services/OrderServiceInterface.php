<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

interface OrderServiceInterface extends BaseServiceInterface
{
    /**
     * Create a new order with transaction and stock handling.
     *
     * @param array $data
     * @return Model
     */
    public function placeOrder(array $data): Model;

    /**
     * Update order status with lifecycle rules.
     *
     * @param string $orderId
     * @param string $status
     * @return bool
     */
    public function updateOrderStatus(string $orderId, string $status): bool;

    /**
     * Get orders for a specific user.
     *
     * @param string $userId
     * @return Collection
     */
    public function getUserOrders(string $userId): Collection;
}
