import api from "./api";

const getPaginatedCompras = async (page, size) => {
    try {
        const response = await api.get(`/compras/?page=${page}&size=${size}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener compras:", error);
        throw error;
    }
};

const getAdvancedSearch = async (filters) => {
    try {
        const query = new URLSearchParams(filters).toString();
        const response = await api.get(`/compras/advanced-search?${query}`);
        return response.data;
    } catch (error) {
        console.error("Error al realizar búsqueda avanzada:", error);
        throw error;
    }
};
const cancelCompra = async (numDocum) => {
    try {
        const response = await api.put(`/regmovcab/cancel-compra/${numDocum}`);
        return response.data;
    } catch (error) {
        console.error("Error al cancelar la compra:", error);
        throw error;
    }
};
const createCompra = async (compraData) => {
    try {
        const response = await api.post(`/regmovcab/create-compra`, compraData);
        return response.data;
    } catch (error) {
        console.error("Error al crear la compra:", error);
        throw error;
    }

};
const getCompraDetailsByNumDoc = async (numDocum) => {
    try {
        const response = await api.get(`/regmovdet/by-num-doc/${numDocum}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener detalles de la compra:", error);
        throw error;
    }
};

export default {
    getPaginatedCompras,
    getAdvancedSearch,
    createCompra,
    cancelCompra,
    getCompraDetailsByNumDoc,

};
