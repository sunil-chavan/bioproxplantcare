<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\ApiBaseController;
use App\Services\CartServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Exception;

class CartController extends ApiBaseController
{
    protected $cartService;

    public function __construct(CartServiceInterface $cartService)
    {
        $this->cartService = $cartService;
    }

    /**
     * Get user cart items.
     */
    public function index(Request $request): JsonResponse
    {
        $cart = $this->cartService->getUserCart($request->user()->id);
        return $this->sendSuccess($cart, 'Cart retrieved successfully');
    }

    /**
     * Add product to cart.
     */
    public function store(Request $request): JsonResponse
    {
        try {

            $request->validate([
                'product_id' => 'required|exists:products,id',
                'quantity' => 'required|integer|min:1',
            ]);

            $user = auth('customer')->user();

            $data = [
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
                'user_id' => $user->id,
            ];

            $item = $this->cartService->addToCart($data);

            return $this->sendSuccess($item, 'Added to cart successfully');

        } catch (Exception $e) {
            return $this->sendError($e->getMessage(), [], 400);
        }
    }

    /**
     * Update cart item quantity.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $request->validate(['quantity' => 'required|integer|min:1']);

            $this->cartService->updateQuantity($id, $request->quantity);
            return $this->sendSuccess([], 'Cart updated successfully');
        } catch (Exception $e) {
            return $this->sendError($e->getMessage(), [], 400);
        }
    }

    /**
     * Remove item from cart.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $this->cartService->removeFromCart($id);
            return $this->sendSuccess([], 'Item removed from cart');
        } catch (Exception $e) {
            return $this->sendError($e->getMessage(), [], 400);
        }
    }
}
