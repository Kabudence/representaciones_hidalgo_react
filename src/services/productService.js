import api from './api'; // La instancia configurada de axios

const productService = {
    getAll: async () => {
        try {
            const response = await api.get('/productos');
            return response.data; // Retorna los datos obtenidos
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    },

    create: async (product) => {
        try {
            const response = await api.post('/productos', product);
            return response.data; // Retorna el producto creado
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    },

    update: async (id, product) => {
        try {
            const response = await api.put(`/productos/${id}`, product);
            return response.data; // Retorna el producto actualizado
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    },

    remove: async (id) => {
        try {
            const response = await api.delete(`/productos/${id}`);
            return response.data; // Retorna la confirmación de eliminación
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    },
};

export default productService;
