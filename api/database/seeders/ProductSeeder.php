<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = Category::all();

        $plantNames = [
            'Snake Plant',
            'Aloe Vera',
            'Peace Lily',
            'Spider Plant',
            'Money Plant',
            'Rubber Plant',
            'Jade Plant',
            'ZZ Plant',
            'Boston Fern',
            'Areca Palm',
            'Pothos',
            'Monstera Adansonii',
            'Philodendron',
            'Fiddle Leaf Fig',
            'Cactus Mix',
            'Succulent Tray',
            'Rose Bush',
            'Lavender',
            'Marigold',
            'Tulips',
            'Daffodils',
            'Orchid',
            'Jasmine',
            'Hibiscus',
            'Basil',
            'Mint',
            'Rosemary',
            'Thyme',
            'Oregano',
            'Parsley',
            'Chili Pepper',
            'Cherry Tomato',
            'Lemon Grass',
            'Curry Leaves',
            'Bonsai Pine',
            'Air Plant',
            'Lucky Bamboo',
            'Aglonema',
            'Calathea',
            'Stromanthe',
            'Peperomia',
            'String of Pearls',
            'Living Stone',
            'Desert Rose',
            'Sun Flower',
            'Daisy',
            'Lavender French',
            'Geranium',
            'Begonia',
            'Petunia',
            'Zinnia',
            'Cosmos',
            'Snapdragon',
            'Pansy',
            'Impatiens',
            'Morning Glory',
            'Clematis',
            'Honeysuckle',
            'Wisteria',
            'Bougainvillea'
        ];

        foreach ($plantNames as $index => $name) {
            $cat = $categories->random();
            $price = rand(100, 2000);
            $stock = rand(0, 50);

            Product::create([
                'category_id' => $cat->id,
                'name' => $name,
                'slug' => Str::slug($name) . '-' . $index,
                'description' => "Detailed description for $name. This plant is a great addition to your collection.",
                'short_description' => "Beautiful $name for enthusiasts.",
                'price' => $price,
                'sale_price' => rand(0, 1) ? ($price * 0.8) : null,
                'stock' => $stock,
                'status' => 'Active',
                'meta_title' => "Buy $name Online",
                'is_featured' => rand(0, 5) === 0,
            ]);
        }
    }
}
