<?php

namespace App\Services;

use App\Repositories\BaseRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

abstract class BaseService implements BaseServiceInterface
{
    /**
     * @var BaseRepositoryInterface
     */
    protected $repository;

    /**
     * BaseService constructor.
     *
     * @param BaseRepositoryInterface $repository
     */
    public function __construct(BaseRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    /**
     * @inheritDoc
     */
    public function getAll(array $relations = []): Collection
    {
        return $this->repository->all(['*'], $relations);
    }

    /**
     * @inheritDoc
     */
    public function getPaginated(
        int $perPage = 10,
        string $orderBy = 'created_at',
        string $orderDir = 'desc',
        array $columns = ['*'],
        array $relations = []
    ) {
        return $this->repository->getPaginated($perPage, $orderBy, $orderDir, $columns, $relations);
    }

    /**
     * @inheritDoc
     */
    public function getById(string $id): ?Model
    {
        return $this->repository->findById($id);
    }

    /**
     * @inheritDoc
     */
    public function create(array $data): Model
    {
        return $this->repository->create($data);
    }

    /**
     * @inheritDoc
     */
    public function update(string $id, array $data): bool
    {
        return $this->repository->update($id, $data);
    }

    /**
     * @inheritDoc
     */
    public function delete(string $id): bool
    {
        return $this->repository->delete($id);
    }
}
