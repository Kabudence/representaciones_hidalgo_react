// src/components/ElementsByIdCab.jsx
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import compraService from "../services/compraService";

const ElementsByIdCab = ({ numDocum, onClose }) => {
    const [elements, setElements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchElements = async () => {
            try {
                const data = await compraService.getCompraDetailsByNumDoc(numDocum);
                setElements(data);
            } catch (_err) {
                setError("Error al obtener los detalles de la compra");
            } finally {
                setLoading(false);
            }
        };
        fetchElements();
    }, [numDocum]);

    return (
        <div style={styles.modalOverlay}>
            <div style={styles.modal}>
                <div style={styles.header}>
                    <h2 style={styles.title}>Detalles: {numDocum}</h2>
                    <button onClick={onClose} style={styles.closeButton}>
                        &times;
                    </button>
                </div>
                {loading ? (
                    <p style={styles.message}>Cargando detalles...</p>
                ) : error ? (
                    <p style={{ ...styles.message, color: "#d32f2f" }}>{error}</p>
                ) : (
                    <div style={styles.detailsContainer}>
                        {elements.map((el, index) => (
                            <div key={index} style={styles.detailItem}>
                                <p style={styles.detailText}>
                                    <strong>Producto:</strong> {el.nomproducto}
                                </p>
                                <p style={styles.detailText}>
                                    <strong>Cantidad:</strong> {el.cantidad}
                                </p>
                                <p style={styles.detailText}>
                                    <strong>Precio Unidad:</strong> S/{parseFloat(el.precio).toFixed(2)}
                                </p>
                                <p style={styles.detailText}>
                                    <strong>Total:</strong> S/{parseFloat(el.total).toFixed(2)}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

ElementsByIdCab.propTypes = {
    numDocum: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
};

const styles = {
    modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },
    modal: {
        backgroundColor: "#fff",
        padding: "30px",
        borderRadius: "8px",
        width: "400px",
        maxWidth: "90%",
        maxHeight: "80vh",
        overflowY: "auto",
        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        border: "1px solid #ccc",
        position: "relative",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        borderBottom: "2px solid #b0b0b0",
        paddingBottom: "10px",
        marginBottom: "20px",
    },
    title: {
        fontSize: "1.4rem",
        color: "#2d3436",
        margin: 0,
        fontWeight: "600",
    },
    closeButton: {
        background: "none",
        border: "none",
        fontSize: "1.8rem",
        color: "#636e72",
        cursor: "pointer",
    },
    message: {
        fontSize: "14px",
        textAlign: "center",
    },
    detailsContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
    },
    detailItem: {
        backgroundColor: "#f9f9f9",
        padding: "10px 15px",
        borderRadius: "4px",
        border: "1px solid #e0e0e0",
    },
    detailText: {
        margin: "5px 0",
        fontSize: "14px",
        color: "#424242",
        lineHeight: "1.4",
    },
};

export default ElementsByIdCab;
