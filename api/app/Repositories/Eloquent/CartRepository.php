<?php

namespace App\Repositories\Eloquent;

use App\Models\CartItem;
use App\Repositories\CartRepositoryInterface;

class CartRepository extends BaseRepository implements CartRepositoryInterface
{
    public function __construct(CartItem $model)
    {
        parent::__construct($model);
    }

    /**
     * @inheritDoc
     */
    public function getByUserId(string $userId)
    {
        return $this->model->where('user_id', $userId)->with('product')->get();
    }

    /**
     * @inheritDoc
     */
    public function clearCart(string $userId)
    {
        return $this->model->where('user_id', $userId)->delete();
    }
}
