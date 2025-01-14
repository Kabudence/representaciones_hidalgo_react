class Product {
    constructor({
                    id,
                    nombre,
                    unidad_medida,
                    stock_inicial = 0,
                    stock_actual = 0,
                    stock_minimo = 0,
                    precio_costo = 0.0,
                    precio_venta = 0.0,
                    modelo = "",
                    medida = "",
                }) {
        this.id = id;
        this.nombre = nombre;
        this.unidad_medida = unidad_medida;
        this.stock_inicial = stock_inicial;
        this.stock_actual = stock_actual;
        this.stock_minimo = stock_minimo;
        this.precio_costo = precio_costo;
        this.precio_venta = precio_venta;
        this.modelo = modelo;
        this.medida = medida;
    }

    static validate(product) {
        if (!product.id || !product.nombre || !product.unidad_medida) {
            throw new Error("Los campos ID, Nombre y Unidad de Medida son obligatorios.");
        }
        if (product.stock_inicial < 0 || product.stock_actual < 0 || product.stock_minimo < 0) {
            throw new Error("Los valores de stock no pueden ser negativos.");
        }
        if (product.precio_costo < 0 || product.precio_venta < 0) {
            throw new Error("Los precios no pueden ser negativos.");
        }
    }
}

export default Product;
