<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\ApiBaseController;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends ApiBaseController
{
    /**
     * Handle login and issue tokens with appropriate scopes.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
            // 'scope' => 'required|in:admin,customer', // Request scope based on where they login from
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error', $validator->errors()->all(), 422);
        }

        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            $user = Auth::user();

            // Determine scope if not provided
            $scope = $request->scope ?? ($user->role === 'admin' ? 'admin' : 'customer');

            // Check if user has permission for the requested scope
            if ($scope === 'admin' && $user->role !== 'admin') {
                return $this->sendError('Unauthorized', ['Access denied for admin panel'], 403);
            }

            // Create token with requested scope
            $token = $user->createToken('BioProxToken', [$scope])->accessToken;

            return $this->sendSuccess([
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                ],
            ], 'Login successful');
        }

        return $this->sendError('Invalid credentials', [], 401);
    }

    /**
     * Register a new customer.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error', $validator->errors()->all(), 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'customer', // Always register as customer
        ]);

        $token = $user->createToken('BioProxToken', ['customer'])->accessToken;

        return $this->sendSuccess([
            'token' => $token,
            'user' => $user,
        ], 'Registration successful', 201);
    }

    /**
     * Logout and revoke token.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function logout(Request $request): JsonResponse
    {
        $token = $request->user()->token();
        $token->revoke();
        return $this->sendSuccess([], 'Logged out successfully');
    }
}
