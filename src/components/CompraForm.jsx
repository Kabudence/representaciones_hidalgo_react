
import PropTypes from "prop-types";

const CompraForm = ({ compra, setCompra, onSubmit, onCancel }) => {
    // Manejo de cambios para los campos de la cabecera de la compra
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCompra({ ...compra, [name]: value });
    };

    // Manejo de cambios para cada item de la lista
    const handleItemChange = (index, e) => {
        const { name, value } = e.target;
        const newItemList = compra.ItemList.map((item, idx) =>
            idx === index ? { ...item, [name]: value } : item
        );
        setCompra({ ...compra, ItemList: newItemList });
    };

    // Agregar un nuevo item al ItemList
    const addItem = () => {
        setCompra({
            ...compra,
            ItemList: [
                ...compra.ItemList,
                { producto: "", cantidad: "", precio: "", igv: "" },
            ],
        });
    };

    // Manejo de cambios para los datos del proveedor
    const handleProveedorChange = (e) => {
        const { name, value } = e.target;
        setCompra({
            ...compra,
            proveedor: { ...compra.proveedor, [name]: value },
        });
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit(compra);
            }}
            style={styles.form}
        >
            <h2>Datos de la Compra</h2>
            <div style={styles.formGroup}>
                <label style={styles.label}>Número de Documento:</label>
                <input
                    type="text"
                    name="num_docum"
                    value={compra.num_docum}
                    onChange={handleChange}
                    style={styles.input}
                    required
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>RUC Cliente:</label>
                <input
                    type="text"
                    name="ruc_cliente"
                    value={compra.ruc_cliente}
                    onChange={handleChange}
                    style={styles.input}
                    required
                />
            </div>

            <h3>Ítems de la Compra</h3>
            {compra.ItemList.map((item, index) => (
                <div key={index} style={styles.itemContainer}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Producto:</label>
                        <input
                            type="text"
                            name="producto"
                            value={item.producto}
                            onChange={(e) => handleItemChange(index, e)}
                            style={styles.input}
                            required
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Cantidad:</label>
                        <input
                            type="number"
                            name="cantidad"
                            value={item.cantidad}
                            onChange={(e) => handleItemChange(index, e)}
                            style={styles.input}
                            required
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Precio:</label>
                        <input
                            type="number"
                            name="precio"
                            value={item.precio}
                            onChange={(e) => handleItemChange(index, e)}
                            style={styles.input}
                            required
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>IGV:</label>
                        <input
                            type="number"
                            name="igv"
                            value={item.igv}
                            onChange={(e) => handleItemChange(index, e)}
                            style={styles.input}
                            required
                        />
                    </div>
                    <hr style={{ margin: "10px 0" }} />
                </div>
            ))}
            <button type="button" onClick={addItem} style={styles.addButton}>
                Agregar Ítem
            </button>

            <h3>Datos del Proveedor (Opcional)</h3>
            <div style={styles.formGroup}>
                <label style={styles.label}>RUC:</label>
                <input
                    type="text"
                    name="ruc"
                    value={compra.proveedor?.ruc || ""}
                    onChange={handleProveedorChange}
                    style={styles.input}
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Nombre Proveedor:</label>
                <input
                    type="text"
                    name="nomproveedor"
                    value={compra.proveedor?.nomproveedor || ""}
                    onChange={handleProveedorChange}
                    style={styles.input}
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Dirección:</label>
                <input
                    type="text"
                    name="direccion"
                    value={compra.proveedor?.direccion || ""}
                    onChange={handleProveedorChange}
                    style={styles.input}
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Contacto:</label>
                <input
                    type="text"
                    name="contacto"
                    value={compra.proveedor?.contacto || ""}
                    onChange={handleProveedorChange}
                    style={styles.input}
                />
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

CompraForm.propTypes = {
    compra: PropTypes.shape({
        num_docum: PropTypes.string.isRequired,
        ruc_cliente: PropTypes.string.isRequired,
        ItemList: PropTypes.arrayOf(
            PropTypes.shape({
                producto: PropTypes.string.isRequired,
                cantidad: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
                    .isRequired,
                precio: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
                    .isRequired,
                igv: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
                    .isRequired,
            })
        ).isRequired,
        proveedor: PropTypes.shape({
            ruc: PropTypes.string,
            nomproveedor: PropTypes.string,
            direccion: PropTypes.string,
            contacto: PropTypes.string,
        }),
    }).isRequired,
    setCompra: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

const styles = {
    form: { display: "flex", flexDirection: "column", gap: "15px" },
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
        borderRadius: "5px",
        border: "none",
        cursor: "pointer",
    },
    cancelButton: {
        padding: "10px 20px",
        backgroundColor: "#dc3545",
        color: "white",
        borderRadius: "5px",
        border: "none",
        cursor: "pointer",
    },
    addButton: {
        padding: "10px 20px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        alignSelf: "flex-start",
    },
    itemContainer: {
        border: "1px solid #ccc",
        padding: "10px",
        borderRadius: "5px",
        marginBottom: "10px",
    },
};

export default CompraForm;
