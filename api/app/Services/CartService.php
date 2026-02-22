<?php

namespace App\Services;

use App\Repositories\CartRepositoryInterface;
use App\Repositories\ProductRepositoryInterface;
use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class CartService extends BaseService implements CartServiceInterface
{
    protected $productRepository;

    public function __construct(
        CartRepositoryInterface $repository,
        ProductRepositoryInterface $productRepository
    ) {
        parent::__construct($repository);
        $this->productRepository = $productRepository;
    }

    /**
     * @inheritDoc
     */
    public function getUserCart(string $userId): Collection
    {
        return $this->repository->getByUserId($userId);
    }

    /**
     * @inheritDoc
     */
    public function addToCart(array $data): Model
    {
        $product = $this->productRepository->findById($data['product_id']);
        if (!$product || $product->status !== 'Active') {
            throw new Exception("Product not available");
        }

        if ($product->stock < $data['quantity']) {
            throw new Exception("Insufficient stock");
        }

        // Check if item already in cart
        $existing = $this->repository->getByUserId($data['user_id'])
            ->where('product_id', $data['product_id'])->first();

        if ($existing) {
            $newQty = $existing->quantity + $data['quantity'];
            if ($product->stock < $newQty) {
                throw new Exception("Total quantity exceeds available stock");
            }
            $existing->update(['quantity' => $newQty]);
            return $existing;
        }

        return $this->repository->create($data);
    }

    /**
     * @inheritDoc
     */
    public function updateQuantity(string $cartItemId, int $quantity): bool
    {
        $item = $this->repository->getById($cartItemId);
        if (!$item)
            throw new Exception("Cart item not found");

        $product = $this->productRepository->findById($item->product_id);
        if ($product->stock < $quantity) {
            throw new Exception("Insufficient stock");
        }

        return $item->update(['quantity' => $quantity]);
    }

    /**
     * @inheritDoc
     */
    public function removeFromCart(string $cartItemId): bool
    {
        return $this->repository->delete($cartItemId);
    }

    /**
     * @inheritDoc
     */
    public function clearUserCart(string $userId): bool
    {
        return $this->repository->clearCart($userId);
    }
}
