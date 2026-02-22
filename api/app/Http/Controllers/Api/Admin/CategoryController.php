<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\ApiBaseController;
use App\Http\Requests\CategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Services\CategoryServiceInterface;
use Illuminate\Http\JsonResponse;

class CategoryController extends ApiBaseController
{
    /**
     * @var CategoryServiceInterface
     */
    protected $categoryService;

    /**
     * CategoryController constructor.
     *
     * @param CategoryServiceInterface $categoryService
     */
    public function __construct(CategoryServiceInterface $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $categories = $this->categoryService->getPaginated(10, 'created_at', 'desc');
        return $this->sendSuccess($categories, 'Categories retrieved successfully');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param CategoryRequest $request
     * @return JsonResponse
     */
    public function store(CategoryRequest $request): JsonResponse
    {
        $category = $this->categoryService->create($request->validated());
        return $this->sendSuccess(new CategoryResource($category), 'Category created successfully', 201);
    }

    /**
     * Display the specified resource.
     *
     * @param string $id
     * @return JsonResponse
     */
    public function show(string $id): JsonResponse
    {
        $category = $this->categoryService->getById($id);
        if (!$category) {
            return $this->sendError('Category not found');
        }
        return $this->sendSuccess(new CategoryResource($category), 'Category retrieved successfully');
    }

    /**
     * Update the specified resource in storage.
     *
     * @param CategoryRequest $request
     * @param string $id
     * @return JsonResponse
     */
    public function update(CategoryRequest $request, string $id): JsonResponse
    {
        $updated = $this->categoryService->update($id, $request->validated());
        if (!$updated) {
            return $this->sendError('Failed to update category');
        }
        $category = $this->categoryService->getById($id);
        return $this->sendSuccess(new CategoryResource($category), 'Category updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param string $id
     * @return JsonResponse
     */
    public function destroy(string $id): JsonResponse
    {
        $deleted = $this->categoryService->delete($id);
        if (!$deleted) {
            return $this->sendError('Failed to delete category');
        }
        return $this->sendSuccess([], 'Category deleted successfully');
    }
}
