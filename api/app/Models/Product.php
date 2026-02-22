<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory, HasUuid;

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'botanical_name',
        'sku',
        'price',
        'sale_price',
        'stock',
        'image',
        'description',
        'short_description',
        'is_featured',
        'meta_title',
        'status',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($product) {
            if (empty($product->slug)) {
                $product->slug = Str::slug($product->name);
            }
        });
    }

    /**
     * Define relationship with Category.
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
