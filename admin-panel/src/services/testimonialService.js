import api from './axios';

const testimonialService = {
    getAll: async (params = {}) => {
        const response = await api.get('/admin/testimonials', { params });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/admin/testimonials/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/admin/testimonials', data);
        return response.data;
    },

    update: async (id, data) => {
        if (data instanceof FormData) {
            if (!data.has('_method')) data.append('_method', 'PUT');
            const response = await api.post(`/admin/testimonials/${id}`, data);
            return response.data;
        }
        const response = await api.put(`/admin/testimonials/${id}`, data);
        return response.data;
    },

    updateStatus: async (id, status) => {
        const response = await api.put(`/admin/testimonials/${id}`, { status });
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/admin/testimonials/${id}`);
        return response.data;
    }
};

export default testimonialService;
