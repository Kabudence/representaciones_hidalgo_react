class Product {
    constructor(id, nombre, unidad_medida, stock_inicial, stock_actual, stock_minimo, precio_costo, precio_venta, modelo, medida, clase) {
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
        this.clase = clase;
    }

    static validate(product) {
        if (!product.id || !product.nombre || !product.unidad_medida || product.stock_inicial === null ||
            product.stock_actual === null || product.stock_minimo === null || product.precio_costo === null ||
            product.precio_venta === null || !product.modelo || !product.medida || !product.clase) {
            throw new Error("Todos los campos son obligatorios.");
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
