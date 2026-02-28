<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\ApiBaseController;
use App\Http\Requests\OrderRequest;
use App\Services\OrderServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Exception;

class OrderController extends ApiBaseController
{
    protected $orderService;

    public function __construct(OrderServiceInterface $orderService)
    {
        $this->orderService = $orderService;
    }

    /**
     * Store a newly created order.
     */
    public function store(OrderRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $data['user_id'] = $request->user()->id;

            $order = $this->orderService->placeOrder($data);

            return $this->sendSuccess($order, 'Order placed successfully', 201);
        } catch (Exception $e) {
            return $this->sendError($e->getMessage(), [], 400);
        }
    }

    /**
     * Display a listing of user orders.
     */
    public function index(Request $request): JsonResponse
    {
        $orders = $this->orderService->getUserOrders($request->user()->id);
        return $this->sendSuccess($orders, 'Orders retrieved successfully');
    }

    /**
     * Display the specified order.
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $order = $this->orderService->getById($id);

        if (!$order || $order->user_id !== $request->user()->id) {
            return $this->sendError('Order not found');
        }

        $order->load('items.product');

        return $this->sendSuccess($order, 'Order retrieved successfully');
    }
    /**
     * Cancel an order.
     */
    public function cancel(Request $request, string $id): JsonResponse
    {
        try {
            $order = $this->orderService->getById($id);

            if (!$order) {
                return $this->sendError('Order not found', [], 404);
            }

            // Ensure the order belongs to the authenticated user
            if ($order->user_id !== $request->user()->id) {
                return $this->sendError('Unauthorized', [], 403);
            }

            if ($order->status !== 'pending') {
                return $this->sendError('Only pending orders can be cancelled', [], 400);
            }

            $this->orderService->updateOrderStatus($id, 'cancelled');

            return $this->sendSuccess([], 'Order cancelled successfully');
        } catch (Exception $e) {
            return $this->sendError($e->getMessage(), [], 400);
        }
    }

    /**
     * Verify payment.
     */
    public function verifyPayment(Request $request): JsonResponse
    {
        try {
            $data = $request->validate([
                'razorpay_order_id' => 'required|string',
                'razorpay_payment_id' => 'required|string',
                'razorpay_signature' => 'required|string',
            ]);

            $success = $this->orderService->verifyPayment($data);

            if ($success) {
                return $this->sendSuccess([], 'Payment verified successfully');
            }

            return $this->sendError('Payment verification failed');
        } catch (Exception $e) {
            return $this->sendError($e->getMessage(), [], 400);
        }
    }
}
