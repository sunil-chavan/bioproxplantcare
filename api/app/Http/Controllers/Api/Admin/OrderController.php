<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\ApiBaseController;
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
     * Display a listing of all orders.
     */
    public function index(): JsonResponse
    {
        // Use repository directly or add param to service
        // Since getAll in service calls repository->all(), we need to pass relations
        // But getAll in service doesn't accept params. 
        // Let's modify getAll in BaseService to accept relations or just override in OrderService.
        // Actually, simplest is to use the repository if public, but it's protected.
        // Let's modify OrderService to accept relations in getAll.

        // Wait, I can't modify BaseService signature easily without checking all implementations.
        // Let's check if I can just add `getAll` to OrderService with params.

        $orders = $this->orderService->getAll(['user']);
        return $this->sendSuccess($orders, 'Orders retrieved successfully');
    }

    /**
     * Display the specified order.
     */
    public function show(string $id): JsonResponse
    {
        $order = $this->orderService->getById($id);
        if (!$order) {
            return $this->sendError('Order not found');
        }
        $order->load(['items.product', 'user']);
        return $this->sendSuccess($order, 'Order retrieved successfully');
    }

    /**
     * Update the order status.
     */
    public function updateStatus(Request $request, string $id): JsonResponse
    {
        try {
            $request->validate([
                'status' => 'required|string|in:pending,confirmed,processing,shipped,delivered,cancelled'
            ]);

            $updated = $this->orderService->updateOrderStatus($id, $request->status);

            if (!$updated) {
                return $this->sendError('Failed to update order status');
            }

            return $this->sendSuccess([], 'Order status updated successfully');
        } catch (Exception $e) {
            return $this->sendError($e->getMessage(), [], 400);
        }
    }
}
