// src/components/DailySales.jsx
import React, { useState, useEffect } from "react";
import dailySalesService from "../services/dailySalesService";
import SaleDetailsModal from "../components/SaleDetailsModal.jsx";

const DailySales = () => {
    const [sales, setSales] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedIdCab, setSelectedIdCab] = useState(null); // Para abrir el modal
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        try {
            const data = await dailySalesService.getCompletedToday();
            setSales(data);
        } catch (error) {
            console.error("Error al obtener ventas diarias:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const openModal = (idcab) => {
        setSelectedIdCab(idcab);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedIdCab(null);
    };

    if (isLoading) {
        return (
            <div style={styles.container}>
                <h2 style={styles.title}>Ventas Diarias</h2>
                <p>Cargando...</p>
            </div>
        );
    }

    if (!sales || sales.length === 0) {
        return (
            <div style={styles.container}>
                <h2 style={styles.title}>Ventas Diarias</h2>
                <p>No hay ventas registradas hoy.</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Ventas Diarias</h2>
            <div style={styles.cardList}>
                {sales.map((venta, index) => (
                    <div key={index} style={styles.card}>
                        <h3 style={styles.cardTitle}>
                            {venta.num_docum || "Sin número de documento"}
                        </h3>
                        <p style={styles.cardText}>Cliente: {venta.cliente || "N/A"}</p>
                        <p style={styles.cardText}>Estado: {venta.estado || "N/A"}</p>
                        <p style={styles.cardText}>IGV: {venta.igv || "0.00"}</p>
                        <p style={styles.cardText}>Valor de venta: {venta.vvta || "0.00"}</p>
                        <p style={styles.cardText}>Total: {venta.total || "0.00"}</p>
                        <button
                            style={styles.button}
                            onClick={() => openModal(venta.idmov)}
                        >
                            Más Información
                        </button>
                    </div>
                ))}
            </div>

            {showModal && selectedIdCab && (
                <SaleDetailsModal idcab={selectedIdCab} onClose={closeModal} />
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
        fontSize: "32px",
        textAlign: "center",
    },
    cardList: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "16px",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: "8px",
        padding: "16px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    },
    cardTitle: {
        fontSize: "18px",
        fontWeight: "bold",
        marginBottom: "8px",
    },
    cardText: {
        margin: "4px 0",
    },
    button: {
        marginTop: "8px",
        padding: "10px 20px",
        backgroundColor: "#524b4a",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontWeight: "bold",
    },
};

export default DailySales;
