import { useState, useEffect } from "react";
import ventaService from "../services/ventaService";
import VentasAdvancedSearch from "../components/VentasAdvancedSearch.jsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment-timezone";
import { useNavigate } from "react-router-dom";
import ShowUtilidadesComponent from "../components/ShowUtilidadesComponent"; // Asegúrate de tener este componente

function Ventas() {
    const [ventas, setVentas] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [size] = useState(10);
    const [loading, setLoading] = useState(false);
    const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);
    const [advancedFilters, setAdvancedFilters] = useState(null);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [showUtilidades, setShowUtilidades] = useState(false);
    const navigate = useNavigate();

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
            fetchVentas(currentPage);
        }
    }, [isAuthorized, currentPage]);

    const fetchVentas = async (page) => {
        setLoading(true);
        try {
            const data = await ventaService.getPage(page, size);
            setVentas(data.ventas);
            setTotal(data.total);
        } catch (error) {
            console.error("Error al obtener ventas:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAdvancedSearchVentas = async (filters, page) => {
        setLoading(true);
        try {
            const data = await ventaService.advancedSearch({
                ...filters,
                page,
                size,
            });
            setVentas(data.ventas);
            setTotal(data.total);
        } catch (error) {
            console.error("Error al buscar ventas:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdvancedSearch = (filters) => {
        setIsAdvancedSearch(true);
        setAdvancedFilters(filters);
        setCurrentPage(1);
        fetchAdvancedSearchVentas(filters, 1);
    };

    const handleClearSearch = () => {
        setIsAdvancedSearch(false);
        setAdvancedFilters(null);
        setCurrentPage(1);
        fetchVentas(1);
    };

    const handleNextPage = () => {
        if (currentPage * size < total) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            if (isAdvancedSearch && advancedFilters) {
                fetchAdvancedSearchVentas(advancedFilters, nextPage);
            } else {
                fetchVentas(nextPage);
            }
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            const prevPage = currentPage - 1;
            setCurrentPage(prevPage);
            if (isAdvancedSearch && advancedFilters) {
                fetchAdvancedSearchVentas(advancedFilters, prevPage);
            } else {
                fetchVentas(prevPage);
            }
        }
    };

    const exportToPDF = async () => {
        const doc = new jsPDF("landscape");
        try {
            const data = await ventaService.advancedSearch({
                ...advancedFilters,
                page: 1,
                size: 10000,
            });
            const ventasToExport = data.ventas;

            doc.setFontSize(12);
            doc.text("Representaciones Hidalgo", 10, 10);
            doc.text("Av. América Norte", 10, 15);

            const now = new Date();
            doc.text(`Fecha: ${now.toLocaleDateString("es-PE")}`, 250, 10);
            doc.text(`Hora: ${now.toLocaleTimeString("es-PE")}`, 250, 15);

            doc.setFontSize(14);
            doc.text("Listado de Ventas", 148, 30, { align: "center" });

            if (advancedFilters) {
                doc.setFontSize(10);
                doc.text("Filtros aplicados:", 10, 40);
                let filterText = "";
                if (advancedFilters.fromDate)
                    filterText += `Desde: ${advancedFilters.fromDate} `;
                if (advancedFilters.toDate)
                    filterText += `Hasta: ${advancedFilters.toDate} `;
                if (advancedFilters.fromPrice)
                    filterText += `Precio desde: S/${advancedFilters.fromPrice} `;
                if (advancedFilters.toPrice)
                    filterText += `Precio hasta: S/${advancedFilters.toPrice} `;
                if (advancedFilters.clientRUC)
                    filterText += `RUC Cliente: ${advancedFilters.clientRUC} `;
                if (advancedFilters.status)
                    filterText += `Estado: ${advancedFilters.status} `;
                doc.text(filterText, 10, 45);
            }

            const tableColumn = [
                "N° Doc",
                "RUC Cliente",
                "Cliente",
                "Fecha",
                "Tipo Movimiento",
                "Tipo Venta",
                "Valor Venta",
                "IGV",
                "Total",
                "Estado",
            ];
            const tableRows = ventasToExport.map((venta) => [
                venta.num_docum || "N/A",
                venta.ruc_cliente || "N/A",
                venta.cliente || "N/A",
                new Date(venta.fecha).toLocaleDateString("es-PE"),
                venta.tipo_movimiento || "N/A",
                venta.tipo_venta || "N/A",
                (parseFloat(venta.valor_de_venta) || 0).toFixed(2),
                (parseFloat(venta.igv) || 0).toFixed(2),
                (parseFloat(venta.total) || 0).toFixed(2),
                venta.estado || "N/A",
            ]);

            doc.autoTable({
                startY: 50,
                head: [tableColumn],
                body: tableRows,
                theme: "grid",
                headStyles: {
                    fillColor: [211, 211, 211],
                    textColor: [0, 0, 0],
                    fontSize: 10,
                },
                bodyStyles: {
                    fontSize: 8,
                    textColor: [0, 0, 0],
                },
            });

            doc.save("listado_ventas.pdf");
        } catch (error) {
            console.error("Error al generar el PDF:", error);
        }
    };

    useEffect(() => {
        fetchVentas(currentPage);
    }, []);

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Listado de Ventas</h1>
                <div>
                    <button style={styles.pdfButton} onClick={exportToPDF}>
                        🖨️ Generar PDF
                    </button>
                    <button
                        style={{ ...styles.pdfButton, marginLeft: "10px" }}
                        onClick={() => setShowUtilidades(true)}
                    >
                        Utilidades
                    </button>
                </div>
            </div>
            <VentasAdvancedSearch
                onSearch={handleAdvancedSearch}
                onClear={handleClearSearch}
            />
            {loading ? (
                <p style={styles.loading}>Cargando...</p>
            ) : (
                <table style={styles.table}>
                    <thead>
                    <tr style={styles.tableHeader}>
                        <th style={styles.tableCell}>N° Doc</th>
                        <th style={styles.tableCell}>RUC Cliente</th>
                        <th style={styles.tableCell}>Cliente</th>
                        <th style={styles.tableCell}>Fecha</th>
                        <th style={styles.tableCell}>Tipo Movimiento</th>
                        <th style={styles.tableCell}>Tipo Venta</th>
                        <th style={styles.tableCell}>Valor Venta</th>
                        <th style={styles.tableCell}>IGV</th>
                        <th style={styles.tableCell}>Total</th>
                        <th style={styles.tableCell}>Estado</th>
                    </tr>
                    </thead>
                    <tbody>
                    {ventas.map((venta, index) => (
                        <tr key={index} style={styles.tableRow}>
                            <td style={styles.tableCell}>{venta.num_docum}</td>
                            <td style={styles.tableCell}>{venta.ruc_cliente}</td>
                            <td style={styles.tableCell}>{venta.cliente}</td>
                            <td style={styles.tableCell}>
                                {moment.utc(venta.fecha).add(5, "hours").format("YYYY-MM-DD")}
                            </td>
                            <td style={styles.tableCell}>{venta.tipo_movimiento}</td>
                            <td style={styles.tableCell}>{venta.tipo_venta}</td>
                            <td style={styles.tableCell}>{venta.valor_de_venta}</td>
                            <td style={styles.tableCell}>{venta.igv}</td>
                            <td style={styles.tableCell}>{venta.total}</td>
                            <td
                                style={{
                                    ...styles.tableCell,
                                    color: venta.estado === "COMPLETADO" ? "green" : "red",
                                    fontWeight: "bold",
                                }}
                            >
                                {venta.estado}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
            <div style={styles.pagination}>
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    style={styles.button}
                >
                    Anterior
                </button>
                <span style={styles.pageIndicator}>
          Página {currentPage} de {Math.ceil(total / size)}
        </span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage * size >= total}
                    style={styles.button}
                >
                    Siguiente
                </button>
            </div>
            {showUtilidades && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <button
                            style={{
                                ...styles.button,
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                            }}
                            onClick={() => setShowUtilidades(false)}
                        >
                            Cerrar
                        </button>
                        {/* Renderizamos el componente de utilidades */}
                        <ShowUtilidadesComponent />
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
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
    },
    title: {
        fontFamily: "'PT Sans Narrow', sans-serif",
        fontSize: "50px",
        margin: 0,
    },
    pdfButton: {
        padding: "10px 20px",
        backgroundColor: "#524b4a",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontWeight: "bold",
    },
    searchContainer: {
        marginBottom: "20px",
    },
    searchInput: {
        width: "100%",
        padding: "10px",
        border: "1px solid #ccc",
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
        fontSize: "14px",
    },
    pagination: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "20px",
        gap: "10px",
    },
    button: {
        padding: "10px 20px",
        backgroundColor: "#524b4a",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontWeight: "bold",
    },
    pageIndicator: {
        fontSize: "16px",
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
        width: "600px",
        position: "relative",
    },
};

export default Ventas;
