import React, { createContext, useState, useContext, useEffect } from "react";
import Swal from "sweetalert2";
import authService from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("bioprox_user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const data = await authService.login(email, password);
            if (data.success) {
                const userData = {
                    ...data.data.user,
                    token: data.data.token
                };
                setUser(userData);
                localStorage.setItem("bioprox_user", JSON.stringify(userData));
                return { success: true };
            }
            return { success: false, message: "Invalid email or password" };
        } catch (error) {
            console.error("Login failed:", error);
            return { success: false, message: error.message || "An error occurred during login" };
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error("Logout API failed", error);
        }

        setUser(null);
        localStorage.removeItem("bioprox_user");

        Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
        }).fire({
            icon: 'success',
            title: 'Logged out successfully'
        });
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
