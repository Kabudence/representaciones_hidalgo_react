// providerService.js

import api from "./api";

/**
 * providerService
 * Encapsula las llamadas al endpoint /api/proveedores
 *
 * Asegúrate de que en tu backend:
 *   app.register_blueprint(proveedor_bp, url_prefix="/api/proveedores")
 * y que las rutas estén definidas como:
 *   GET    /api/proveedores/
 *   POST   /api/proveedores/
 *   GET    /api/proveedores/<id>
 *   PUT    /api/proveedores/<id>
 *   DELETE /api/proveedores/<id>
 */
const providerService = {
    /**
     * Obtiene la lista de proveedores
     * GET /api/proveedores
     */
    getAll: async () => {
        // Llamará a GET http://127.0.0.1:5000/api/proveedores (si api.js apunta a /api)
        const response = await api.get("/proveedores");
        return response.data;
    },

    /**
     * Obtiene un proveedor por su ID
     * GET /api/proveedores/:id
     * @param {number} id - ID del proveedor
     */
    getById: async (id) => {
        const response = await api.get(`/proveedores/${id}`);
        return response.data;
    },

    /**
     * Crea un nuevo proveedor
     * POST /api/proveedores
     * @param {Object} data - Datos del proveedor
     */
    create: async (data) => {
        // Recuerda no incluir "id" si en tu schema está dump_only
        const response = await api.post("/proveedores/", data);
        return response.data;
    },

    /**
     * Actualiza un proveedor existente
     * PUT /api/proveedores/:id
     * @param {number} id - ID del proveedor
     * @param {Object} data - Datos a actualizar
     */
    update: async (id, data) => {
        const response = await api.put(`/proveedores/${id}`, data);
        return response.data;
    },

    /**
     * Elimina un proveedor por su ID
     * DELETE /api/proveedores/:id
     * @param {number} id - ID del proveedor
     */
    delete: async (id) => {
        const response = await api.delete(`/proveedores/${id}`);
        // Normalmente tu backend retorna un JSON con message,
        // puedes retornarlo si lo deseas:
        return response.data;
    },
};

export default providerService;
