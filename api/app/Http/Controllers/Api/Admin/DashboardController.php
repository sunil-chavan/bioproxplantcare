<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\ApiBaseController;
use App\Models\Product;
use App\Models\Category;
use App\Models\Blog;
use App\Models\Testimonial;
use App\Models\Order;
use Illuminate\Http\JsonResponse;

class DashboardController extends ApiBaseController
{
    /**
     * Get dashboard statistics.
     *
     * @return JsonResponse
     */
    public function getStats(): JsonResponse
    {
        $stats = [
            'total_products' => Product::count(),
            'total_categories' => Category::count(),
            'total_blogs' => Blog::count(),
            'total_testimonials' => Testimonial::count(),
            'total_orders' => Order::count(),
            'recent_orders_count' => Order::where('created_at', '>=', now()->subDays(7))->count(),
        ];

        return $this->sendSuccess($stats, 'Dashboard statistics retrieved successfully');
    }
}
