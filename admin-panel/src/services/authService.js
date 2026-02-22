import api from './axios';

const authService = {
    login: async (email, password) => {
        try {
            const response = await api.post('/login', {
                email,
                password,
                scope: 'admin' // Specifically request admin scope for panel
            });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Network Error');
        }
    },

    logout: async () => {
        try {
            const response = await api.post('/admin/logout');
            return response.data;
        } catch (error) {
            console.error('Logout error:', error);
        }
    },

    register: async (userData) => {
        try {
            const response = await api.post('/register', userData);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Network Error');
        }
    }
};

export default authService;
