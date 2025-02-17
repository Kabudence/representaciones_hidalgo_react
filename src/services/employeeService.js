import api from "./api";

const employeeService = {
    getAll: async () => {
        const response = await api.get("/vendedores/");
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/vendedores/${id}`);
        return response.data;
    },
    create: async (data) => {
        console.log("Enviando solicitud POST con datos:", data); // Log antes de la solicitud
        const response = await api.post("/vendedores", data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.put(`/vendedores/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/vendedores/${id}`);
        return response.data;
    },
};

export default employeeService;
