<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Repositories
        $this->app->bind(
            \App\Repositories\CategoryRepositoryInterface::class,
            \App\Repositories\Eloquent\CategoryRepository::class
        );
        $this->app->bind(
            \App\Repositories\ProductRepositoryInterface::class,
            \App\Repositories\Eloquent\ProductRepository::class
        );
        $this->app->bind(
            \App\Repositories\OrderRepositoryInterface::class,
            \App\Repositories\Eloquent\OrderRepository::class
        );
        $this->app->bind(
            \App\Repositories\CartRepositoryInterface::class,
            \App\Repositories\Eloquent\CartRepository::class
        );

        // Services
        $this->app->bind(
            \App\Services\CategoryServiceInterface::class,
            \App\Services\CategoryService::class
        );
        $this->app->bind(
            \App\Services\ProductServiceInterface::class,
            \App\Services\ProductService::class
        );
        $this->app->bind(
            \App\Services\OrderServiceInterface::class,
            \App\Services\OrderService::class
        );
        $this->app->bind(
            \App\Services\CartServiceInterface::class,
            \App\Services\CartService::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
