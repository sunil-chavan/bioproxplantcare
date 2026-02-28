<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\ApiBaseController;
use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;

class TestimonialController extends ApiBaseController
{
    public function index(): JsonResponse
    {
        $testimonials = Testimonial::where('status', 'Active')->orderBy('created_at', 'desc')->get();
        return $this->sendSuccess($testimonials, 'Testimonials retrieved successfully');
    }
}
