import api from './api';

const regmovcabPagosService = {
    getTiposVenta: async () => {
        const response = await api.get('/regmovcab-pagos/tipos-venta');
        return response.data;
    },

    getPagosByIdmov: async (idmov) => {
        const response = await api.get(`/regmovcab-pagos/${idmov}`);
        return response.data;
    },

    savePagos: async (idmov, pagos) => {
        const response = await api.post(`/regmovcab-pagos/${idmov}`, { pagos });
        return response.data;
    },
};

export default regmovcabPagosService;
