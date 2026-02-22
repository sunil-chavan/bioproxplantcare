<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\ApiBaseController;
use App\Services\ProductServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends ApiBaseController
{
    protected $productService;

    public function __construct(ProductServiceInterface $productService)
    {
        $this->productService = $productService;
    }

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['category_id', 'search']);
        $products = $this->productService->getPaginatedProducts($filters, 20);

        return $this->sendSuccess($products, 'Products retrieved successfully');
    }

    public function show(string $id): JsonResponse
    {
        $product = $this->productService->getById($id);
        if (!$product || $product->status !== 'Active') {
            return $this->sendError('Product not found');
        }
        $product->load('category');
        return $this->sendSuccess($product, 'Product detail');
    }
}
