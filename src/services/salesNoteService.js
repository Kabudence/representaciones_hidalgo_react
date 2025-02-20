import api from './api'; // La instancia configurada de axios

const salesNoteService = {

    getCurrentSalesNote: async () => {
        const response = await api.get("/regmovcab/current-sales-note");
        return response.data.current_boleta;
    },

    incrementSalesNote: async () => {
        const response = await api.post("/regmovcab/increment-sales-note");
        return response.data.new_boleta;
    }

};
export default salesNoteService;
