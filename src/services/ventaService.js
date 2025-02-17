// src/services/ventaService.js
import api from "./api";
import Venta from "../models/Venta";

const ventaService = {
    getAll: async () => {
        // GET /ventas
        const response = await api.get("/ventas/");
        console.log("Respuesta de la API:", response.data);

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
        console.log("Respuesta de la API:", response.data);

        return response.data; // { ventas: [], total: number }
    },

    advancedSearch: async (filters) => {
        const query = new URLSearchParams(filters).toString();
        const response = await api.get(`/ventas/advanced-search?${query}`);
        return response.data;
    },


};



export default ventaService;
