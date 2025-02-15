class Utilidad {
    constructor({
                    fecha,
                    num_docum,
                    nombre_vendedor,
                    dni_vendedor,
                    nomproducto,
                    precio_costo,
                    precio_venta,
                    utilidades,
                    empresa
                }) {
        this.fecha = fecha; // Formato esperado: "YYYY-MM-DD"
        this.num_docum = num_docum; // Número de documento de la venta
        this.nombre_vendedor = nombre_vendedor; // Nombre del vendedor
        this.dni_vendedor = dni_vendedor; // DNI del vendedor
        this.nomproducto = nomproducto; // Nombre del producto vendido
        this.precio_costo = parseFloat(precio_costo) || 0; // Costo del producto
        this.precio_venta = parseFloat(precio_venta) || 0; // Precio de venta
        this.utilidades = parseFloat(utilidades) || 0; // Ganancia obtenida
        this.empresa = empresa; // Código de la empresa (VARCHAR(2))
    }

    // Método para obtener formato de fecha legible
    getFormattedDate() {
        const date = new Date(this.fecha);
        return date.toLocaleDateString("es-PE"); // Formato: DD/MM/YYYY
    }

    // Método para obtener las utilidades formateadas como moneda
    getFormattedUtilidades() {
        return `S/ ${this.utilidades.toFixed(2)}`;
    }

    // Método para obtener el precio de venta formateado como moneda
    getFormattedPrecioVenta() {
        return `S/ ${this.precio_venta.toFixed(2)}`;
    }
}

export default Utilidad;
