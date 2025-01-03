import React from "react";
import PropTypes from "prop-types";

const VentaForm = ({ venta, setVenta, onSubmit, onCancel }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setVenta({ ...venta, [name]: value });
    };

    return (
        <form onSubmit={onSubmit} style={styles.form}>
            <div style={styles.formGroup}>
                <label style={styles.label}>Fecha:</label>
                <input
                    type="date"
                    name="fecha"
                    value={venta.fecha}
                    onChange={handleChange}
                    required
                    style={styles.input}
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Tipo Movimiento:</label>
                <input
                    type="text"
                    name="tipoMovimiento"
                    value={venta.tipoMovimiento}
                    onChange={handleChange}
                    required
                    style={styles.input}
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Tipo Venta:</label>
                <input
                    type="text"
                    name="tipoVenta"
                    value={venta.tipoVenta}
                    onChange={handleChange}
                    required
                    style={styles.input}
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Número Comprobante:</label>
                <input
                    type="text"
                    name="numeroComprobante"
                    value={venta.numeroComprobante}
                    onChange={handleChange}
                    required
                    style={styles.input}
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Cliente:</label>
                <input
                    type="text"
                    name="cliente"
                    value={venta.cliente}
                    onChange={handleChange}
                    required
                    style={styles.input}
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Valor de Venta:</label>
                <input
                    type="number"
                    name="valorVenta"
                    value={venta.valorVenta}
                    onChange={handleChange}
                    required
                    style={styles.input}
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>IGV:</label>
                <input
                    type="number"
                    name="igv"
                    value={venta.igv}
                    onChange={handleChange}
                    required
                    style={styles.input}
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Total:</label>
                <input
                    type="number"
                    name="total"
                    value={venta.total}
                    onChange={handleChange}
                    required
                    style={styles.input}
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Estado:</label>
                <select
                    name="estado"
                    value={venta.estado}
                    onChange={handleChange}
                    required
                    style={styles.select}
                >
                    <option value="PROCESADA">PROCESADA</option>
                    <option value="PENDIENTE">PENDIENTE</option>
                </select>
            </div>
            <div style={styles.buttonGroup}>
                <button type="submit" style={styles.saveButton}>
                    Guardar
                </button>
                <button type="button" onClick={onCancel} style={styles.cancelButton}>
                    Cancelar
                </button>
            </div>
        </form>
    );
};

VentaForm.propTypes = {
    venta: PropTypes.shape({
        fecha: PropTypes.string.isRequired,
        tipoMovimiento: PropTypes.string.isRequired,
        tipoVenta: PropTypes.string.isRequired,
        numeroComprobante: PropTypes.string.isRequired,
        cliente: PropTypes.string.isRequired,
        valorVenta: PropTypes.number.isRequired,
        igv: PropTypes.number.isRequired,
        total: PropTypes.number.isRequired,
        estado: PropTypes.string.isRequired,
    }).isRequired,
    setVenta: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

const styles = {
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
    },
    formGroup: {
        display: "flex",
        flexDirection: "column",
        marginBottom: "10px",
    },
    label: {
        marginBottom: "5px",
        fontWeight: "bold",
        fontFamily: "'PT Sans Narrow', sans-serif",
    },
    input: {
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        fontSize: "14px",
    },
    select: {
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        fontSize: "14px",
    },
    buttonGroup: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: "20px",
    },
    saveButton: {
        padding: "10px 20px",
        backgroundColor: "#524b4a",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontWeight: "bold",
    },
    cancelButton: {
        padding: "10px 20px",
        backgroundColor: "#dc3545",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontWeight: "bold",
    },
};

export default VentaForm;
