import api from "./api";
import Historial from "../models/Historial";

const historialService = {
    getByProductId: async (idprod) => {
        const response = await api.get(`/historial/${idprod}`);
        return response.data.map(
            (obj) => new Historial(
                obj.num_docum,  // Corregir nombre de campo
                obj.tip_mov,    // Corregir nombre de campo
                obj.fecha,
                obj.producto,   // Usar el campo correcto del response
                obj.nomproducto, // Corregir camelCase
                obj.cantidad
            )
        );
    },
};

export default historialService;
