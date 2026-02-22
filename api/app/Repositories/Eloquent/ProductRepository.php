<?php

namespace App\Repositories\Eloquent;

use App\Models\Product;
use App\Repositories\ProductRepositoryInterface;

class ProductRepository extends BaseRepository implements ProductRepositoryInterface
{
    /**
     * ProductRepository constructor.
     *
     * @param Product $model
     */
    public function __construct(Product $model)
    {
        parent::__construct($model);
    }

    /**
     * @inheritDoc
     */
    public function getByCategory(string $categoryId)
    {
        return $this->model->where('category_id', $categoryId)->where('status', 'Active')->get();
    }

    /**
     * @inheritDoc
     */
    /**
     * @inheritDoc
     */
    public function getFeatured()
    {
        return $this->model->where('is_featured', true)->where('status', 'Active')->get();
    }

    /**
     * @inheritDoc
     */
    public function getPaginated(
        int $perPage = 10,
        string $orderBy = 'created_at',
        string $orderDir = 'desc',
        array $columns = ['*'],
        array $relations = [],
        array $filters = []
    ) {
        $query = $this->model->with($relations);

        if (!empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['search'])) {
            $query->where('name', 'LIKE', '%' . $filters['search'] . '%');
        }

        return $query->orderBy($orderBy, $orderDir)
            ->paginate($perPage, $columns);
    }

}
