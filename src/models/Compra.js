class Compra {
    constructor(fecha, tipoMovimiento, tipoVenta, numDocum, rucCliente, proveedor, valorVenta, igv, total, estado) {
        this.fecha = fecha;
        this.tipoMovimiento = tipoMovimiento;
        this.tipoVenta = tipoVenta;
        this.numDocum = numDocum;
        this.rucCliente = rucCliente;
        this.proveedor = proveedor;
        this.valorVenta = valorVenta;
        this.igv = igv;
        this.total = total;
        this.estado = estado;
    }
}

export default Compra;
