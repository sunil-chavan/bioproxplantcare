<?php

namespace App\Services;

interface CategoryServiceInterface extends BaseServiceInterface
{
    /**
     * Get active featured categories.
     *
     * @return mixed
     */
    public function getFeaturedCategories();
}
