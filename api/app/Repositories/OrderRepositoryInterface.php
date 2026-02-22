<?php

namespace App\Repositories;

interface OrderRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Get orders by User ID.
     *
     * @param string $userId
     * @return mixed
     */
    public function getByUserId(string $userId);

    /**
     * Update order status.
     *
     * @param string $orderId
     * @param string $status
     * @return bool
     */
    public function updateStatus(string $orderId, string $status);
}
