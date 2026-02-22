<?php

namespace App\Services;

use App\Repositories\CategoryRepositoryInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class CategoryService extends BaseService implements CategoryServiceInterface
{
    /**
     * @var CategoryRepositoryInterface
     */
    protected $repository;

    /**
     * CategoryService constructor.
     *
     * @param CategoryRepositoryInterface $repository
     */
    public function __construct(CategoryRepositoryInterface $repository)
    {
        parent::__construct($repository);
    }

    /**
     * @inheritDoc
     */
    public function create(array $data): Model
    {
        if (isset($data['image']) && $data['image'] instanceof UploadedFile) {
            $path = $data['image']->store('categories', 'public');
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
            $path = $data['image']->store('categories', 'public');
            $data['image'] = asset('storage/' . $path);
        }

        return parent::update($id, $data);
    }

    /**
     * @inheritDoc
     */
    public function getFeaturedCategories()
    {
        return $this->repository->getFeatured();
    }
}
