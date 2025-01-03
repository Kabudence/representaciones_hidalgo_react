class Venta {
    constructor(id, fecha, tipoMovimiento, tipoVenta, numeroComprobante, cliente, valorVenta, igv, total, estado) {
        this.id = id;
        this.fecha = fecha;
        this.tipoMovimiento = tipoMovimiento;
        this.tipoVenta = tipoVenta;
        this.numeroComprobante = numeroComprobante;
        this.cliente = cliente;
        this.valorVenta = valorVenta;
        this.igv = igv;
        this.total = total;
        this.estado = estado;
    }

    static validate(venta) {
        if (!venta.fecha || !venta.tipoMovimiento || !venta.tipoVenta || !venta.numeroComprobante || !venta.cliente || !venta.valorVenta || !venta.igv || !venta.total || !venta.estado) {
            throw new Error("Todos los campos son obligatorios");
        }
    }
}

export default Venta;
