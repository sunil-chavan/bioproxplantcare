import { createContext, useContext, useState, useEffect } from "react";
import Swal from "sweetalert2";
import { loginUser, registerUser, logoutUser, getUser } from "../api/authService";

const AuthContext = createContext();

export { AuthContext };

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("customer_token");

    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                try {
                    const res = await getUser();
                    // Adjust based on actual API response structure
                    setUser(res.data.data?.user || res.data.user || res.data);
                } catch (error) {
                    console.error("Failed to load user", error);
                    localStorage.removeItem("customer_token");
                }
            }
            setLoading(false);
        };
        loadUser();
    }, [token]);

    const login = async (data) => {
        const res = await loginUser(data);
        console.log("login data---->", res.data.data.token);
        localStorage.setItem("customer_token", res.data.data.token);
        console.log("user login data---->", res.data.data.user);
        setUser(res.data.data.user);
    };

    const register = async (data) => {
        const res = await registerUser(data);
        localStorage.setItem("customer_token", res.data.data.token);
        setUser(res.data.data.user);
    };

    const logout = async () => {
        await logoutUser();
        localStorage.removeItem("customer_token");
        setUser(null);

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
        <AuthContext.Provider
            value={{ user, login, register, logout, loading }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
