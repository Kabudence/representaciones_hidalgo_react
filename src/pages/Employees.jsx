// Employees.jsx
import { useState, useEffect } from "react";
import Employee from "../models/Employee";
import EmployeeForm from "../components/EmployeeForm.jsx";
import Pagination from "../components/Pagination";
import employeeService from "../services/employeeService";
import {useNavigate} from "react-router-dom";

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formType, setFormType] = useState("Agregar");
    const [currentEmployee, setCurrentEmployee] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const navigate = useNavigate();
    const itemsPerPage = 10;


    useEffect(() => {
        // Obtener authData desde sessionStorage
        const storedAuthData = sessionStorage.getItem("authData");

        if (storedAuthData) {
            try {
                const parsedAuthData = JSON.parse(storedAuthData);
                console.log("AuthData cargado:", parsedAuthData);

                if (parsedAuthData.role === "admin") {
                    setIsAuthorized(true);
                } else {
                    console.warn("Acceso denegado: Usuario no es admin");
                    navigate("/no-autorizado");
                }
            } catch (error) {
                console.error("Error parseando authData:", error);
                navigate("/login");
            }
        } else {
            console.warn("No se encontró authData en sessionStorage");
            navigate("/login");
        }
    }, [navigate]);

    useEffect(() => {
        if (isAuthorized) {
            employeeService.getAll()
                .then((data) => {
                    const employeeObjects = data.map(
                        (e) =>
                            new Employee(
                                e.idvend,
                                e.nomvendedor,
                                e.direccion,
                                e.telefono,
                                e.correo,
                                e.idemp,
                                e.estado
                            )
                    );
                    setEmployees(employeeObjects);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching employees:", error);
                    setLoading(false);
                });
        }
    }, [isAuthorized]);

    if (!isAuthorized) {
        return <div>Cargando autenticación...</div>;
    }
    const filteredEmployees = employees.filter(
        (employee) =>
            employee.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

    const paginatedEmployees = filteredEmployees.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleOpenModal = (type, employee = null) => {
        setFormType(type);
        setCurrentEmployee(
            employee || new Employee("", "", "", "", "", "", "1")
        );
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleFormSubmit = (employeeData) => {
        try {
            Employee.validate(employeeData);

            const payload = {
                idvend: employeeData.idvend,
                nomvendedor: employeeData.nombre,
                direccion: employeeData.direccion,
                telefono: employeeData.telefono,
                correo: employeeData.correo,
                idemp: employeeData.idemp,
                estado: employeeData.estado,
            };

            // Log del payload que se enviará
            console.log("Payload enviado al backend:", payload);

            if (formType === "Agregar") {
                employeeService
                    .create(payload)
                    .then((newEmployee) => {
                        console.log("Respuesta del backend al crear:", newEmployee);
                        setEmployees([
                            ...employees,
                            new Employee(
                                newEmployee.idvend,
                                newEmployee.nomvendedor,
                                newEmployee.direccion,
                                newEmployee.telefono,
                                newEmployee.correo,
                                newEmployee.idemp,
                                newEmployee.estado
                            ),
                        ]);
                        handleCloseModal();
                    })
                    .catch((error) => {
                        console.error("Error creando el empleado:", error);
                    });
            } else {
                employeeService
                    .update(employeeData.id, payload)
                    .then((updatedEmployee) => {
                        console.log("Respuesta del backend al actualizar:", updatedEmployee);
                        setEmployees(
                            employees.map((emp) =>
                                emp.id === employeeData.id
                                    ? new Employee(
                                        updatedEmployee.idvend,
                                        updatedEmployee.nomvendedor,
                                        updatedEmployee.direccion,
                                        updatedEmployee.telefono,
                                        updatedEmployee.correo,
                                        updatedEmployee.idemp,
                                        updatedEmployee.estado
                                    )
                                    : emp
                            )
                        );
                        handleCloseModal();
                    })
                    .catch((error) => {
                        console.error("Error actualizando el empleado:", error);
                    });
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDelete = (id) => {
        employeeService
            .delete(id)
            .then(() => {
                setEmployees(employees.filter((employee) => employee.id !== id));
            })
            .catch((error) => console.error("Error deleting employee:", error));
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    if (loading) {
        return <div>Cargando empleados...</div>;
    }

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
                        <td style={styles.tableCell}>{employee.nombre}</td>
                        <td style={styles.tableCell}>{employee.direccion}</td>
                        <td style={styles.tableCell}>{employee.telefono}</td>
                        <td style={styles.tableCell}>{employee.correo}</td>
                        <td
                            style={{
                                ...styles.tableCell,
                                color: employee.estado === "1" ? "green" : "red",
                            }}
                        >
                            {employee.estado === "1" ? "Activo" : "Inactivo"}
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
