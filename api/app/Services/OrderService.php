<?php

namespace App\Services;

use App\Repositories\OrderRepositoryInterface;
use App\Repositories\ProductRepositoryInterface;
use App\Repositories\CartRepositoryInterface;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;
use Razorpay\Api\Api;
use Illuminate\Support\Facades\Config;

class OrderService extends BaseService implements OrderServiceInterface
{
    protected $productRepository;
    protected $cartRepository;

    public function __construct(
        OrderRepositoryInterface $repository,
        ProductRepositoryInterface $productRepository,
        CartRepositoryInterface $cartRepository
    ) {
        parent::__construct($repository);
        $this->productRepository = $productRepository;
        $this->cartRepository = $cartRepository;
    }

    /**
     * @inheritDoc
     */
    public function placeOrder(array $data): Model
    {
        return DB::transaction(function () use ($data) {
            // 1. Calculate Totals
            $totalAmount = 0;
            $orderItemsData = [];

            foreach ($data['items'] as $item) {
                // LOCK PRODUCT FOR UPDATE (Step 5)
                $product = DB::table('products')->where('id', $item['product_id'])->lockForUpdate()->first();

                if (!$product) {
                    throw new Exception("Product not found: " . $item['product_id']);
                }

                // Check Stock (Step 4)
                if ($product->stock < $item['quantity']) {
                    throw new Exception("Insufficient stock for product: " . $product->name);
                }

                $price = $product->sale_price ?? $product->price;
                $itemTotal = $price * $item['quantity'];
                $totalAmount += $itemTotal;

                $orderItemsData[] = [
                    'id' => (string) Str::uuid(),
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $price,
                    'total' => $itemTotal,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];

                // Deduct Stock (Step 3 & 7)
                DB::table('products')->where('id', $product->id)->update([
                    'stock' => $product->stock - $item['quantity'],
                    'status' => ($product->stock - $item['quantity']) <= 0 ? 'Out of Stock' : 'Active',
                    'updated_at' => now(),
                ]);
            }

            // 2. Create Order
            $order = $this->repository->create([
                'order_number' => 'ORD-' . strtoupper(Str::random(10)),
                'user_id' => $data['user_id'],
                'customer_name' => $data['name'] ?? null,
                'customer_email' => $data['email'] ?? null,
                'customer_phone' => $data['phone'] ?? null,
                'total_amount' => $totalAmount,
                'discount_amount' => $data['discount_amount'] ?? 0,
                'shipping_amount' => $data['shipping_amount'] ?? 0,
                'net_amount' => $totalAmount + ($data['shipping_amount'] ?? 0) - ($data['discount_amount'] ?? 0),
                'status' => 'pending',
                'payment_status' => 'pending',
                'payment_method' => $data['payment_method'] ?? 'COD',
                'shipping_address' => $data['shipping_address'] ?? null,
                'billing_address' => $data['billing_address'] ?? null,
                'city' => $data['city'] ?? null,
                'state' => $data['state'] ?? null,
                'pincode' => $data['pincode'] ?? null,
                'notes' => $data['notes'] ?? null,
            ]);

            // If payment method is Razorpay, create Razorpay Order
            if (strtolower($data['payment_method'] ?? '') === 'online' || strtolower($data['payment_method'] ?? '') === 'razorpay') {
                try {
                    $api = new Api(Config::get('services.razorpay.key'), Config::get('services.razorpay.secret'));

                    $razorpayOrder = $api->order->create([
                        'receipt' => $order->order_number,
                        'amount' => $order->net_amount * 100, // Amount in paise
                        'currency' => 'INR',
                    ]);

                    $order->update([
                        'razorpay_order_id' => $razorpayOrder['id']
                    ]);

                    // Refresh order to include new field
                    $order = $order->fresh();
                } catch (\Exception $e) {
                    // Log and throw a more friendly error for Razorpay authentication/connection issues
                    if (str_contains(strtolower($e->getMessage()), 'authentication failed')) {
                        throw new \Exception("Payment gateway authentication failed. Please check your Razorpay API keys. Error: " . $e->getMessage());
                    }
                    throw new \Exception("Failed to create payment order: " . $e->getMessage());
                }
            }

            // 3. Create Order Items
            foreach ($orderItemsData as $itemData) {
                $itemData['order_id'] = $order->id;
                DB::table('order_items')->insert($itemData);
            }

            // 4. Clear User Cart (Step 5)
            $this->cartRepository->clearCart($data['user_id']);

            return $order;
        });
    }

    /**
     * @inheritDoc
     */
    public function updateOrderStatus(string $orderId, string $status): bool
    {
        $order = $this->repository->findById($orderId);
        if (!$order) {
            throw new Exception("Order not found");
        }

        $this->validateStatusTransition($order->status, $status);

        return DB::transaction(function () use ($order, $status) {
            // Handle Cancellation (Step 6)
            if ($status === 'cancelled') {
                $items = DB::table('order_items')->where('order_id', $order->id)->get();
                foreach ($items as $item) {
                    $product = DB::table('products')->where('id', $item->product_id)->lockForUpdate()->first();
                    if ($product) {
                        DB::table('products')->where('id', $product->id)->update([
                            'stock' => $product->stock + $item->quantity,
                            'status' => 'Active', // Restore status
                            'updated_at' => now(),
                        ]);
                    }
                }
            }

            return $this->repository->update($order->id, ['status' => $status]);
        });
    }

    /**
     * @inheritDoc
     */
    public function getUserOrders(string $userId): Collection
    {
        return $this->repository->getByUserId($userId);
    }

    /**
     * @inheritDoc
     */
    public function verifyPayment(array $data): bool
    {
        $api = new Api(Config::get('services.razorpay.key'), Config::get('services.razorpay.secret'));

        try {
            $attributes = [
                'razorpay_order_id' => $data['razorpay_order_id'],
                'razorpay_payment_id' => $data['razorpay_payment_id'],
                'razorpay_signature' => $data['razorpay_signature']
            ];

            $api->utility->verifyPaymentSignature($attributes);

            $order = Order::where('razorpay_order_id', $data['razorpay_order_id'])->first();

            if ($order) {
                $order->update([
                    'razorpay_payment_id' => $data['razorpay_payment_id'],
                    'razorpay_signature' => $data['razorpay_signature'],
                    'payment_status' => 'paid',
                    'status' => 'confirmed'
                ]);
                return true;
            }

            return false;
        } catch (Exception $e) {
            return false;
        }
    }

    /**
     * Validate status lifecycle (Step 2)
     */
    protected function validateStatusTransition(string $currentStatus, string $newStatus)
    {
        $transitions = [
            'pending' => ['confirmed', 'cancelled'],
            'confirmed' => ['processing', 'cancelled'],
            'processing' => ['shipped', 'cancelled'],
            'shipped' => ['delivered'],
            'delivered' => [], // Delivered cannot be changed
            'cancelled' => [], // Cancelled cannot be changed
        ];

        if (!isset($transitions[$currentStatus]) || !in_array($newStatus, $transitions[$currentStatus])) {
            throw new Exception("Invalid status transition from {$currentStatus} to {$newStatus}");
        }
    }
}
