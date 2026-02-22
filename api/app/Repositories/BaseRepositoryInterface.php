<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

interface BaseRepositoryInterface
{
    /**
     * Get all items.
     *
     * @param array $columns
     * @param array $relations
     * @return Collection
     */
    public function all(array $columns = ['*'], array $relations = []): Collection;

    /**
     * Get paginated records.
     *
     * @param int $perPage
     * @param string $orderBy
     * @param string $orderDir
     * @param array $columns
     * @param array $relations
     * @return \Illuminate\Pagination\LengthAwarePaginator
     */
    public function getPaginated(
        int $perPage = 15,
        string $orderBy = 'created_at',
        string $orderDir = 'desc',
        array $columns = ['*'],
        array $relations = []
    );

    /**
     * Find item by ID.
     *
     * @param string $id
     * @param array $columns
     * @param array $relations
     * @return Model|null
     */
    public function findById(string $id, array $columns = ['*'], array $relations = []): ?Model;

    /**
     * Create a new item.
     *
     * @param array $data
     * @return Model
     */
    public function create(array $data): Model;

    /**
     * Update an existing item.
     *
     * @param string $id
     * @param array $data
     * @return bool
     */
    public function update(string $id, array $data): bool;

    /**
     * Delete an item.
     *
     * @param string $id
     * @return bool
     */
    public function delete(string $id): bool;
}
