import api from './api'; // La instancia configurada de axios

const salesNoteService = {

    getCurrentSalesNote: async () => {
        const response = await api.get("/regmovcab/current-sales-note");
        return response.data.current_boleta;
    },
    searchNumDocum: async (parametro) => {
        try {
            const response = await api.get(`/regmovcab/search-numdocum?parametro=${parametro}`);
            return response.data;
        } catch (error) {
            console.error("Error buscando num_docum:", error);
            throw error;
        }
    },
    incrementSalesNote: async () => {
        const response = await api.post("/regmovcab/increment-sales-note");
        return response.data.new_boleta;
    },
    cancelSale: async (num_docum) => {
        try {
            // Se realiza una petición PUT al endpoint de cancelación
            const response = await api.put(`/regmovcab/cancel-sale/${num_docum}`);
            return response.data;
        } catch (error) {
            console.error("Error cancelando la venta:", error);
            throw error;
        }
    },

};
export default salesNoteService;
