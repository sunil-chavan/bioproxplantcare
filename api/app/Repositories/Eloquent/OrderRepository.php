<?php

namespace App\Repositories\Eloquent;

use App\Models\Order;
use App\Repositories\OrderRepositoryInterface;

class OrderRepository extends BaseRepository implements OrderRepositoryInterface
{
    /**
     * OrderRepository constructor.
     *
     * @param Order $model
     */
    public function __construct(Order $model)
    {
        parent::__construct($model);
    }

    /**
     * @inheritDoc
     */
    public function getByUserId(string $userId)
    {
        return $this->model->where('user_id', $userId)->with('items.product')->latest()->get();
    }

    /**
     * @inheritDoc
     */
    public function updateStatus(string $orderId, string $status)
    {
        return $this->update($orderId, ['status' => $status]);
    }
}
