import api from './api'; // La instancia configurada de axios

const productService = {
    getAll: async () => {
        try {
            const response = await api.get('/productos');
            console.log("Respuesta de la API:", response.data);
            return response.data;
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
            // Aquí aseguramos que los datos coincidan con el formato esperado por el backend
            const productData = {
                idemp: product.idemp || "01", // Valores predeterminados
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

            console.log("Enviando datos al backend (PUT):", productData);

            const response = await api.put(`/productos/${id}`, productData);
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
