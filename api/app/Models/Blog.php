<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HasUuid;
use Illuminate\Support\Str;

class Blog extends Model
{
    use HasFactory, HasUuid;

    protected $fillable = [
        'title',
        'slug',
        'content',
        'author_name',
        'image',
        'status',
    ];

    protected static function boot()
    {
        parent::boot();

        static::saving(function ($blog) {
            if (empty($blog->slug)) {
                $blog->slug = Str::slug($blog->title);
            }
        });
    }
}
