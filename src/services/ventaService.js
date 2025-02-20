// src/services/ventaService.js
import api from "./api";
import Venta from "../models/Venta";

const ventaService = {
    getAll: async () => {
        // GET /ventas
        const response = await api.get("/ventas/");

        return response.data.map((obj) => {
            return new Venta(
                obj.num_docum,
                obj.fecha,
                obj.tipo_movimiento,
                obj.tipo_venta,
                obj.ruc_cliente,
                obj.cliente,
                obj.valor_de_venta,
                obj.igv,
                obj.total,
                obj.estado
            );
        });
    },


    getPage: async (page = 1, size = 10) => {
        const response = await api.get(`/ventas/?page=${page}&size=${size}`);

        return response.data; // { ventas: [], total: number }
    },

    advancedSearch: async (filters) => {
        const query = new URLSearchParams(filters).toString();
        const response = await api.get(`/ventas/advanced-search?${query}`);
        return response.data;
    },
    createInProcess: async (data) => {
        try {
            const response = await api.post("/regmovcab/create-inprocess", data);
            return response.data;
        } catch (error) {
            console.error("Error creando venta en proceso:", error);
            throw error;
        }
    }


};



export default ventaService;
