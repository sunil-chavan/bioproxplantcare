<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

interface BaseServiceInterface
{
    /**
     * Get all records.
     *
     * @return Collection
     */
    public function getAll(array $relations = []): Collection;

    /**
     * Get paginated records.
     *
     * @param int $perPage
     * @param string $orderBy
     * @param string $orderDir
     * @param array $relations
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getPaginated(
        int $perPage = 10,
        string $orderBy = 'created_at',
        string $orderDir = 'desc',
        array $columns = ['*'],
        array $relations = []
    );

    /**
     * Find record by ID.
     *
     * @param string $id
     * @return Model|null
     */
    public function getById(string $id): ?Model;

    /**
     * Create a new record.
     *
     * @param array $data
     * @return Model
     */
    public function create(array $data): Model;

    /**
     * Update an existing record.
     *
     * @param string $id
     * @param array $data
     * @return bool
     */
    public function update(string $id, array $data): bool;

    /**
     * Delete a record.
     *
     * @param string $id
     * @return bool
     */
    public function delete(string $id): bool;
}
