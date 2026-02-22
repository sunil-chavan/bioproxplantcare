<?php

namespace App\Repositories;

interface ProductRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Get products by category.
     *
     * @param string $categoryId
     * @return mixed
     */
    public function getByCategory(string $categoryId);

    /**
     * Get featured products.
     *
     * @return mixed
     */
    public function getFeatured();

    /**
     * Get paginated products with filters.
     * 
     * @param array $filters
     * @param int $perPage
     * @return mixed
     */
    public function getPaginated(
        int $perPage = 10,
        string $orderBy = 'created_at',
        string $orderDir = 'desc',
        array $columns = ['*'],
        array $relations = [],
        array $filters = []
    );
}
