import api from "./api";

/**
 * productService
 * Encapsula las llamadas al endpoint /api/productos
 *
 * Asegúrate de que en tu backend:
 *   app.register_blueprint(producto_bp, url_prefix="/api/productos")
 * y que las rutas estén definidas como:
 *   GET    /api/productos/
 *   POST   /api/productos/
 *   GET    /api/productos/<id>
 *   PUT    /api/productos/<id>
 *   DELETE /api/productos/<id>
 */
const productService = {
    /**
     * GET /api/productos/
     * Retorna array de productos
     */
    getAll: async () => {
        const response = await api.get("/productos/"); // con barra final
        return response.data;
    },

    /**
     * GET /api/productos/<id>
     * @param {string} id - ID (string) del producto
     */
    getById: async (id) => {
        const response = await api.get(`/productos/${id}`);
        return response.data;
    },

    /**
     * POST /api/productos/
     * Crea un nuevo producto
     * @param {Object} data - datos sin 'id' (pues tu schema en Flask pone id como primary_key)
     */
    create: async (data) => {
        const response = await api.post("/productos/", data); // con barra final
        return response.data;
    },

    /**
     * PUT /api/productos/<id>
     * Actualiza un producto existente
     * @param {string} id - ID (string) del producto (en tu DB)
     * @param {Object} data - los campos a actualizar
     */
    update: async (id, data) => {
        const response = await api.put(`/productos/${id}`, data);
        return response.data;
    },

    /**
     * DELETE /api/productos/<id>
     * Elimina un producto
     * @param {string} id
     */
    delete: async (id) => {
        const response = await api.delete(`/productos/${id}`);
        return response.data;
    },
};

export default productService;
