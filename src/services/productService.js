import api from './api';

const productService = {
    getAll: async () => {
        try {
            const response = await api.get('/productos/');
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    },

    search: async (term) => {
        try {
            const response = await api.get('/productos/search', {
                params: { term }
            });
            return response.data;
        } catch (error) {
            console.error('Error searching products:', error);
            throw error;
        }
    },

    create: async (product) => {
        try {
            const response = await api.post('/productos', product);
            return response.data;
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    },

    update: async (id, product) => {
        try {
            const productData = {
                idemp: product.idemp || "01",
                periodo: product.periodo || "2025",
                idprod: product.id,
                nomproducto: product.nombre,
                umedida: product.unidad_medida,
                st_ini: product.stock_inicial,
                st_act: product.stock_actual,
                st_min: product.stock_minimo,
                pr_costo: product.precio_costo,
                prventa: product.precio_venta,
                modelo: product.modelo || "MODELO",
                medida: product.medida || "MEDIDA",
                estado: product.estado || 1,
            };

            const response = await api.put(`/productos/${id}`, productData);
            return response.data;
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    },

    remove: async (id) => {
        try {
            const response = await api.delete(`/productos/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    },
};

export default productService;