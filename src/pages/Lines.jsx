import { useState, useEffect } from "react";
import Line from "../models/Line";
import LineForm from "../components/LineForm";
import Pagination from "../components/Pagination";
import lineService from "../services/lineService";
import {useNavigate} from "react-router-dom";

const Lines = () => {
    const [lines, setLines] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formType, setFormType] = useState("Agregar");
    const [currentLine, setCurrentLine] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isAuthorized, setIsAuthorized] = useState(false);

    const itemsPerPage = 10;
    const navigate = useNavigate(); // Hook para redirección

    useEffect(() => {
        // Obtener authData desde sessionStorage
        const storedAuthData = sessionStorage.getItem("authData");
        if (storedAuthData) {
            try {
                const parsedAuthData = JSON.parse(storedAuthData);
                console.log("AuthData cargado:", parsedAuthData);

                if (parsedAuthData.role === "admin") {
                    setIsAuthorized(true); // Usuario autorizado
                } else {
                    console.warn("Acceso denegado: Usuario no es admin");
                    navigate("/no-autorizado"); // Redirigir si no es admin
                }
            } catch (error) {
                console.error("Error parseando authData:", error);
                navigate("/login"); // Si hay error, enviarlo al login
            }
        } else {
            console.warn("No se encontró authData en sessionStorage");
            navigate("/login"); // Si no hay authData, redirigir al login
        }

        // Si el usuario es admin, cargar las líneas
        if (isAuthorized) {
            lineService
                .getAll()
                .then((data) => {
                    console.log("Lines -> useEffect -> data:", data);
                    setLines(data);
                })
                .catch((err) => console.error("Error fetching lines:", err));
        }
    }, [isAuthorized, navigate]);

    // Si el usuario no está autorizado, no renderizar la página
    if (!isAuthorized) {
        return <div>Cargando...</div>;
    }
    // Filtrado según searchTerm
    const filteredLines = lines.filter((line) =>
        line.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Paginación
    const totalPages = Math.ceil(filteredLines.length / itemsPerPage);
    const paginatedLines = filteredLines.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Abrir modal
    const handleOpenModal = (type, line = null) => {
        setFormType(type);

        if (type === "Agregar") {
            // Creamos un line por defecto con estado="1" (Activo)
            // y idemp como string (p.ej. "1")
            setCurrentLine(new Line(null, "", "1", "1"));
        } else if (line) {
            // Clonamos la línea (para no mutar directamente)
            setCurrentLine(
                new Line(line.idlinea, line.nombre, line.estado, line.idemp)
            );
        }

        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleFormSubmit = (formData) => {
        console.log("handleFormSubmit -> formData:", formData);
        // Convertir a un objeto Line
        const finalLine = new Line(
            formData.idlinea ? Number(formData.idlinea) : null,
            formData.nombre,
            formData.estado,
            formData.idemp // ya es un string
        );

        try {
            Line.validate(finalLine);

            if (formType === "Agregar") {
                // CREATE
                lineService
                    .create(finalLine)
                    .then((newLine) => {
                        console.log("Lines -> created line:", newLine);
                        setLines([...lines, newLine]);
                        setShowModal(false);
                    })
                    .catch((err) => {
                        console.error("Error creating line:", err);
                    });
            } else {
                // EDIT / UPDATE
                if (!finalLine.idlinea) {
                    console.error("No se puede editar si 'idlinea' es null.");
                    return;
                }
                lineService
                    .update(finalLine.idlinea, finalLine)
                    .then((updated) => {
                        console.log("Lines -> updated line:", updated);
                        const updatedList = lines.map((item) =>
                            item.idlinea === updated.idlinea ? updated : item
                        );
                        setLines(updatedList);
                        setShowModal(false);
                    })
                    .catch((err) => {
                        console.error("Error updating line:", err);
                    });
            }
        } catch (validationErr) {
            alert(validationErr.message);
        }
    };

    const handleDelete = (idlinea) => {
        if (!window.confirm("¿Seguro que deseas eliminar esta línea?")) {
            return;
        }
        lineService
            .remove(idlinea)
            .then((res) => {
                console.log("Lines -> removed line, server response:", res);
                const newList = lines.filter((line) => line.idlinea !== idlinea);
                setLines(newList);
            })
            .catch((err) => console.error("Error deleting line:", err));
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    if (!lines) {
        return <div>Cargando...</div>;
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Lista de Líneas</h1>

            <div style={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Buscar línea..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.searchInput}
                />
                <button onClick={() => handleOpenModal("Agregar")} style={styles.addButton}>
                    Agregar Línea
                </button>
            </div>

            <table style={styles.table}>
                <thead>
                <tr style={styles.tableHeader}>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>ID Empresa</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {paginatedLines.map((line) => (
                    <tr key={line.idlinea} style={styles.tableRow}>
                        <td style={styles.tableCell}>{line.idlinea}</td>
                        <td style={styles.tableCell}>{line.nombre}</td>
                        <td style={styles.tableCell}>{line.idemp}</td>
                        <td style={styles.tableCell}>
                            {/* Mostrar "Activo" o "Inactivo" */}
                            {line.estado === "1" ? (
                                <span style={{ color: "green" }}>Activo</span>
                            ) : (
                                <span style={{ color: "red" }}>Inactivo</span>
                            )}
                        </td>
                        <td style={styles.tableCell}>
                            <button
                                style={styles.editButton}
                                onClick={() => handleOpenModal("Editar", line)}
                            >
                                Editar
                            </button>
                            <button
                                style={styles.deleteButton}
                                onClick={() => handleDelete(line.idlinea)}
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

            {/* Modal emergente */}
            {showModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <h2>{formType} Línea</h2>
                        <LineForm
                            line={currentLine}
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
        flex: 1,
        marginRight: "10px",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "5px",
    },
    addButton: {
        padding: "10px 20px",
        backgroundColor: "#524b4a",
        color: "white",
        border: "none",
        cursor: "pointer",
        borderRadius: "5px",
        fontWeight: "bold",
        minWidth: "120px",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        marginTop: "20px",
        backgroundColor: "white",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        tableLayout: "fixed",
    },
    tableHeader: {
        backgroundColor: "#e0e0e0",
        fontWeight: "bold",
    },
    tableRow: {
        borderBottom: "1px solid #ccc",
    },
    tableCell: {
        padding: "10px 15px",
        textAlign: "left",
        fontSize: "14px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
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
        zIndex: 999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    modal: {
        backgroundColor: "#fff",
        padding: "30px",
        borderRadius: "8px",
        width: "400px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.3)",
    },
};

export default Lines;
