import api from './axios';

const orderService = {
    getAllOrders: async (params) => {
        try {
            const response = await api.get('/admin/orders', { params });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Network Error');
        }
    },

    getOrderById: async (id) => {
        try {
            const response = await api.get(`/admin/orders/${id}`);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Network Error');
        }
    },

    updateOrderStatus: async (id, status) => {
        try {
            const response = await api.post(`/admin/orders/${id}/status`, { status });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : new Error('Network Error');
        }
    }
};

export default orderService;
