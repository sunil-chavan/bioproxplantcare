<?php

namespace App\Services;

interface ProductServiceInterface extends BaseServiceInterface
{
    /**
     * Get products filtered by category.
     *
     * @param string $categoryId
     * @return mixed
     */
    public function getProductsByCategory(string $categoryId);

    /**
     * Get featured products.
     *
     * @return mixed
     */
    public function getFeaturedProducts();

    /**
     * Get paginated products.
     * 
     * @param array $filters
     * @param int $perPage
     * @return mixed
     */
    public function getPaginatedProducts(array $filters = [], int $perPage = 20);
}
