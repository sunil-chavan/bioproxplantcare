import api from './axios';

const dashboardService = {
    getStats: async () => {
        try {
            const response = await api.get('/admin/stats');
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default dashboardService;
