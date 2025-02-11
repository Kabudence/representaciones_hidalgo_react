import React from "react";
import PropTypes from "prop-types";

// Mapeo para el dropdown de estado
const estadoOptions = [
    { value: "1", label: "Activo" },
    { value: "2", label: "Inactivo" },
];

const LineForm = ({ line, onSubmit, onCancel }) => {
    const [localLine, setLocalLine] = React.useState(line);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocalLine({ ...localLine, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Creamos el "transformedLine" con la info del formulario
        const transformedLine = { ...localLine };

        if (onSubmit && typeof onSubmit === "function") {
            onSubmit(transformedLine);
        } else {
            console.error("onSubmit no está definido o no es una función.");
        }
    };

    return (
        <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
                <label style={styles.label}>Nombre:</label>
                <input
                    type="text"
                    name="nombre"
                    value={localLine.nombre}
                    onChange={handleChange}
                    style={styles.input}
                    required
                />
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>Estado:</label>
                <select
                    name="estado"
                    value={localLine.estado}
                    onChange={handleChange}
                    style={styles.select}
                    required
                >
                    {estadoOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>ID Empresa:</label>
                {/* Maneja idemp como string (type="text") */}
                <input
                    type="text"
                    name="idemp"
                    value={localLine.idemp}
                    onChange={handleChange}
                    style={styles.input}
                    required
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

LineForm.propTypes = {
    line: PropTypes.shape({
        idlinea: PropTypes.oneOfType([PropTypes.number, PropTypes.null]),
        nombre: PropTypes.string.isRequired,
        estado: PropTypes.oneOf(["1", "2"]).isRequired, // "1"=Activo,"2"=Inactivo
        // idemp como string
        idemp: PropTypes.string.isRequired,
    }).isRequired,
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
