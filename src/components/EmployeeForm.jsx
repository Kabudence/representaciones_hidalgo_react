import PropTypes from "prop-types";

const estadoOptions = [
    { value: "1", label: "Activo" },
    { value: "2", label: "Inactivo" },
];

const EmployeeForm = ({ employee, setEmployee, onSubmit, onCancel }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee({ ...employee, [name]: value });
    };

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            onSubmit(employee);
        }} style={styles.form}>
            <div style={styles.formGroup}>
                <label style={styles.label}>Nombre:</label>
                <input
                    type="text"
                    name="nombre"
                    value={employee.nombre}
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
                    value={employee.direccion}
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
                    value={employee.telefono}
                    onChange={handleChange}
                    style={styles.input}
                    required
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Correo:</label>
                <input
                    type="email"
                    name="correo"
                    value={employee.correo}
                    onChange={handleChange}
                    style={styles.input}
                    required
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>ID Empresa (idemp):</label>
                <input
                    type="number"
                    name="idemp"
                    value={employee.idemp || ""}
                    onChange={handleChange}
                    style={styles.input}
                    required
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>ID Vendedor (idvend):</label>
                <input
                    type="number"
                    name="idvend"
                    value={employee.idvend || ""}
                    onChange={handleChange}
                    style={styles.input}
                    required
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Estado:</label>
                <select
                    name="estado"
                    value={employee.estado}
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

EmployeeForm.propTypes = {
    employee: PropTypes.shape({
        nombre: PropTypes.string.isRequired,
        direccion: PropTypes.string.isRequired,
        telefono: PropTypes.string.isRequired,
        correo: PropTypes.string.isRequired,
        idemp: PropTypes.number.isRequired,
        idvend: PropTypes.number.isRequired,
        estado: PropTypes.string.isRequired,
    }).isRequired,
    setEmployee: PropTypes.func.isRequired,
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

export default EmployeeForm;
