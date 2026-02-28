import axios from 'axios';
import Swal from 'sweetalert2';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Interceptor to add Authorization header
api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('bioprox_user'));
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor to handle global errors (like 401 Unauthorized)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('bioprox_user');
            Swal.fire({
                icon: 'warning',
                title: 'Session Expired',
                text: 'Your session has expired or is unauthorized. Please log in again.',
                confirmButtonColor: '#10B981',
            }).then(() => {
                window.location.href = '/login';
            });
            // Return a never-resolving promise to prevent other throw blocks from firing
            return new Promise(() => { });
        }
        return Promise.reject(error);
    }
);

export default api;
