import api from './axios';

const productService = {
    getAll: async (params = {}) => {
        const response = await api.get('/admin/products', { params });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/admin/products/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/admin/products', data);
        return response.data;
    },

    update: async (id, data) => {
        if (data instanceof FormData) {
            // Laravel requires POST for FormData update with _method spoofing
            if (!data.has('_method')) data.append('_method', 'PUT');
            const response = await api.post(`/admin/products/${id}`, data);
            return response.data;
        }
        const response = await api.put(`/admin/products/${id}`, data);
        return response.data;
    },

    updateStatus: async (id, status) => {
        const response = await api.put(`/admin/products/${id}`, { status });
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/admin/products/${id}`);
        return response.data;
    }
};

export default productService;
