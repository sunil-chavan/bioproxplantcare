import api from './axios';

const categoryService = {
    getAll: async (params = {}) => {
        const response = await api.get('/admin/categories', { params });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/admin/categories/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/admin/categories', data);
        return response.data;
    },

    update: async (id, data) => {
        if (data instanceof FormData) {
            // Laravel requires POST for FormData update with _method spoofing
            if (!data.has('_method')) data.append('_method', 'PUT');
            const response = await api.post(`/admin/categories/${id}`, data);
            return response.data;
        }
        const response = await api.put(`/admin/categories/${id}`, data);
        return response.data;
    },

    updateStatus: async (id, status) => {
        const response = await api.put(`/admin/categories/${id}`, { status });
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/admin/categories/${id}`);
        return response.data;
    }
};

export default categoryService;
