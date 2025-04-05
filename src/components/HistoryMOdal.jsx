import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import historialService from "../services/historialService";
import { FiArrowDown, FiArrowUp } from "react-icons/fi";

const HistoryModal = ({ idprod, onClose }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await historialService.getByProductId(idprod);
                console.log("Historial obtenido:", data);
                // Ordenamos en forma ascendente (más antiguo primero)
                const sortedAsc = data.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
                // Ya no se calcula el stock acumulado, simplemente se asigna st_act
                const computedHistory = sortedAsc.map((item) => {
                    return { ...item, computedStock: item.st_act };
                });
                // Invertimos para mostrar el historial de más reciente a más antiguo
                setHistory(computedHistory.reverse());
            } catch (error) {
                console.error("Error obteniendo historial:", error);
            } finally {
                setLoading(false);
            }
        };

        if (idprod) fetchHistory();
    }, [idprod]);


    return (
        <div style={styles.modalOverlay}>
            <div style={styles.modal}>
                <div style={styles.header}>
                    <h2 style={styles.title}>HISTORIAL DE MOVIMIENTOS</h2>
                    <button onClick={onClose} style={styles.closeButton}>
                        &times;
                    </button>
                </div>

                {loading ? (
                    <div style={styles.loadingContainer}>
                        <div style={styles.spinner}></div>
                        <p>Cargando registros...</p>
                    </div>
                ) : (
                    <div style={styles.tableContainer}>
                        <table style={styles.table}>
                            <thead>
                            <tr style={styles.tableHeader}>
                                <th style={styles.th}>FECHA</th>
                                <th style={styles.th}>DOCUMENTO</th>
                                <th style={styles.th}>PRODUCTO</th>
                                <th style={styles.th}>CANTIDAD</th>
                                <th style={styles.th}>STOCK ACTUAL</th>
                            </tr>
                            </thead>
                            <tbody>
                            {history.map((item, index) => {
                                // Conservamos la inversión visual de filas y flechas (tal como la tenías)
                                const isEntrada = item.tipMov === 1;
                                return (
                                    <tr key={index} style={isEntrada ? styles.salidaRow : styles.entradaRow}>
                                        <td style={styles.td}>
                                            {new Date(item.fecha).toLocaleDateString("es-PE")}
                                        </td>
                                        <td style={styles.td}>{item.numDocum || "-"}</td>
                                        <td style={styles.td}>
                                            <div style={styles.productCell}>
                                                <span style={styles.productCode}>{item.idProd}</span>
                                                <span style={styles.productName}>{item.nomProducto}</span>
                                            </div>
                                        </td>
                                        <td style={styles.td}>
                                            <div style={styles.quantityCell}>
                                                {isEntrada ? (
                                                    <FiArrowDown style={{ ...styles.icon, color: "#c62828" }} />
                                                ) : (
                                                    <FiArrowUp style={{ ...styles.icon, color: "#2e7d32" }} />
                                                )}
                                                <span style={isEntrada ? styles.salidaText : styles.entradaText}>
                                                        {item.cantidad}
                                                    </span>
                                            </div>
                                        </td>
                                        <td style={styles.td}>
                                            {item.computedStock}
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

HistoryModal.propTypes = {
    idprod: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onClose: PropTypes.func.isRequired,
};

const styles = {
    modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        backdropFilter: "blur(2px)",
    },
    modal: {
        backgroundColor: "#ffffff",
        padding: "2rem",
        borderRadius: "12px",
        width: "80%",
        maxWidth: "900px",
        maxHeight: "80vh",
        overflowY: "auto",
        position: "relative",
        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1.5rem",
        paddingBottom: "1rem",
        borderBottom: "1px solid #e0e0e0",
    },
    title: {
        fontSize: "1.5rem",
        color: "#2d3436",
        margin: 0,
        fontWeight: "600",
        letterSpacing: "-0.5px",
    },
    closeButton: {
        background: "none",
        border: "none",
        fontSize: "1.8rem",
        color: "#636e72",
        cursor: "pointer",
        padding: "0 0.5rem",
        transition: "all 0.3s ease",
        lineHeight: 1,
        ":hover": {
            color: "#2d3436",
            transform: "scale(1.1)",
        },
    },
    tableContainer: {
        borderRadius: "8px",
        overflow: "hidden",
        border: "1px solid #f0f0f0",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        backgroundColor: "white",
    },
    tableHeader: {
        backgroundColor: "#f8f9fa",
    },
    th: {
        padding: "1rem",
        textAlign: "left",
        color: "#6c757d",
        fontWeight: "600",
        fontSize: "0.9rem",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
    },
    td: {
        padding: "1rem",
        fontSize: "0.95rem",
        color: "#495057",
        borderBottom: "1px solid #f0f0f0",
    },
    entradaRow: {
        backgroundColor: "#e6f4ea",
    },
    salidaRow: {
        backgroundColor: "#fce8e6",
    },
    quantityCell: {
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
    },
    icon: {
        fontSize: "1.2rem",
        strokeWidth: "2.5px",
    },
    entradaText: {
        color: "#2e7d32",
        fontWeight: "500",
    },
    salidaText: {
        color: "#c62828",
        fontWeight: "500",
    },
    productCell: {
        display: "flex",
        flexDirection: "column",
    },
    productCode: {
        fontSize: "0.85rem",
        color: "#6c757d",
        marginBottom: "0.2rem",
    },
    productName: {
        fontSize: "0.95rem",
        color: "#2d3436",
    },
    loadingContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
        padding: "2rem",
    },
    spinner: {
        width: "40px",
        height: "40px",
        border: "4px solid #f0f0f0",
        borderTopColor: "#3498db",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
    },
};

export default HistoryModal;
