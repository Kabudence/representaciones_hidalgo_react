// clientService actualizado para coincidir con el backend
import api from "./api";

const clientService = {
    getAll: async () => {
        const response = await api.get("/clientes");
        return response.data;
    },
    create: async (data) => {
        const response = await api.post("/clientes", data);
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/clientes/${id}`);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.put(`/clientes/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        await api.delete(`/clientes/${id}`);
    },
};

export default clientService;