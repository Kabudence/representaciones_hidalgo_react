// src/models/Venta.js
class Venta {
    constructor(
        num_docum,          // "001-037801"
        fecha,              // "Sat, 10 Jun 2017 00:00:00 GMT"
        tipo_movimiento,    // "VENTA"
        tipo_venta,         // "TRANSFERENCIA"
        ruc_cliente,        // "12345678"
        cliente,            // "SAMUEL PERALES"
        valor_de_venta,     // "237.80"
        igv,                // "52.20"
        total,              // "290.00"
        estado              // "COMPLETADO" o "PENDIENTE", etc.
    ) {
        this.num_docum = num_docum;
        this.fecha = fecha;
        this.tipo_movimiento = tipo_movimiento;
        this.tipo_venta = tipo_venta;
        this.ruc_cliente = ruc_cliente;
        this.cliente = cliente;
        this.valor_de_venta = valor_de_venta;
        this.igv = igv;
        this.total = total;
        this.estado = estado;
    }
}

export default Venta;
