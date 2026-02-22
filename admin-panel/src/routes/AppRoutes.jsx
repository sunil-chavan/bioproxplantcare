import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/Admin.js";
import AuthLayout from "../layouts/Auth.js";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";

const AppRoutes = () => {
    return (
        <Routes>
            <Route
                path="/admin/*"
                element={
                    <ProtectedRoute>
                        <AdminLayout />
                    </ProtectedRoute>
                }
            />
            <Route path="/auth/*" element={<AuthLayout />} />
            <Route path="*" element={<Navigate to="/admin/index" replace />} />
        </Routes>
    );
};

export default AppRoutes;
