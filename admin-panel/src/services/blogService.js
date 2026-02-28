import api from './axios';

const blogService = {
    getAll: async (params = {}) => {
        const response = await api.get('/admin/blogs', { params });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/admin/blogs/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/admin/blogs', data);
        return response.data;
    },

    update: async (id, data) => {
        if (data instanceof FormData) {
            if (!data.has('_method')) data.append('_method', 'PUT');
            const response = await api.post(`/admin/blogs/${id}`, data);
            return response.data;
        }
        const response = await api.put(`/admin/blogs/${id}`, data);
        return response.data;
    },

    updateStatus: async (id, status) => {
        const response = await api.put(`/admin/blogs/${id}`, { status });
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/admin/blogs/${id}`);
        return response.data;
    }
};

export default blogService;
