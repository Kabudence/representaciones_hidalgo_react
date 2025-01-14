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
        try {
            const response = await api.delete(`/clientes/${id}`);
            return response.data; // Retorna la confirmación de eliminación
        } catch (error) {
            console.error('Error deleting clientes:', error);
            throw error;
        }
    },
};

export default clientService;