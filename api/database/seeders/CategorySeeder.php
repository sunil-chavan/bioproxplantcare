<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Indoor Plants', 'slug' => 'indoor-plants', 'description' => 'Beautiful plants for your home.'],
            ['name' => 'Outdoor Plants', 'slug' => 'outdoor-plants', 'description' => 'Hearty plants for your garden.'],
            ['name' => 'Succulents', 'slug' => 'succulents', 'description' => 'Easy care desert plants.'],
            ['name' => 'Flowering Plants', 'slug' => 'flowering-plants', 'description' => 'Brighten up your space with blooms.'],
            ['name' => 'Herbs & Edibles', 'slug' => 'herbs-edibles', 'description' => 'Grow your own food.'],
            ['name' => 'Pots & Planters', 'slug' => 'pots-planters', 'description' => 'Stylish homes for your plants.'],
            ['name' => 'Farming Tools', 'slug' => 'farming-tools', 'description' => 'Everything you need to grow.'],
            ['name' => 'Fertilizers', 'slug' => 'fertilizers', 'description' => 'Keep your plants healthy.'],
        ];

        foreach ($categories as $cat) {
            Category::create(array_merge($cat, ['status' => 'Active']));
        }
    }
}
