// src/services/lineService.js

import api from "./api";    // tu instancia axios: baseURL = http://127.0.0.1:5000/api
                            // headers: { 'Content-Type': 'application/json' }
import Line from "../models/Line";

const lineService = {
    getAll: async () => {
        // GET /lineas
        const response = await api.get("/lineas/");
        return response.data.map(
            (obj) => new Line(obj.idlinea, obj.nombre, obj.estado, obj.idemp)
        );
    },

    create: async (data) => {
        delete data.idlinea;
        const response = await api.post("/lineas", data);
        return new Line(
            response.data.idlinea,
            response.data.nombre,
            response.data.estado,
            response.data.idemp
        );
    },


    getById: async (idlinea) => {
        // GET /lineas/:idlinea
        const response = await api.get(`/lineas/${idlinea}`);
        const obj = response.data;
        return new Line(obj.idlinea, obj.nombre, obj.estado, obj.idemp);
    },

    update: async (idlinea, data) => {
        delete data.idlinea;
        const response = await api.put(`/lineas/${idlinea}`, data);
        return new Line(
            response.data.idlinea,
            response.data.nombre,
            response.data.estado,
            response.data.idemp
        );
    },


    remove: async (idlinea) => {
        // DELETE /lineas/:idlinea
        const response = await api.delete(`/lineas/${idlinea}`);
        return response.data; // p.ej. { message: "Linea eliminada exitosamente" }
    },
};

export default lineService;
