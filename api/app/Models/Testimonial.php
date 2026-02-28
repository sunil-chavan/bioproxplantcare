<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HasUuid;

class Testimonial extends Model
{
    use HasFactory, HasUuid;

    protected $fillable = [
        'name',
        'designation',
        'message',
        'image',
        'rating',
        'status',
    ];
}
