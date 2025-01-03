import { useState } from "react";
import Line from "../models/Line";
import LineForm from "../components/LineForm.jsx";
import Pagination from "../components/Pagination";

const Lines = () => {
    const [lines, setLines] = useState([
        new Line(1, "Línea 1", "Activo"),
        new Line(2, "Línea 2", "Inactivo"),
        ...Array.from({ length: 100 }, (_, i) =>
            new Line(i + 3, `Línea ${i + 3}`, i % 2 === 0 ? "Activo" : "Inactivo")
        ),
    ]);

    const [showModal, setShowModal] = useState(false);
    const [formType, setFormType] = useState("Agregar");
    const [currentLine, setCurrentLine] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 10;

    const filteredLines = lines.filter((line) =>
        line.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredLines.length / itemsPerPage);

    const paginatedLines = filteredLines.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleOpenModal = (type, line = null) => {
        setFormType(type);
        setCurrentLine(line || new Line(lines.length + 1, "", "Activo"));
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        try {
            Line.validate(currentLine);
            if (formType === "Agregar") {
                setLines([...lines, currentLine]);
            } else {
                setLines(
                    lines.map((line) => (line.id === currentLine.id ? currentLine : line))
                );
            }
            handleCloseModal();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDelete = (id) => {
        setLines(lines.filter((line) => line.id !== id));
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

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
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {paginatedLines.map((line) => (
                    <tr key={line.id} style={styles.tableRow}>
                        <td style={styles.tableCell}>{line.id}</td>
                        <td style={styles.tableCell}>{line.nombre}</td>
                        <td
                            style={{
                                ...styles.tableCell,
                                color: line.estado === "Activo" ? "green" : "red",
                                fontWeight: "bold",
                            }}
                        >
                            {line.estado}
                        </td>
                        <td style={styles.tableCell}>
                            <button
                                onClick={() => handleOpenModal("Editar", line)}
                                style={styles.editButton}
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => handleDelete(line.id)}
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
                        <h2>{formType} Línea</h2>
                        <LineForm
                            line={currentLine}
                            setLine={setCurrentLine}
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
        padding: "10px",
        backgroundColor: "#524b4a",
        color: "white",
        border: "none",
        cursor: "pointer",
        borderRadius: "5px",
        fontWeight: "bold",
        minWidth: "120px",
        textAlign: "center",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        marginTop: "20px",
        backgroundColor: "white",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        tableLayout: "fixed", // Asegura una distribución uniforme
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
        padding: "10px 15px",
        textAlign: "left",
        fontSize: "14px",
        whiteSpace: "nowrap", // Previene que el texto se desborde
        overflow: "hidden",
        textOverflow: "ellipsis",
        paddingLeft: "5px"
    },
    wideCell: {
        width: "50%", // Aplica solo a columnas amplias, como "Nombre"
    },
    narrowCell: {
        width: "15%", // Aplica a columnas como "Estado"
    },
    active: {
        color: "green",
        fontWeight: "bold",
        textAlign: "center",
    },
    inactive: {
        color: "red",
        fontWeight: "bold",
        textAlign: "center",
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
        minWidth: "70px",
    },
    deleteButton: {
        backgroundColor: "#dc3545",
        color: "white",
        border: "none",
        padding: "8px 16px",
        cursor: "pointer",
        borderRadius: "5px",
        fontWeight: "bold",
        minWidth: "70px",
    },
};

export default Lines;
