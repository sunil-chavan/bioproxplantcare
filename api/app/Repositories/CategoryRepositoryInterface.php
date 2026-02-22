<?php

namespace App\Repositories;

interface CategoryRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Get featured categories.
     *
     * @return mixed
     */
    public function getFeatured();
}
