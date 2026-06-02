import api from "./api";

const analyticsService = {
    getPaymentSummary: async (range = "today") => {
        const params = new URLSearchParams({ range });
        const response = await api.get(`/analytics/payment-summary?${params.toString()}`);
        return response.data;
    },

    getTopProducts: async (range = "7d", limit = 10) => {
        const params = new URLSearchParams({ range, limit });
        const response = await api.get(`/analytics/top-products?${params.toString()}`);
        return response.data;
    },

    getTopProfitProducts: async (range = "7d", limit = 10) => {
        const params = new URLSearchParams({ range, limit });
        const response = await api.get(`/analytics/top-profit-products?${params.toString()}`);
        return response.data;
    },

    getSellersPerformance: async (range = "7d", limit = 10) => {
        const params = new URLSearchParams({ range, limit });
        const response = await api.get(`/analytics/sellers-performance?${params.toString()}`);
        return response.data;
    },

    getMonthlyTopProducts: async (months = 12, limit = 5) => {
        const params = new URLSearchParams({ months, limit });
        const response = await api.get(`/analytics/monthly-top-products?${params.toString()}`);
        return response.data;
    },
};

export default analyticsService;
