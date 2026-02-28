<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory, HasUuid;

    protected $fillable = [
        'order_number',
        'user_id',
        'total_amount',
        'discount_amount',
        'shipping_amount',
        'net_amount',
        'status',
        'payment_status',
        'payment_method',
        'shipping_address',
        'billing_address',
        'notes',
        'customer_name',
        'customer_email',
        'customer_phone',
        'city',
        'state',
        'pincode',
        'razorpay_order_id',
        'razorpay_payment_id',
        'razorpay_signature',
    ];

    /**
     * Relationship with User
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relationship with OrderItems
     */
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
