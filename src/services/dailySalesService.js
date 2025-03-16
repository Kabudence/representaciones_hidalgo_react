// src/services/dailySalesService.js
import api from "./api";

const dailySalesService = {
    // Obtiene las ventas de hoy (completadas) desde /ventas/today-completed-peru
    getCompletedToday: async () => {
        const response = await api.get("/ventas/today-completed-peru");
        // El backend retorna algo como { ventas: [...] }
        return response.data?.ventas || [];
    },

    // Obtiene fotos asociadas a un idcab con paginación (offset, limit)
    getPhotosByIdCab: async (idcab, offset, limit) => {
        // Llamamos a /fotos/by-idcab/:idcab?offset=?&limit=?
        const response = await api.get(`/fotos/by-idcab/${idcab}?offset=${offset}&limit=${limit}`);
        // El backend retorna { fotos: [...] }
        return response.data?.fotos || [];
    },

    getPage: async (page = 1, size = 10) => {
        const response = await api.get(`/ventas/daily/?page=${page}&size=${size}`);

        return response.data; // { ventas: [], total: number }
    },
    getVentaByNumDocum: async (num_docum) => {
        const response = await api.get(`/ventas/${num_docum}`);
        return response.data;
    },

};

export default dailySalesService;
