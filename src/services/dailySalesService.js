// src/services/dailySalesService.js
import api from "./api";

const dailySalesService = {
    // Obtiene las ventas de hoy (completadas) desde /ventas/today-completed-peru
    getCompletedToday: async () => {
        const response = await api.get("/ventas/today-completed-peru");
        console.log("🔹 getCompletedToday RESPUESTA:", response.data);
        return response.data?.ventas || [];
    },

    // Obtiene fotos asociadas a un idcab con paginación (offset, limit)
    getPhotosByIdCab: async (idcab, offset, limit) => {
        const response = await api.get(`/fotos/by-idcab/${idcab}?offset=${offset}&limit=${limit}`);
        console.log("🔹 getPhotosByIdCab RESPUESTA:", { idcab, offset, limit, data: response.data });
        return response.data?.fotos || [];
    },

    getPage: async (page = 1, size = 10) => {
        const response = await api.get(`/ventas/daily/?page=${page}&size=${size}`);
        console.log("🔹 getPage(daily) RESPUESTA:", { page, size, data: response.data });

        return response.data; // { ventas: [], total: number }
    },
    getVentaByNumDocum: async (num_docum) => {
        const response = await api.get(`/ventas/${num_docum}`);
        console.log("🔹 getVentaByNumDocum RESPUESTA:", { num_docum, data: response.data });

        return response.data;
    },
    changeStateToComplete: async (idmov, vendedor) => {
        const body = { vendedor }; // el back espera { "vendedor": "nombre/dni" }
        const response = await api.put(
            `/regmovcab/change-state-to-complete/${idmov}`,
            body
        );
        console.log("🔹 changeStateToComplete RESPUESTA:", { idmov, vendedor, data: response.data });
        return response.data;
    },

};

export default dailySalesService;
