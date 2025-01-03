import React from "react";
import PropTypes from "prop-types";

const ProductForm = ({ product, setProduct, onSubmit, onCancel }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    return (
        <form onSubmit={onSubmit} style={styles.form}>
            <div style={styles.formGroup}>
                <label style={styles.label}>ID:</label>
                <input
                    type="text"
                    name="id"
                    value={product.id}
                    onChange={handleChange}
                    style={styles.input}
                    required
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Nombre:</label>
                <input
                    type="text"
                    name="nombre"
                    value={product.nombre}
                    onChange={handleChange}
                    style={styles.input}
                    required
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Unidad de Medida:</label>
                <input
                    type="text"
                    name="unidad_medida"
                    value={product.unidad_medida}
                    onChange={handleChange}
                    style={styles.input}
                    required
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Stock Inicial:</label>
                <input
                    type="number"
                    name="stock_inicial"
                    value={product.stock_inicial}
                    onChange={handleChange}
                    style={styles.input}
                    required
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Stock Actual:</label>
                <input
                    type="number"
                    name="stock_actual"
                    value={product.stock_actual}
                    onChange={handleChange}
                    style={styles.input}
                    required
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Stock Mínimo:</label>
                <input
                    type="number"
                    name="stock_minimo"
                    value={product.stock_minimo}
                    onChange={handleChange}
                    style={styles.input}
                    required
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Precio Costo:</label>
                <input
                    type="number"
                    step="0.01"
                    name="precio_costo"
                    value={product.precio_costo}
                    onChange={handleChange}
                    style={styles.input}
                    required
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Precio Venta:</label>
                <input
                    type="number"
                    step="0.01"
                    name="precio_venta"
                    value={product.precio_venta}
                    onChange={handleChange}
                    style={styles.input}
                    required
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Modelo:</label>
                <input
                    type="text"
                    name="modelo"
                    value={product.modelo}
                    onChange={handleChange}
                    style={styles.input}
                    required
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Medida:</label>
                <input
                    type="text"
                    name="medida"
                    value={product.medida}
                    onChange={handleChange}
                    style={styles.input}
                    required
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Clase:</label>
                <input
                    type="text"
                    name="clase"
                    value={product.clase}
                    onChange={handleChange}
                    style={styles.input}
                    required
                />
            </div>
            <div style={styles.buttonGroup}>
                <button type="submit" style={styles.saveButton}>Guardar</button>
                <button type="button" onClick={onCancel} style={styles.cancelButton}>Cancelar</button>
            </div>
        </form>
    );
};

ProductForm.propTypes = {
    product: PropTypes.shape({
        id: PropTypes.string.isRequired,
        nombre: PropTypes.string.isRequired,
        unidad_medida: PropTypes.string.isRequired,
        stock_inicial: PropTypes.number.isRequired,
        stock_actual: PropTypes.number.isRequired,
        stock_minimo: PropTypes.number.isRequired,
        precio_costo: PropTypes.number.isRequired,
        precio_venta: PropTypes.number.isRequired,
        modelo: PropTypes.string.isRequired,
        medida: PropTypes.string.isRequired,
        clase: PropTypes.string.isRequired,
    }).isRequired,
    setProduct: PropTypes.func.isRequired,
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

export default ProductForm;
