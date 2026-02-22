<?php

namespace App\Services;

use App\Repositories\ProductRepositoryInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ProductService extends BaseService implements ProductServiceInterface
{
    /**
     * @var ProductRepositoryInterface
     */
    protected $repository;

    /**
     * ProductService constructor.
     *
     * @param ProductRepositoryInterface $repository
     */
    public function __construct(ProductRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }

    /**
     * @inheritDoc
     */
    public function create(array $data): Model
    {
        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            $path = $data['image']->store('products', 'public');
            $data['image'] = asset('storage/' . $path);
        }

        return parent::create($data);
    }

    /**
     * @inheritDoc
     */
    public function update(string $id, array $data): bool
    {
        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            $path = $data['image']->store('products', 'public');
            $data['image'] = asset('storage/' . $path);
        }

        return parent::update($id, $data);
    }

    /**
     * @inheritDoc
     */
    public function getProductsByCategory(string $categoryId)
    {
        return $this->repository->getByCategory($categoryId);
    }

    /**
     * @inheritDoc
     */
    /**
     * @inheritDoc
     */
    public function getFeaturedProducts()
    {
        return $this->repository->getFeatured();
    }

    /**
     * @inheritDoc
     */
    public function getPaginatedProducts(array $filters = [], int $perPage = 20)
    {
        return $this->repository->getPaginated($perPage, 'created_at', 'desc', ['*'], [], $filters);
    }
}
