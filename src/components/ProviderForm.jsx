import PropTypes from "prop-types";
import { useState } from "react";

const estadoOptions = [
    { value: "1", label: "Activo" },
    { value: "2", label: "Inactivo" },
];

const ProviderForm = ({ provider, onSubmit, onCancel }) => {
    const [localProvider, setLocalProvider] = useState(provider);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocalProvider({ ...localProvider, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit(localProvider);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
                <label style={styles.label}>RUC:</label>
                <input
                    type="text"
                    name="ruc"
                    value={localProvider.ruc}
                    onChange={handleChange}
                    style={styles.input}
                    required
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Nombre:</label>
                <input
                    type="text"
                    name="nomproveedor"
                    value={localProvider.nomproveedor}
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
                    value={localProvider.direccion}
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
                    value={localProvider.telefono}
                    onChange={handleChange}
                    style={styles.input}
                    required
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Celular:</label>
                <input
                    type="text"
                    name="celular"
                    value={localProvider.celular}
                    onChange={handleChange}
                    style={styles.input}
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Contacto:</label>
                <input
                    type="text"
                    name="contacto"
                    value={localProvider.contacto}
                    onChange={handleChange}
                    style={styles.input}
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Correo:</label>
                <input
                    type="email"
                    name="correo"
                    value={localProvider.correo}
                    onChange={handleChange}
                    style={styles.input}
                    required
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Estado:</label>
                <select
                    name="estado"
                    value={localProvider.estado}
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

ProviderForm.propTypes = {
    provider: PropTypes.shape({
        ruc: PropTypes.string.isRequired,
        nomproveedor: PropTypes.string.isRequired,
        direccion: PropTypes.string.isRequired,
        telefono: PropTypes.string.isRequired,
        celular: PropTypes.string,
        contacto: PropTypes.string,
        correo: PropTypes.string.isRequired,
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

export default ProviderForm;
