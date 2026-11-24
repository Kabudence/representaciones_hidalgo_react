import api from "./api";

const analyticsService = {
    getPaymentSummary: async (range = "today") => {
        const params = new URLSearchParams({ range });
        const response = await api.get(`/analytics/payment-summary?${params.toString()}`);
        return response.data;
    },

    getPaymentSales: async ({ range, page, discrepanciesOnly, signal }) => {
        const response = await api.get("/analytics/payment-sales", {
            params: { range, page, discrepancies_only: discrepanciesOnly ? 1 : undefined },
            signal,
        });
        return response.data;
    },

    getInventoryDiagnosis: async (params, signal) => {
        const response = await api.get("/analytics/inventory-diagnosis", { params, signal });
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
