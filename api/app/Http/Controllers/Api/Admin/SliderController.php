<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\ApiBaseController;
use App\Models\Slider;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class SliderController extends ApiBaseController
{
    public function index(): JsonResponse
    {
        $sliders = Slider::orderBy('order', 'asc')->get();
        return $this->sendSuccess($sliders, 'Sliders retrieved successfully');
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'link' => 'nullable|string|max:255',
            'order' => 'nullable|integer',
            'status' => 'nullable|boolean',
            'image' => 'required|image|max:2048'
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error', $validator->errors()->all(), 422);
        }

        $data = $validator->validated();

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('sliders', 'public');
            $data['image'] = asset('storage/' . $path);
        }

        $slider = Slider::create($data);
        return $this->sendSuccess($slider, 'Slider created successfully', 201);
    }

    public function show(string $id): JsonResponse
    {
        $slider = Slider::find($id);
        if (!$slider)
            return $this->sendError('Slider not found');
        return $this->sendSuccess($slider, 'Slider retrieved successfully');
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $slider = Slider::find($id);
        if (!$slider)
            return $this->sendError('Slider not found');

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'link' => 'nullable|string|max:255',
            'order' => 'nullable|integer',
            'status' => 'nullable|boolean',
            'image' => 'nullable'
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error', $validator->errors()->all(), 422);
        }

        $data = $validator->validated();

        if ($request->hasFile('image')) {
            // Optional: Delete old image if it exists and is local
            if ($request->file('image')->isValid()) {
                $path = $request->file('image')->store('sliders', 'public');
                $data['image'] = asset('storage/' . $path);
            }
        }

        $slider->update($data);
        return $this->sendSuccess($slider, 'Slider updated successfully');
    }

    public function destroy(string $id): JsonResponse
    {
        $slider = Slider::find($id);
        if (!$slider)
            return $this->sendError('Slider not found');

        $slider->delete();
        return $this->sendSuccess([], 'Slider deleted successfully');
    }
}
