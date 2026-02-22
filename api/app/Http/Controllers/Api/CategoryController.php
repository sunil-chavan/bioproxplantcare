<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\ApiBaseController;
use App\Services\CategoryServiceInterface;
use Illuminate\Http\JsonResponse;

class CategoryController extends ApiBaseController
{
    protected $categoryService;

    public function __construct(CategoryServiceInterface $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    public function index(): JsonResponse
    {
        $categories = $this->categoryService->getAll()->where('status', 'Active');
        return $this->sendSuccess($categories, 'Categories retrieved successfully');
    }

    public function show(string $id): JsonResponse
    {
        $category = $this->categoryService->getById($id);
        if (!$category || $category->status !== 'Active') {
            return $this->sendError('Category not found');
        }
        $category->load([
            'products' => function ($query) {
                $query->where('status', 'Active');
            }
        ]);
        return $this->sendSuccess($category, 'Category detail with products');
    }
}
