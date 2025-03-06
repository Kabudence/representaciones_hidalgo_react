// src/components/Compras.jsx
import { useState, useEffect } from "react";
import compraService from "../services/compraService";
import ComprasAdvancedSearch from "../components/ComprasAdvancedSearch";
import CompraForm from "../components/CompraForm";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment-timezone";
import {useNavigate} from "react-router-dom";

const Compras = () => {
    const [compras, setCompras] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState(null);
    const [isAuthorized, setIsAuthorized] = useState(null);
    const navigate = useNavigate();
    // Estado para controlar la ventana emergente (modal) de "Generar Compra"
    const [showCompraModal, setShowCompraModal] = useState(false);
    // Estado inicial para el formulario de compra
    const [compra, setCompra] = useState({
        num_docum: "",
        ruc_cliente: "",
        ItemList: [{ producto: "", cantidad: "", precio: "", igv: "" }],
        proveedor: {
            ruc: "",
            nomproveedor: "",
            direccion: "",
            contacto: "",
        },
    });
    useEffect(() => {
        // Obtener authData desde sessionStorage
        const storedAuthData = sessionStorage.getItem("authData");

        if (storedAuthData) {
            try {
                const parsedAuthData = JSON.parse(storedAuthData);

                if (parsedAuthData.role === "admin") {
                    setIsAuthorized(true);
                } else {
                    setIsAuthorized(false);
                    navigate("/no-autorizado"); // Redirigir a la página de acceso denegado
                }
            } catch (error) {
                setIsAuthorized(false);
                navigate("/login"); // Si hay error, redirigir al login
            }
        } else {
            setIsAuthorized(false);
            navigate("/login"); // Si no hay authData, redirigir al login
        }
    }, [navigate]);

    useEffect(() => {
        if (isAuthorized) {
            fetchCompras(currentPage);
        }
    }, [currentPage, filters, isAuthorized]);

    const fetchCompras = async (page) => {
        setIsLoading(true);
        try {
            let data;
            if (filters) {
                data = await compraService.getAdvancedSearch({ ...filters, page, size: 10 });
            } else {
                data = await compraService.getPaginatedCompras(page, 10);
            }
            const normalizedCompras = data.items.map((compra) => ({
                ...compra,
                valor_de_venta: parseFloat(compra.valor_de_venta || 0),
                igv: parseFloat(compra.igv || 0),
                total: parseFloat(compra.total || 0),
            }));
            setCompras(normalizedCompras);
            setTotalPages(data.totalPages);
        }
         finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCompras(currentPage);
    }, [currentPage, filters]);

    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    const handleSearch = (searchFilters) => {
        setFilters(searchFilters);
        setCurrentPage(1);
    };

    const handleClear = () => {
        setFilters(null);
        setCurrentPage(1);
    };

    const exportToPDF = async (filters) => {
        const doc = new jsPDF("landscape");
        try {
            const data = await compraService.getAdvancedSearch({ ...filters, page: 1, size: 10000 });
            const compras = data.items;
            doc.setFontSize(12);
            doc.text("Representaciones Hidalgo", 10, 10);
            doc.text("Av. América Norte", 10, 15);
            const now = new Date();
            doc.text(`Fecha: ${now.toLocaleDateString("es-PE")}`, 250, 10);
            doc.text(`Hora: ${now.toLocaleTimeString("es-PE")}`, 250, 15);
            doc.setFontSize(14);
            doc.text("Listado de Compras", 148, 30, { align: "center" });
            if (filters) {
                doc.setFontSize(10);
                doc.text("Filtros aplicados:", 10, 40);
                let filterText = "";
                if (filters.fromDate) filterText += `Desde: ${filters.fromDate} `;
                if (filters.toDate) filterText += `Hasta: ${filters.toDate} `;
                if (filters.fromPrice) filterText += `Precio desde: S/${filters.fromPrice} `;
                if (filters.toPrice) filterText += `Precio hasta: S/${filters.toPrice} `;
                if (filters.providerName) filterText += `Proveedor: ${filters.providerName} `;
                if (filters.clientRUC) filterText += `RUC Cliente: ${filters.clientRUC} `;
                if (filters.status) filterText += `Estado: ${filters.status} `;
                doc.text(filterText, 10, 45);
            }
            const tableColumn = [
                "Fecha",
                "Tipo Movimiento",
                "Tipo Venta",
                "Número Documento",
                "RUC Cliente",
                "Proveedor",
                "Valor Venta",
                "IGV",
                "Total",
                "Estado",
            ];
            const tableRows = compras.map((compra) => [
                new Date(compra.fecha).toLocaleDateString("es-PE"),
                compra.tipo_movimiento || "N/A",
                compra.tipo_venta || "N/A",
                compra.num_docum || "N/A",
                compra.ruc_cliente || "N/A",
                compra.proveedor || "N/A",
                (parseFloat(compra.valor_de_venta) || 0).toFixed(2),
                (parseFloat(compra.igv) || 0).toFixed(2),
                (parseFloat(compra.total) || 0).toFixed(2),
                compra.estado || "N/A",
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
                    lineWidth: 0.5,
                    lineColor: [0, 0, 0],
                },
                bodyStyles: {
                    fontSize: 8,
                    textColor: [0, 0, 0],
                    lineWidth: 0,
                },
                styles: {
                    lineWidth: 0.1,
                    lineColor: [0, 0, 0],
                },
                tableLineColor: [0, 0, 0],
                tableLineWidth: 0.1,
            });
            doc.save("listado_compras.pdf");
        } catch (error) {
            console.error("Error al generar el PDF:", error);
        }
    };

    const openCompraModal = () => {
        setShowCompraModal(true);
    };

    const closeCompraModal = () => {
        setShowCompraModal(false);
    };

    const handleSubmitCompra = async (compraData) => {
        try {
            await compraService.createCompra(compraData);
            closeCompraModal();
            fetchCompras(currentPage);
        } catch (error) {
            console.error("Error al crear la compra:", error);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Listado de Compras</h1>
                <div>
                    <button style={styles.pdfButton} onClick={() => exportToPDF(filters)}>
                        🖨️ Generar PDF
                    </button>
                    <button
                        style={{ ...styles.pdfButton, marginLeft: "10px" }}
                        onClick={openCompraModal}
                    >
                        Generar Compra
                    </button>
                </div>
            </div>
            <ComprasAdvancedSearch onSearch={handleSearch} onClear={handleClear} />
            {isLoading ? (
                <p style={styles.loading}>Cargando...</p>
            ) : (
                <table style={styles.table}>
                    <thead>
                    <tr style={styles.tableHeader}>
                        <th style={styles.tableCell}>Fecha</th>
                        <th style={styles.tableCell}>Tipo Movimiento</th>
                        <th style={styles.tableCell}>Tipo Venta</th>
                        <th style={styles.tableCell}>Número Documento</th>
                        <th style={styles.tableCell}>RUC Cliente</th>
                        <th style={styles.tableCell}>Proveedor</th>
                        <th style={styles.tableCell}>Valor Venta</th>
                        <th style={styles.tableCell}>IGV</th>
                        <th style={styles.tableCell}>Total</th>
                        <th style={styles.tableCell}>Estado</th>
                    </tr>
                    </thead>
                    <tbody>
                    {compras.length > 0 ? (
                        compras.map((compra, index) => (
                            <tr key={index} style={styles.tableRow}>
                                <td style={styles.tableCell}>
                                    {moment.utc(compra.fecha).add(5, 'hours').format("YYYY-MM-DD")}
                                </td>
                                <td style={styles.tableCell}>{compra.tipo_movimiento}</td>
                                <td style={styles.tableCell}>{compra.tipo_venta}</td>
                                <td style={styles.tableCell}>{compra.num_docum}</td>
                                <td style={styles.tableCell}>{compra.ruc_cliente}</td>
                                <td style={styles.tableCell}>{compra.proveedor}</td>
                                <td style={styles.tableCell}>{compra.valor_de_venta.toFixed(2)}</td>
                                <td style={styles.tableCell}>{compra.igv.toFixed(2)}</td>
                                <td style={styles.tableCell}>{compra.total.toFixed(2)}</td>
                                <td
                                    style={{
                                        ...styles.tableCell,
                                        color: compra.estado === "COMPLETADO" ? "green" : "red",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {compra.estado}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="10" style={styles.tableCell}>
                                No se encontraron resultados.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            )}
            <div style={styles.pagination}>
                <button
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    style={{
                        ...styles.button,
                        ...(currentPage === 1 && styles.disabledButton),
                    }}
                >
                    Anterior
                </button>
                <span style={styles.pageIndicator}>
          Página {currentPage} de {totalPages}
        </span>
                <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    style={{
                        ...styles.button,
                        ...(currentPage === totalPages && styles.disabledButton),
                    }}
                >
                    Siguiente
                </button>
            </div>

            {showCompraModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <CompraForm
                            compra={compra}
                            setCompra={setCompra}
                            onSubmit={handleSubmitCompra}
                            onCancel={closeCompraModal}
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
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        marginBottom: "15px",
        fontFamily: "'PT Sans Narrow', sans-serif",
        fontSize: "50px",
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
    loading: {
        textAlign: "center",
        fontSize: "18px",
        fontWeight: "bold",
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
    disabledButton: {
        opacity: 0.5,
        cursor: "not-allowed",
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
        zIndex: 9999,
    },
    modal: {
        backgroundColor: "white",
        padding: "30px",
        borderRadius: "8px",
        width: "400px",
        maxHeight: "80vh",
        overflowY: "auto",
    },
};

export default Compras;
