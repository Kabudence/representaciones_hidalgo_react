import api from "./api";
import Clase from "../models/Clase";

const claseService = {
    getAll: async () => {
        const response = await api.get("/clases/");
        return response.data.map(
            (obj) => new Clase(obj.idclase, obj.nombres, obj.idemp, obj.estado)
        );
    },
    create: async (data) => {
        delete data.idclase;
        const response = await api.post("/clases", data);
        return new Clase(
            response.data.idclase,
            response.data.nombres,
            response.data.idemp,
            response.data.estado
        );
    },
    getById: async (idclase) => {
        const response = await api.get(`/clases/${idclase}`);
        const obj = response.data;
        return new Clase(obj.idclase, obj.nombres, obj.idemp, obj.estado);
    },
    update: async (idclase, data) => {
        delete data.idclase;
        const response = await api.put(`/clases/${idclase}`, data);
        return new Clase(
            response.data.idclase,
            response.data.nombres,
            response.data.idemp,
            response.data.estado
        );
    },
    remove: async (idclase) => {
        const response = await api.delete(`/clases/${idclase}`);
        return response.data;
    },
};

export default claseService;
