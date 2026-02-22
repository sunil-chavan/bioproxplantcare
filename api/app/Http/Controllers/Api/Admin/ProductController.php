<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\ApiBaseController;
use App\Http\Requests\ProductRequest;
use App\Http\Resources\ProductResource;
use App\Services\ProductServiceInterface;
use Illuminate\Http\JsonResponse;

class ProductController extends ApiBaseController
{
    /**
     * @var ProductServiceInterface
     */
    protected $productService;

    /**
     * ProductController constructor.
     *
     * @param ProductServiceInterface $productService
     */
    public function __construct(ProductServiceInterface $productService)
    {
        $this->productService = $productService;
    }

    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $products = $this->productService->getPaginated(10, 'created_at', 'desc', ['*'], ['category']);
        return $this->sendSuccess($products, 'Products retrieved successfully');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param ProductRequest $request
     * @return JsonResponse
     */
    public function store(ProductRequest $request): JsonResponse
    {
        $product = $this->productService->create($request->validated());
        return $this->sendSuccess(new ProductResource($product), 'Product created successfully', 201);
    }

    /**
     * Display the specified resource.
     *
     * @param string $id
     * @return JsonResponse
     */
    public function show(string $id): JsonResponse
    {
        $product = $this->productService->getById($id);
        if (!$product) {
            return $this->sendError('Product not found');
        }
        return $this->sendSuccess(new ProductResource($product), 'Product retrieved successfully');
    }

    /**
     * Update the specified resource in storage.
     *
     * @param ProductRequest $request
     * @param string $id
     * @return JsonResponse
     */
    public function update(ProductRequest $request, string $id): JsonResponse
    {
        $updated = $this->productService->update($id, $request->validated());
        if (!$updated) {
            return $this->sendError('Failed to update product');
        }
        $product = $this->productService->getById($id);
        return $this->sendSuccess(new ProductResource($product), 'Product updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param string $id
     * @return JsonResponse
     */
    public function destroy(string $id): JsonResponse
    {
        $deleted = $this->productService->delete($id);
        if (!$deleted) {
            return $this->sendError('Failed to delete product');
        }
        return $this->sendSuccess([], 'Product deleted successfully');
    }
}
