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
    getPhotosByIdCab: async (idcab, offset, limit, includeImages = true) => {
        const response = await api.get(`/fotos/by-idcab/${idcab}`, {
            params: { offset, limit, include_images: includeImages ? 1 : 0 },
        });
        return response.data?.fotos || [];
    },

    getPhotoImage: async (photoId, signal) => {
        const response = await api.get(`/fotos/imagen-privada/${photoId}`, { signal, responseType: "blob" });
        return response.data;
    },

    getPage: async (page = 1, size = 10, filters = {}) => {
        const params = new URLSearchParams({ page, size });

        if (filters.numDocum) {
            params.append("numDocum", filters.numDocum);
        }

        if (filters.status) {
            params.append("status", filters.status);
        }

        const response = await api.get(`/ventas/daily/?${params.toString()}`);
        console.log("🔹 getPage(daily) RESPUESTA:", {
            page,
            size,
            filters,
            data: response.data,
        });

        return response.data; // { ventas: [], total: number }
    },
    getVentaByNumDocum: async (num_docum) => {
        const response = await api.get(`/ventas/${num_docum}`);
        console.log("🔹 getVentaByNumDocum RESPUESTA:", { num_docum, data: response.data });

        return response.data;
    },
    changeStateToComplete: async (idmov, vendedorId) => {
        const body = { vendedor_id: vendedorId };
        const response = await api.put(
            `/regmovcab/change-state-to-complete/${idmov}`,
            body
        );
        return response.data;
    },

};

export default dailySalesService;
