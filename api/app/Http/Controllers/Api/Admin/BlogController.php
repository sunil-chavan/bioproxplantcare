<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\ApiBaseController;
use App\Models\Blog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class BlogController extends ApiBaseController
{
    public function index(): JsonResponse
    {
        $blogs = Blog::orderBy('created_at', 'desc')->get();
        return $this->sendSuccess($blogs, 'Blogs retrieved successfully');
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'author_name' => 'nullable|string|max:255',
            'status' => 'nullable|string|in:Active,Inactive,Draft',
            'image' => 'nullable|image|max:2048'
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error', $validator->errors()->all(), 422);
        }

        $data = $validator->validated();
        $data['slug'] = Str::slug($data['title']);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('blogs', 'public');
            $data['image'] = asset('storage/' . $path);
        }

        $blog = Blog::create($data);
        return $this->sendSuccess($blog, 'Blog created successfully', 201);
    }

    public function show(string $id): JsonResponse
    {
        $blog = Blog::find($id);
        if (!$blog)
            return $this->sendError('Blog not found');
        return $this->sendSuccess($blog, 'Blog retrieved successfully');
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $blog = Blog::find($id);
        if (!$blog)
            return $this->sendError('Blog not found');

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string',
            'author_name' => 'nullable|string|max:255',
            'status' => 'nullable|string|in:Active,Inactive,Draft',
            'image' => 'nullable'
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error', $validator->errors()->all(), 422);
        }

        $data = $validator->validated();

        if (isset($data['title'])) {
            $data['slug'] = Str::slug($data['title']);
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('blogs', 'public');
            $data['image'] = asset('storage/' . $path);
        }

        $blog->update($data);
        return $this->sendSuccess($blog, 'Blog updated successfully');
    }

    public function destroy(string $id): JsonResponse
    {
        $blog = Blog::find($id);
        if (!$blog)
            return $this->sendError('Blog not found');

        $blog->delete();
        return $this->sendSuccess([], 'Blog deleted successfully');
    }
}
