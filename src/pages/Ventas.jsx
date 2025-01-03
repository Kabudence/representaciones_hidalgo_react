import { useState } from "react";
import Venta from "../models/Venta";
import VentaForm from "../components/VentaForm.jsx";

const Ventas = () => {
    const [ventas, setVentas] = useState([
        new Venta(
            1,
            "2025-01-02",
            "Ingreso",
            "Directa",
            "001-0001",
            "Carlos Gómez",
            500.0,
            90.0,
            590.0,
            "PROCESADA"
        ),
        new Venta(
            2,
            "2025-01-01",
            "Egreso",
            "Online",
            "001-0002",
            "Mariana Torres",
            300.0,
            54.0,
            354.0,
            "PENDIENTE"
        ),
    ]);

    const [showModal, setShowModal] = useState(false);
    const [formType, setFormType] = useState("Agregar");
    const [currentVenta, setCurrentVenta] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredVentas = ventas.filter(
        (venta) =>
            venta.numeroComprobante.toLowerCase().includes(searchTerm.toLowerCase()) ||
            venta.cliente.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenModal = (type, venta = null) => {
        setFormType(type);
        setCurrentVenta(
            venta ||
            new Venta(ventas.length + 1, "", "", "", "", "", 0, 0, 0, "PROCESADA")
        );
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        try {
            Venta.validate(currentVenta);
            if (formType === "Agregar") {
                setVentas([...ventas, currentVenta]);
            } else {
                setVentas(
                    ventas.map((v) => (v.id === currentVenta.id ? currentVenta : v))
                );
            }
            handleCloseModal();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDelete = (id) => {
        setVentas(ventas.filter((venta) => venta.id !== id));
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Lista de Ventas</h1>
            <div style={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Buscar venta..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.searchInput}
                />
                <button onClick={() => handleOpenModal("Agregar")} style={styles.addButton}>
                    Agregar Venta
                </button>
            </div>
            <table style={styles.table}>
                <thead>
                <tr style={styles.tableHeader}>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>Tipo Movimiento</th>
                    <th>Tipo Venta</th>
                    <th>Número Comprobante</th>
                    <th>Cliente</th>
                    <th>Valor de Venta</th>
                    <th>IGV</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {filteredVentas.map((venta) => (
                    <tr key={venta.id} style={styles.tableRow}>
                        <td style={styles.tableCell}>{venta.id}</td>
                        <td style={styles.tableCell}>{venta.fecha}</td>
                        <td style={styles.tableCell}>{venta.tipoMovimiento}</td>
                        <td style={styles.tableCell}>{venta.tipoVenta}</td>
                        <td style={styles.tableCell}>{venta.numeroComprobante}</td>
                        <td style={styles.tableCell}>{venta.cliente}</td>
                        <td style={styles.tableCell}>{venta.valorVenta.toFixed(2)}</td>
                        <td style={styles.tableCell}>{venta.igv.toFixed(2)}</td>
                        <td style={styles.tableCell}>{venta.total.toFixed(2)}</td>
                        <td
                            style={{
                                ...styles.tableCell,
                                color: venta.estado === "PROCESADA" ? "green" : "red",
                                fontWeight: "bold",
                            }}
                        >
                            {venta.estado}
                        </td>
                        <td style={styles.tableCell}>
                            <button
                                onClick={() => handleOpenModal("Editar", venta)}
                                style={styles.editButton}
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => handleDelete(venta.id)}
                                style={styles.deleteButton}
                            >
                                Eliminar
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {showModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <h2>{formType} Venta</h2>
                        <VentaForm
                            venta={currentVenta}
                            setVenta={setCurrentVenta}
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
        width: "80%",
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
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        marginTop: "20px",
        backgroundColor: "white",
        borderRadius: "8px",
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
    },
    deleteButton: {
        backgroundColor: "#dc3545",
        color: "white",
        border: "none",
        padding: "8px 16px",
        cursor: "pointer",
        borderRadius: "5px",
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
    },
};

export default Ventas;
