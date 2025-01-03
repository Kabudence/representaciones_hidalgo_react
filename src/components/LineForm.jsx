import PropTypes from "prop-types";

const LineForm = ({ line, setLine, onSubmit, onCancel }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setLine({ ...line, [name]: value });
    };

    return (
        <form onSubmit={onSubmit} style={styles.form}>
            <div style={styles.formGroup}>
                <label style={styles.label}>Nombre:</label>
                <input
                    type="text"
                    name="nombre"
                    value={line.nombre}
                    onChange={handleChange}
                    style={styles.input}
                    required
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Estado:</label>
                <select
                    name="estado"
                    value={line.estado}
                    onChange={handleChange}
                    style={styles.select}
                    required
                >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                </select>
            </div>
            <div style={styles.buttonGroup}>
                <button type="submit" style={styles.saveButton}>Guardar</button>
                <button type="button" onClick={onCancel} style={styles.cancelButton}>Cancelar</button>
            </div>
        </form>
    );
};

LineForm.propTypes = {
    line: PropTypes.shape({
        id: PropTypes.number,
        nombre: PropTypes.string.isRequired,
        estado: PropTypes.oneOf(["Activo", "Inactivo"]).isRequired,
    }).isRequired,
    setLine: PropTypes.func.isRequired,
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

export default LineForm;
