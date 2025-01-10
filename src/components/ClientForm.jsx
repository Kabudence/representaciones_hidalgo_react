import React from "react";
import PropTypes from "prop-types";

const estadoOptions = [
    { value: "1", label: "Activo" },
    { value: "2", label: "Inactivo" },
];

const ClientForm = ({ client, onSubmit, onCancel }) => {
    const [localClient, setLocalClient] = React.useState(client);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocalClient({ ...localClient, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Convertimos 'estado' a número
        const transformedClient = {
            ...localClient,
        };

        if (onSubmit && typeof onSubmit === "function") {
            onSubmit(transformedClient);
        } else {
            console.error("onSubmit no está definido o no es una función.");
        }
    };

    return (
        <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
                <label style={styles.label}>ID Cliente:</label>
                <input
                    type="text"
                    name="idcliente"
                    value={localClient.idcliente}
                    onChange={handleChange}
                    style={styles.input}
                    required
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Tipo Documento:</label>
                <input
                    type="text"
                    name="tdoc"
                    value={localClient.tdoc}
                    onChange={handleChange}
                    style={styles.input}
                    required
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Nombre:</label>
                <input
                    type="text"
                    name="nomcliente"
                    value={localClient.nomcliente}
                    onChange={handleChange}
                    style={styles.input}
                    required
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Dirección:</label>
                <input
                    type="text"
                    name="direccion"
                    value={localClient.direccion}
                    onChange={handleChange}
                    style={styles.input}
                    required
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Teléfono:</label>
                <input
                    type="text"
                    name="telefono"
                    value={localClient.telefono}
                    onChange={handleChange}
                    style={styles.input}
                    required
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Estado:</label>
                <select
                    name="estado"
                    value={localClient.estado}
                    onChange={handleChange}
                    style={styles.select}
                    required
                >
                    {estadoOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
            <div style={styles.buttonGroup}>
                <button type="submit" style={styles.saveButton}>
                    Guardar
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    style={styles.cancelButton}
                >
                    Cancelar
                </button>
            </div>
        </form>
    );
};

ClientForm.propTypes = {
    client: PropTypes.shape({
        idcliente: PropTypes.string.isRequired,
        tdoc: PropTypes.string.isRequired,
        nomcliente: PropTypes.string.isRequired,
        direccion: PropTypes.string.isRequired,
        telefono: PropTypes.string.isRequired,
        estado: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
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

export default ClientForm;
