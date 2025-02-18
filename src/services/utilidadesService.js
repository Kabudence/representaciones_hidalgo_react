// src/services/utilidadService.js
import api from "./api";
import Utilidad from "../models/Utilidad.js";

const utilidadService = {
    /**
     * Obtiene utilidades en un rango de fechas.
     * @param {string} startDate - Fecha de inicio (YYYY-MM-DD).
     * @param {string} endDate - Fecha de fin (YYYY-MM-DD).
     * @returns {Promise<Utilidad[]>} - Lista de utilidades formateadas.
     */
    getUtilidades: async (startDate, endDate) => {
        try {
            const response = await api.get(`/utilidades/?start_date=${startDate}&end_date=${endDate}`);

            return response.data.utilidades.map((obj) => new Utilidad(obj));
        } catch (error) {
            console.error("Error al obtener utilidades:", error);
            throw error;
        }
    },

    /**
     * Obtiene utilidades en un rango de fechas filtradas por empresa.
     * @param {string} startDate - Fecha de inicio (YYYY-MM-DD).
     * @param {string} endDate - Fecha de fin (YYYY-MM-DD).
     * @param {string} empresa - Código de la empresa (VARCHAR(2)).
     * @returns {Promise<Utilidad[]>} - Lista de utilidades formateadas.
     */
    getUtilidadesPorEmpresa: async (startDate, endDate, empresa) => {
        try {
            const response = await api.get(`/utilidades/empresa?start_date=${startDate}&end_date=${endDate}&empresa=${empresa}`);

            return response.data.utilidades.map((obj) => new Utilidad(obj));
        } catch (error) {
            console.error("Error al obtener utilidades por empresa:", error);
            throw error;
        }
    }
};

export default utilidadService;
