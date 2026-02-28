<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\ApiBaseController;
use App\Models\Slider;
use Illuminate\Http\JsonResponse;

class SliderController extends ApiBaseController
{
    public function index(): JsonResponse
    {
        $sliders = Slider::where('status', true)->orderBy('order', 'asc')->get();
        return $this->sendSuccess($sliders, 'Sliders retrieved successfully');
    }
}
