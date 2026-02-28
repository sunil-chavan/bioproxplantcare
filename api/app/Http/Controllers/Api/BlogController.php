<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\ApiBaseController;
use App\Models\Blog;
use Illuminate\Http\JsonResponse;

class BlogController extends ApiBaseController
{
    public function index(): JsonResponse
    {
        $blogs = Blog::where('status', 'Active')->orderBy('created_at', 'desc')->get();
        return $this->sendSuccess($blogs, 'Blogs retrieved successfully');
    }

    public function show($slugOrId): JsonResponse
    {
        $blog = Blog::where('slug', $slugOrId)->orWhere('id', $slugOrId)->first();
        if (!$blog)
            return $this->sendError('Blog not found');
        return $this->sendSuccess($blog, 'Blog retrieved successfully');
    }
}
