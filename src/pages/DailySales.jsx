// src/components/DailySales.jsx
import React, { useState, useEffect } from "react";
import dailySalesService from "../services/dailySalesService";
import SaleDetailsModal from "../components/SaleDetailsModal.jsx";

const DailySales = () => {
    // Estado para ventas diarias
    const [sales, setSales] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Estado para el modal de detalles de venta
    const [selectedIdCab, setSelectedIdCab] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Estado para el historial de ventas
    const [historicalSales, setHistoricalSales] = useState([]);
    const [historicalPage, setHistoricalPage] = useState(1);
    const [totalHistorical, setTotalHistorical] = useState(0);
    const [isHistoricalLoading, setIsHistoricalLoading] = useState(false);
    const [showHistorical, setShowHistorical] = useState(false);

    // Cargar las ventas diarias al montar el componente
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

    // Función para abrir el modal. Agregamos un log para ver el id que llega.
    const openModal = (id) => {
        console.log("openModal llamado con id:", id);
        if (!id) {
            console.warn("No se ha recibido un id válido para el modal.");
            return;
        }
        setSelectedIdCab(id);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedIdCab(null);
    };

    // Función para cargar una página del historial
    const loadHistoricalSales = async (page = 1) => {
        setIsHistoricalLoading(true);
        try {
            const result = await dailySalesService.getPage(page, 10);
            console.log(`Ventas históricas página ${page}:`, result);
            if (page === 1) {
                setHistoricalSales(result.ventas);
            } else {
                setHistoricalSales((prev) => [...prev, ...result.ventas]);
            }
            setTotalHistorical(result.total);
            setHistoricalPage(page);
        } catch (error) {
            console.error("Error al cargar ventas históricas:", error);
        } finally {
            setIsHistoricalLoading(false);
        }
    };

    // Muestra u oculta la sección histórica
    const handleShowHistorical = () => {
        if (!showHistorical) {
            loadHistoricalSales(1);
        }
        setShowHistorical(!showHistorical);
    };

    // Cargar la siguiente página del historial
    const handleLoadMore = () => {
        const nextPage = historicalPage + 1;
        loadHistoricalSales(nextPage);
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Ventas Diarias</h2>
            {isLoading ? (
                <p>Cargando ventas diarias...</p>
            ) : (
                <>
                    {sales.length === 0 ? (
                        <p>No hay ventas registradas hoy.</p>
                    ) : (
                        <div style={styles.cardList}>
                            {sales.map((venta, index) => (
                                <div key={index} style={styles.card}>
                                    <h3 style={styles.cardTitle}>
                                        {venta.num_docum || "Sin número de documento"}
                                    </h3>
                                    <p style={styles.cardText}>
                                        Cliente: {venta.cliente || "N/A"}
                                    </p>
                                    <p style={styles.cardText}>
                                        Estado: {venta.estado || "N/A"}
                                    </p>
                                    <p style={styles.cardText}>
                                        IGV: {venta.igv || "0.00"}
                                    </p>
                                    <p style={styles.cardText}>
                                        Valor de venta: {venta.vvta || "0.00"}
                                    </p>
                                    <p style={styles.cardText}>
                                        Total: {venta.total || "0.00"}
                                    </p>
                                    <button
                                        style={styles.button}
                                        onClick={() => {
                                            console.log("Venta diaria:", venta);
                                            openModal(venta.idmov);
                                        }}
                                    >
                                        Más Información
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Botón para mostrar u ocultar el registro histórico */}
            <div style={{ marginTop: "20px", textAlign: "center" }}>
                <button style={styles.button} onClick={handleShowHistorical}>
                    {showHistorical ? "Ocultar Registro Histórico" : "MOSTRAR REGISTRO HISTÓRICO"}
                </button>
            </div>

            {/* Sección de historial */}
            {showHistorical && (
                <div style={{ marginTop: "20px" }}>
                    <h2 style={styles.title}>Registro Histórico</h2>
                    {isHistoricalLoading && historicalPage === 1 ? (
                        <p>Cargando registro histórico...</p>
                    ) : (
                        <>
                            {historicalSales.length === 0 ? (
                                <p>No hay registros históricos.</p>
                            ) : (
                                <div style={styles.cardList}>
                                    {historicalSales.map((venta, index) => (
                                        <div key={index} style={styles.card}>
                                            <h3 style={styles.cardTitle}>
                                                {venta.num_docum || "Sin número de documento"}
                                            </h3>
                                            <p style={styles.cardText}>
                                                Cliente: {venta.cliente || "N/A"}
                                            </p>
                                            <p style={styles.cardText}>
                                                Estado: {venta.estado || "N/A"}
                                            </p>
                                            <p style={styles.cardText}>
                                                IGV: {venta.igv || "0.00"}
                                            </p>
                                            <p style={styles.cardText}>
                                                Valor de venta: {venta.vvta || "0.00"}
                                            </p>
                                            <p style={styles.cardText}>
                                                Total: {venta.total || "0.00"}
                                            </p>
                                            <button
                                                style={styles.button}
                                                onClick={() => {
                                                    console.log("Venta histórica:", venta);
                                                    // Aquí se utiliza "venta.idmov" o "venta.idcab" según lo que tenga cada registro
                                                    openModal(venta.idmov || venta.idcab);
                                                }}
                                            >
                                                Más Información
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {/* Botón para cargar más registros si aún hay más */}
                            {historicalSales.length < totalHistorical && (
                                <div style={{ textAlign: "center", marginTop: "10px" }}>
                                    {isHistoricalLoading ? (
                                        <p>Cargando más...</p>
                                    ) : (
                                        <button style={styles.button} onClick={handleLoadMore}>
                                            Ver más...
                                        </button>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}

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
