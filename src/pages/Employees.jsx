import { useState } from "react";
import Employee from "../models/Employee";
import EmployeeForm from "../components/EmployeeForm.jsx";
import Pagination from "../components/Pagination";

const Employees = () => {
    const [employees, setEmployees] = useState([
        new Employee(1, "EMP001", "Juan Pérez", "Calle 123", "987654321", "juan.perez@example.com", "Activo"),
        new Employee(2, "EMP002", "María López", "Calle 456", "987123456", "maria.lopez@example.com", "Inactivo"),
        // Generar datos de prueba adicionales
        ...Array.from({ length: 100 }, (_, i) =>
            new Employee(i + 3, `EMP00${i + 3}`, `Empleado ${i + 3}`, `Calle ${i + 3}`, "987654321", "Activo")
        ),
    ]);

    const [showModal, setShowModal] = useState(false);
    const [formType, setFormType] = useState("Agregar");
    const [currentEmployee, setCurrentEmployee] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 10;

    const filteredEmployees = employees.filter(
        (employee) =>
            employee.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

    const paginatedEmployees = filteredEmployees.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleOpenModal = (type, employee = null) => {
        setFormType(type);
        setCurrentEmployee(
            employee || new Employee(employees.length + 1, "", "", "", "", "", "Activo")
        );
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        try {
            Employee.validate(currentEmployee);
            if (formType === "Agregar") {
                setEmployees([...employees, currentEmployee]);
            } else {
                setEmployees(
                    employees.map((emp) => (emp.id === currentEmployee.id ? currentEmployee : emp))
                );
            }
            handleCloseModal();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDelete = (id) => {
        setEmployees(employees.filter((employee) => employee.id !== id));
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Lista de Empleados</h1>
            <div style={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Buscar empleado..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.searchInput}
                />
                <button onClick={() => handleOpenModal("Agregar")} style={styles.addButton}>
                    Agregar Empleado
                </button>
            </div>
            <table style={styles.table}>
                <thead>
                <tr style={styles.tableHeader}>
                    <th>ID</th>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Dirección</th>
                    <th>Teléfono</th>
                    <th>Correo</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {paginatedEmployees.map((employee) => (
                    <tr key={employee.id} style={styles.tableRow}>
                        <td style={styles.tableCell}>{employee.id}</td>
                        <td style={styles.tableCell}>{employee.codigo}</td>
                        <td style={styles.tableCell}>{employee.nombre}</td>
                        <td style={styles.tableCell}>{employee.direccion}</td>
                        <td style={styles.tableCell}>{employee.telefono}</td>
                        <td style={styles.tableCell}>{employee.correo}</td>
                        <td
                            style={{
                                ...styles.tableCell,
                                ...(employee.estado === "Activo" ? styles.active : styles.inactive),
                            }}
                        >
                            {employee.estado}
                        </td>
                        <td style={styles.tableCell}>
                            <button
                                onClick={() => handleOpenModal("Editar", employee)}
                                style={styles.editButton}
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => handleDelete(employee.id)}
                                style={styles.deleteButton}
                            >
                                Eliminar
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />
            {showModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <h2>{formType} Empleado</h2>
                        <EmployeeForm
                            employee={currentEmployee}
                            setEmployee={setCurrentEmployee}
                            onSubmit={handleFormSubmit}
                            onCancel={handleCloseModal}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: "#f2f2f2",
        padding: "20px",
        margin: "10px auto",
        maxWidth: "90%",
        borderRadius: "8px",
        paddingBottom: "30px",
    },
    title: {
        marginBottom: "15px",
        fontFamily: "'PT Sans Narrow', sans-serif",
        fontSize: "50px",
    },
    searchContainer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
    },
    searchInput: {
        width: "80%",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "5px",
    },
    addButton: {
        width: "15%",
        padding: "10px",
        backgroundColor: "#524b4a",
        color: "white",
        border: "none",
        cursor: "pointer",
        borderRadius: "5px",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        marginTop: "20px",
        backgroundColor: "white",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    },
    tableHeader: {
        backgroundColor: "#e0e0e0",
        fontWeight: "bold",
        textAlign: "left",
    },
    tableRow: {
        borderBottom: "1px solid #ccc",
    },
    tableCell: {
        padding: "15px 10px",
        textAlign: "left",
    },
    active: {
        color: "green",
        fontWeight: "bold",
    },
    inactive: {
        color: "red",
        fontWeight: "bold",
    },
    editButton: {
        backgroundColor: "#ffc107",
        color: "black",
        border: "none",
        padding: "8px 16px",
        cursor: "pointer",
        borderRadius: "5px",
        marginRight: "5px",
        fontWeight: "bold",
    },
    deleteButton: {
        backgroundColor: "#dc3545",
        color: "white",
        border: "none",
        padding: "8px 16px",
        cursor: "pointer",
        borderRadius: "5px",
        fontWeight: "bold",
    },
    modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    modal: {
        backgroundColor: "white",
        padding: "30px",
        borderRadius: "8px",
        width: "400px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.3)",
    },
};

export default Employees;
