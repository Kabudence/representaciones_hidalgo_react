import api from "./api";

const providerService = {
    getAll: async () => {
        const response = await api.get("/proveedores");
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/proveedores/${id}`);
        return response.data;
    },
    create: async (data) => {
        const response = await api.post("/proveedores", data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.put(`/proveedores/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/proveedores/${id}`);
        return response.data;
    },
};

export default providerService;