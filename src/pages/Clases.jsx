import { useState, useEffect } from "react";
import Clase from "../models/Clase";
import ClaseForm from "../components/ClaseForm";
import Pagination from "../components/Pagination";
import claseService from "../services/claseService";

const Clases = () => {
    const [clases, setClases] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formType, setFormType] = useState("Agregar");
    const [currentClase, setCurrentClase] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 10;

    useEffect(() => {
        claseService
            .getAll()
            .then((data) => {
                console.log("Clases -> useEffect -> data:", data);
                setClases(data);
            })
            .catch((err) => console.error("Error fetching clases:", err));
    }, []);

    // Filtrado según searchTerm
    const filteredClases = clases.filter((clase) =>
        clase.nombres.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Paginación
    const totalPages = Math.ceil(filteredClases.length / itemsPerPage);
    const paginatedClases = filteredClases.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Abrir modal
    const handleOpenModal = (type, clase = null) => {
        setFormType(type);

        if (type === "Agregar") {
            setCurrentClase(new Clase(null, "", "1", "1"));
        } else if (clase) {
            setCurrentClase(
                new Clase(clase.idclase, clase.nombres, clase.idemp, clase.estado)
            );
        }

        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleFormSubmit = (formData) => {
        console.log("handleFormSubmit -> formData:", formData);
        const finalClase = new Clase(
            formData.idclase ? Number(formData.idclase) : null,
            formData.nombres,
            formData.idemp,
            formData.estado
        );

        try {
            Clase.validate(finalClase);

            if (formType === "Agregar") {
                // CREATE
                claseService
                    .create(finalClase)
                    .then((newClase) => {
                        console.log("Clases -> created clase:", newClase);
                        setClases([...clases, newClase]);
                        setShowModal(false);
                    })
                    .catch((err) => {
                        console.error("Error creating clase:", err);
                    });
            } else {
                // EDIT / UPDATE
                if (!finalClase.idclase) {
                    console.error("No se puede editar si 'idclase' es null.");
                    return;
                }
                claseService
                    .update(finalClase.idclase, finalClase)
                    .then((updated) => {
                        console.log("Clases -> updated clase:", updated);
                        const updatedList = clases.map((item) =>
                            item.idclase === updated.idclase ? updated : item
                        );
                        setClases(updatedList);
                        setShowModal(false);
                    })
                    .catch((err) => {
                        console.error("Error updating clase:", err);
                    });
            }
        } catch (validationErr) {
            alert(validationErr.message);
        }
    };

    const handleDelete = (idclase) => {
        if (!window.confirm("¿Seguro que deseas eliminar esta clase?")) {
            return;
        }
        claseService
            .remove(idclase)
            .then((res) => {
                console.log("Clases -> removed clase, server response:", res);
                const newList = clases.filter((clase) => clase.idclase !== idclase);
                setClases(newList);
            })
            .catch((err) => console.error("Error deleting clase:", err));
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    if (!clases) {
        return <div>Cargando...</div>;
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Lista de Clases</h1>

            <div style={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Buscar clase..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.searchInput}
                />
                <button onClick={() => handleOpenModal("Agregar")} style={styles.addButton}>
                    Agregar Clase
                </button>
            </div>

            <table style={styles.table}>
                <thead>
                <tr style={styles.tableHeader}>
                    <th>ID</th>
                    <th>Nombres</th>
                    <th>ID Empresa</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {paginatedClases.map((clase) => (
                    <tr key={clase.idclase} style={styles.tableRow}>
                        <td style={styles.tableCell}>{clase.idclase}</td>
                        <td style={styles.tableCell}>{clase.nombres}</td>
                        <td style={styles.tableCell}>{clase.idemp}</td>
                        <td style={styles.tableCell}>
                            {clase.estado === "1" ? (
                                <span style={{ color: "green" }}>Activo</span>
                            ) : (
                                <span style={{ color: "red" }}>Inactivo</span>
                            )}
                        </td>
                        <td style={styles.tableCell}>
                            <button
                                style={styles.editButton}
                                onClick={() => handleOpenModal("Editar", clase)}
                            >
                                Editar
                            </button>
                            <button
                                style={styles.deleteButton}
                                onClick={() => handleDelete(clase.idclase)}
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
                        <h2>{formType} Clase</h2>
                        <ClaseForm
                            clase={currentClase}
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

export default Clases;
