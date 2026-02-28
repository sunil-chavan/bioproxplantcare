<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\ApiBaseController;
use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class TestimonialController extends ApiBaseController
{
    public function index(): JsonResponse
    {
        $testimonials = Testimonial::orderBy('created_at', 'desc')->get();
        return $this->sendSuccess($testimonials, 'Testimonials retrieved successfully');
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'designation' => 'nullable|string|max:255',
            'message' => 'required|string',
            'rating' => 'nullable|integer|min:1|max:5',
            'status' => 'nullable|string|in:Active,Inactive',
            'image' => 'nullable|image|max:2048'
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error', $validator->errors()->all(), 422);
        }

        $data = $validator->validated();

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('testimonials', 'public');
            $data['image'] = asset('storage/' . $path);
        }

        $testimonial = Testimonial::create($data);
        return $this->sendSuccess($testimonial, 'Testimonial created successfully', 201);
    }

    public function show(string $id): JsonResponse
    {
        $testimonial = Testimonial::find($id);
        if (!$testimonial)
            return $this->sendError('Testimonial not found');

        return $this->sendSuccess($testimonial, 'Testimonial retrieved successfully');
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $testimonial = Testimonial::find($id);
        if (!$testimonial)
            return $this->sendError('Testimonial not found');

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'designation' => 'nullable|string|max:255',
            'message' => 'sometimes|required|string',
            'rating' => 'nullable|integer|min:1|max:5',
            'status' => 'nullable|string|in:Active,Inactive',
            'image' => 'nullable'
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error', $validator->errors()->all(), 422);
        }

        $data = $validator->validated();

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('testimonials', 'public');
            $data['image'] = asset('storage/' . $path);
        }

        $testimonial->update($data);
        return $this->sendSuccess($testimonial, 'Testimonial updated successfully');
    }

    public function destroy(string $id): JsonResponse
    {
        $testimonial = Testimonial::find($id);
        if (!$testimonial)
            return $this->sendError('Testimonial not found');

        $testimonial->delete();
        return $this->sendSuccess([], 'Testimonial deleted successfully');
    }
}
