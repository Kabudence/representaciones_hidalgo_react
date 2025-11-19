// src/components/DailySales.jsx
import { useState, useEffect } from "react";
import dailySalesService from "../services/dailySalesService";
import SaleDetailsModal from "../components/SaleDetailsModal.jsx";
import { FaSearch } from "react-icons/fa";

const DailySales = () => {
    // Estado para ventas diarias
    const [role, setRole] = useState(null);
    const [sales, setSales] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearching, setIsSearching] = useState(false);
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
    useEffect(() => {
        const storedUserData = sessionStorage.getItem("authData");
        if (storedUserData) {
            const { role } = JSON.parse(storedUserData);
            setRole(role);
        }
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

    // Función para abrir el modal. Se valida que se reciba un id
    const openModal = (id) => {
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

    // 🔹 NUEVO: completar venta pidiendo el nombre del vendedor
    const handleCompleteSale = async (venta) => {
        if (!venta || !venta.idmov) {
            console.warn("No se recibió un idmov válido para completar la venta.");
            return;
        }

        const vendedor = window.prompt(
            "Ingrese el nombre (o DNI) de la persona que realizó la venta:"
        );

        // Si cancelan o dejan vacío, no hacemos nada
        if (!vendedor || !vendedor.trim()) {
            return;
        }

        try {
            await dailySalesService.changeStateToComplete(venta.idmov, vendedor.trim());
            // Refrescamos las ventas diarias
            await fetchSales();
            // Si está abierto el histórico, lo recargamos en la página actual
            if (showHistorical) {
                await loadHistoricalSales(historicalPage);
            }
        } catch (error) {
            console.error("Error al completar la venta:", error);
        }
    };

    // Función para cargar una página del historial sin búsqueda
    const loadHistoricalSales = async (page = 1) => {
        setIsHistoricalLoading(true);
        try {
            const result = await dailySalesService.getPage(page, 10);
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
            setIsSearching(false);
        }
    };

    // Función de búsqueda actualizada para usar getVentaByNumDocum
    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            clearSearch();
            return;
        }
        setIsSearching(true);
        try {
            const sale = await dailySalesService.getVentaByNumDocum(searchTerm);
            console.log(sale);
            // Si se encuentra una venta, la envolvemos en un arreglo; de lo contrario, dejamos el arreglo vacío.
            if (sale && !sale.error) {
                setHistoricalSales([sale]);
            } else {
                setHistoricalSales([]);
            }
        } catch (error) {
            console.error("Error al buscar venta por número de documento:", error);
            setHistoricalSales([]);
        } finally {
            setIsSearching(false);
        }
    };

    // Función para resetear la búsqueda y cargar la primera página del historial
    const clearSearch = () => {
        setSearchTerm("");
        loadHistoricalSales(1);
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

                                    {/* NUEVO: etiqueta de estado con color */}
                                    <p
                                        style={{
                                            ...styles.cardText,
                                            color: venta.estado === "COMPLETADO" ? "blue" : "red",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {venta.estado === "COMPLETADO"
                                            ? "COMPLETADO"
                                            : "EN PROCESO"}
                                    </p>

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
                                            openModal(venta.idmov);
                                        }}
                                    >
                                        Más Información
                                    </button>

                                    {/* NUEVO: botón para completar venta */}
                                    {venta.estado !== "COMPLETADO" && (
                                        <button
                                            style={{ ...styles.button, marginLeft: "8px" }}
                                            onClick={() => handleCompleteSale(venta)}
                                        >
                                            Marcar como completada
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Botón para mostrar u ocultar el registro histórico */}
            {role === "admin" && (
                <div style={{ marginTop: "20px", textAlign: "center" }}>
                    <button style={styles.button} onClick={handleShowHistorical}>
                        {showHistorical ? "Ocultar Registro Histórico" : "MOSTRAR REGISTRO HISTÓRICO"}
                    </button>
                </div>
            )}

            {/* Sección de historial */}
            {showHistorical && (
                <div style={{ marginTop: "20px" }}>
                    <h2 style={styles.title}>Registro Histórico</h2>
                    <div style={styles.searchContainer}>
                        <div style={styles.searchInputGroup}>
                            <input
                                type="text"
                                placeholder="Buscar por número de documento..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={styles.searchInput}
                                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                            />
                            <button
                                style={styles.searchButton}
                                onClick={handleSearch}
                                disabled={isSearching}
                            >
                                <FaSearch />
                            </button>
                            {searchTerm && (
                                <button
                                    style={styles.clearButton}
                                    onClick={clearSearch}
                                >
                                    X
                                </button>
                            )}
                        </div>
                    </div>

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

                                            {/* NUEVO: etiqueta de estado con color */}
                                            <p
                                                style={{
                                                    ...styles.cardText,
                                                    color:
                                                        venta.estado === "COMPLETADO" ? "blue" : "red",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                {venta.estado === "COMPLETADO"
                                                    ? "COMPLETADO"
                                                    : "EN PROCESO"}
                                            </p>

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
                                                    openModal(venta.idmov || venta.idcab);
                                                }}
                                            >
                                                Más Información
                                            </button>

                                            {/* Opcional: también podrías permitir completar desde histórico */}
                                            {venta.estado !== "COMPLETADO" && (
                                                <button
                                                    style={{ ...styles.button, marginLeft: "8px" }}
                                                    onClick={() => handleCompleteSale(venta)}
                                                >
                                                    Marcar como completada
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {/* Botón para cargar más registros si aún hay más */}
                            {!searchTerm && historicalSales.length < totalHistorical && (
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
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
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
    searchContainer: {
        marginBottom: "15px",
        textAlign: "center",
    },
    searchInputGroup: {
        display: "inline-flex",
        alignItems: "center",
    },
    searchInput: {
        padding: "8px",
        border: "1px solid #ccc",
        borderRadius: "5px 0 0 5px",
        outline: "none",
        width: "250px",
    },
    searchButton: {
        padding: "8px 12px",
        border: "none",
        backgroundColor: "#524b4a",
        color: "white",
        borderRadius: "0 5px 5px 0",
        cursor: "pointer",
    },
    clearButton: {
        marginLeft: "5px",
        padding: "8px 12px",
        border: "none",
        backgroundColor: "#dc3545",
        color: "white",
        borderRadius: "5px",
        cursor: "pointer",
    },
    buttonGroup: {
        marginTop: "12px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },

};

export default DailySales;
