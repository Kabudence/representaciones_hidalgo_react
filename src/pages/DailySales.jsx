// src/pages/DailySales.jsx
import { useState, useEffect } from "react";
import dailySalesService from "../services/dailySalesService";
import api from "../services/api";
import { FaSearch } from "react-icons/fa";

const DailySales = () => {
    // Estado para ventas diarias
    const [role, setRole] = useState(null);
    const [sales, setSales] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [historicalStatus, setHistoricalStatus] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [mainPage, setMainPage] = useState(1);
    const [totalSales, setTotalSales] = useState(0);
    const [isFilteredView, setIsFilteredView] = useState(false);
    const [activeFilters, setActiveFilters] = useState({ numDocum: "", status: "" });
    const [isLoadingMoreMain, setIsLoadingMoreMain] = useState(false);

    // Estado para el modal de informacion de venta
    const [selectedSale, setSelectedSale] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [saleDetailItems, setSaleDetailItems] = useState([]);
    const [saleDetailPhotos, setSaleDetailPhotos] = useState([]);
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
    const [isDetailLoading, setIsDetailLoading] = useState(false);
    const [detailError, setDetailError] = useState("");

    // Estado para el historial de ventas
    const [historicalSales, setHistoricalSales] = useState([]);
    const [historicalPage, setHistoricalPage] = useState(1);
    const [totalHistorical, setTotalHistorical] = useState(0);
    const [isHistoricalLoading, setIsHistoricalLoading] = useState(false);
    const [showHistorical, setShowHistorical] = useState(false);

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
            setTotalSales(data.length);
            setMainPage(1);
        } catch (error) {
            console.error("Error al obtener ventas diarias:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusUI = (estado) => {
        switch ((estado || "").toUpperCase()) {
            case "ANULADO":
                return {
                    color: "#FECACA",
                    backgroundColor: "rgba(220, 38, 38, 0.28)",
                    border: "1px solid rgba(248, 113, 113, 0.55)",
                };
            case "COMPLETADO":
                return {
                    color: "#BBF7D0",
                    backgroundColor: "rgba(22, 163, 74, 0.20)",
                    border: "1px solid rgba(74, 222, 128, 0.38)",
                };
            case "EN PROCESO":
                return {
                    color: "#FBBF24",
                    backgroundColor: "rgba(245, 158, 11, 0.16)",
                    border: "1px solid rgba(251, 191, 36, 0.30)",
                };
            default:
                return {
                    color: "#E5E7EB",
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                };
        }
    };

    const formatSaleDate = (fecha) => {
        if (!fecha) return "Sin fecha";

        const parsedDate = new Date(fecha);

        if (Number.isNaN(parsedDate.getTime())) {
            return String(fecha);
        }

        return parsedDate.toLocaleDateString("es-PE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const formatAmount = (value) => {
        const parsedValue = Number(value);
        return Number.isNaN(parsedValue) ? "0.00" : parsedValue.toFixed(2);
    };

    const canCompleteSale = (estado) => {
        return (estado || "").toUpperCase() === "EN PROCESO";
    };

    const buildPhotoSrc = (photoCode) => {
        if (!photoCode) return "";
        return String(photoCode).startsWith("data:image")
            ? photoCode
            : `data:image/jpeg;base64,${photoCode}`;
    };

    const getSaleIdCab = (venta) => venta?.idmov || venta?.idcab;

    const fetchSaleDetailsByNumDoc = async (numDocum) => {
        const response = await api.get(`/regmovdet/by-num-doc/${encodeURIComponent(numDocum)}`);
        return response.data;
    };

    const getPhotosByRegmovdet = (iddet) => {
        return saleDetailPhotos.filter((photo) => Number(photo.regmovdet_id) === Number(iddet));
    };

    const getItemsSummary = () => {
        const productCount = saleDetailItems.length;
        const unitsCount = saleDetailItems.reduce(
            (sum, item) => sum + (Number(item.cantidad) || 0),
            0
        );

        return { productCount, unitsCount };
    };

    const openModal = async (venta) => {
        const numDocum = venta?.num_docum;
        const idcab = getSaleIdCab(venta);

        if (!numDocum) {
            console.warn("No se ha recibido un numero de documento valido para el modal.");
            return;
        }

        setSelectedSale(venta);
        setShowModal(true);
        setSaleDetailItems([]);
        setSaleDetailPhotos([]);
        setSelectedPhotoIndex(0);
        setDetailError("");
        setIsDetailLoading(true);

        try {
            const [itemsResult, photosResult] = await Promise.allSettled([
                fetchSaleDetailsByNumDoc(numDocum),
                idcab ? dailySalesService.getPhotosByIdCab(idcab, 0, 100) : Promise.resolve([]),
            ]);

            if (itemsResult.status === "fulfilled") {
                setSaleDetailItems(Array.isArray(itemsResult.value) ? itemsResult.value : []);
            } else {
                console.error("Error al obtener productos de la venta:", itemsResult.reason);
                setDetailError("No se pudo cargar el listado de productos vendidos.");
            }

            if (photosResult.status === "fulfilled") {
                setSaleDetailPhotos(Array.isArray(photosResult.value) ? photosResult.value : []);
            } else {
                console.error("Error al obtener fotos de la venta:", photosResult.reason);
            }
        } finally {
            setIsDetailLoading(false);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedSale(null);
        setSaleDetailItems([]);
        setSaleDetailPhotos([]);
        setSelectedPhotoIndex(0);
        setDetailError("");
    };

    const renderSaleDetailsModal = () => {
        if (!showModal || !selectedSale) return null;

        const statusUI = getStatusUI(selectedSale.estado);
        const { productCount, unitsCount } = getItemsSummary();
        const selectedPhoto = saleDetailPhotos[selectedPhotoIndex];

        return (
            <div style={styles.detailOverlay} onClick={closeModal}>
                <div style={styles.detailModal} onClick={(event) => event.stopPropagation()}>
                    <div style={styles.detailHeader}>
                        <div>
                            <span style={styles.detailEyebrow}>Detalle de venta</span>
                            <h2 style={styles.detailTitle}>
                                {selectedSale.num_docum || "Sin numero de documento"}
                            </h2>
                            <p style={styles.detailSubtitle}>
                                Fecha: {formatSaleDate(selectedSale.fecha)}
                            </p>
                        </div>

                        <div style={styles.detailHeaderActions}>
                            <span style={{ ...styles.statusBadge, ...statusUI }}>
                                {selectedSale.estado || "N/A"}
                            </span>
                            <button style={styles.detailCloseButton} onClick={closeModal}>
                                X
                            </button>
                        </div>
                    </div>

                    {isDetailLoading ? (
                        <div style={styles.detailLoadingBox}>Cargando informacion de venta...</div>
                    ) : (
                        <>
                            {detailError && <p style={styles.detailError}>{detailError}</p>}

                            <div style={styles.detailSummaryGrid}>
                                <div style={styles.detailSummaryCard}>
                                    <span style={styles.detailSummaryLabel}>Productos</span>
                                    <strong style={styles.detailSummaryValue}>{productCount}</strong>
                                </div>
                                <div style={styles.detailSummaryCard}>
                                    <span style={styles.detailSummaryLabel}>Unidades</span>
                                    <strong style={styles.detailSummaryValue}>{formatAmount(unitsCount)}</strong>
                                </div>
                                <div style={styles.detailSummaryCard}>
                                    <span style={styles.detailSummaryLabel}>Valor venta</span>
                                    <strong style={styles.detailSummaryValue}>S/ {formatAmount(selectedSale.vvta)}</strong>
                                </div>
                                <div style={styles.detailSummaryCardStrong}>
                                    <span style={styles.detailSummaryLabel}>Total</span>
                                    <strong style={styles.detailSummaryValue}>S/ {formatAmount(selectedSale.total)}</strong>
                                </div>
                            </div>

                            <section style={styles.detailSection}>
                                <div style={styles.sectionTitleRow}>
                                    <h3 style={styles.sectionTitle}>Productos vendidos</h3>
                                    <span style={styles.sectionBadge}>{productCount} item(s)</span>
                                </div>

                                {saleDetailItems.length === 0 ? (
                                    <p style={styles.emptyMessage}>No se encontraron productos para esta venta.</p>
                                ) : (
                                    <div style={styles.productList}>
                                        {saleDetailItems.map((item, index) => {
                                            const itemPhotos = getPhotosByRegmovdet(item.iddet);

                                            return (
                                                <div key={item.iddet || index} style={styles.productItem}>
                                                    <div style={styles.productIndex}>{index + 1}</div>
                                                    <div style={styles.productInfo}>
                                                        <strong style={styles.productName}>
                                                            {item.nomproducto || "Producto sin nombre"}
                                                        </strong>
                                                        <span style={styles.productCode}>
                                                            Codigo: {item.producto || "N/A"} · Detalle: {item.iddet || "N/A"}
                                                        </span>
                                                    </div>
                                                    <div style={styles.productNumbers}>
                                                        <span>Cant. {formatAmount(item.cantidad)}</span>
                                                        <span>Precio S/ {formatAmount(item.precio)}</span>
                                                        <strong>Total S/ {formatAmount(item.total)}</strong>
                                                    </div>

                                                    {itemPhotos.length > 0 && (
                                                        <div style={styles.productPhotoStrip}>
                                                            <span style={styles.productPhotoBadge}>
                                                                {itemPhotos.length} foto(s) vinculada(s)
                                                            </span>
                                                            <div style={styles.productInlinePhotos}>
                                                                {itemPhotos.slice(0, 4).map((photo, photoIndex) => (
                                                                    <button
                                                                        key={photo.id || `${item.iddet}-${photoIndex}`}
                                                                        type="button"
                                                                        style={styles.productPhotoButton}
                                                                        onClick={() => {
                                                                            const globalIndex = saleDetailPhotos.findIndex(
                                                                                (registeredPhoto) => registeredPhoto.id === photo.id
                                                                            );
                                                                            setSelectedPhotoIndex(globalIndex >= 0 ? globalIndex : 0);
                                                                        }}
                                                                    >
                                                                        <img
                                                                            src={buildPhotoSrc(photo.foto_codigo)}
                                                                            alt={photo.nombre_producto || item.nomproducto || "Foto"}
                                                                            style={styles.productInlinePhoto}
                                                                        />
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </section>

                            {saleDetailPhotos.length > 0 && (
                                <section style={styles.detailSection}>
                                    <div style={styles.sectionTitleRow}>
                                        <h3 style={styles.sectionTitle}>Fotos registradas</h3>
                                        <span style={styles.sectionBadge}>{saleDetailPhotos.length} foto(s)</span>
                                    </div>

                                    <div style={styles.photoWorkspace}>
                                        <div style={styles.photoPreviewCard}>
                                            <img
                                                src={buildPhotoSrc(selectedPhoto?.foto_codigo)}
                                                alt={selectedPhoto?.nombre_producto || "Foto de producto"}
                                                style={styles.photoPreview}
                                            />
                                            <div style={styles.photoDescription}>
                                                <strong>{selectedPhoto?.nombre_producto || "Producto sin nombre"}</strong>
                                                <span>Precio vendido: S/ {formatAmount(selectedPhoto?.precio_vendido)}</span>
                                                <span>Cantidad: {formatAmount(selectedPhoto?.cantidad)}</span>
                                                <span>Fecha: {selectedPhoto?.fecha || "Sin fecha"}</span>
                                            </div>
                                        </div>

                                        <div style={styles.photoThumbList}>
                                            {saleDetailPhotos.map((photo, index) => (
                                                <button
                                                    key={photo.id || index}
                                                    type="button"
                                                    onClick={() => setSelectedPhotoIndex(index)}
                                                    style={index === selectedPhotoIndex
                                                        ? styles.photoThumbButtonActive
                                                        : styles.photoThumbButton}
                                                >
                                                    <img
                                                        src={buildPhotoSrc(photo.foto_codigo)}
                                                        alt={photo.nombre_producto || "Foto"}
                                                        style={styles.photoThumb}
                                                    />
                                                    <span style={styles.photoThumbText}>
                                                        {photo.nombre_producto || `Foto ${index + 1}`}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </section>
                            )}
                        </>
                    )}
                </div>
            </div>
        );
    };

    const hasFilters = (filters) => Boolean(filters.numDocum || filters.status);

    const buildFilters = () => ({
        numDocum: searchTerm.trim(),
        status: historicalStatus,
    });

    const loadMainSalesPage = async (page = 1, filters = activeFilters, append = false) => {
        if (page === 1) {
            setIsSearching(true);
        } else {
            setIsLoadingMoreMain(true);
        }

        try {
            const result = await dailySalesService.getPage(page, 10, filters);
            const ventas = result.ventas || [];
            const total = result.total || 0;

            setSales((prev) => (append ? [...prev, ...ventas] : ventas));
            setTotalSales(total);
            setMainPage(page);
            setActiveFilters(filters);
            setIsFilteredView(hasFilters(filters));

            if (hasFilters(filters)) {
                setShowHistorical(false);
            }
        } catch (error) {
            console.error("Error al cargar ventas filtradas:", error);
        } finally {
            setIsSearching(false);
            setIsLoadingMoreMain(false);
        }
    };

    const handleCompleteSale = async (venta) => {
        if (!venta || !venta.idmov) {
            console.warn("No se recibió un idmov válido para completar la venta.");
            return;
        }

        const vendedor = window.prompt(
            "Ingrese el nombre (o DNI) de la persona que realizó la venta:"
        );

        if (!vendedor || !vendedor.trim()) {
            return;
        }

        try {
            await dailySalesService.changeStateToComplete(venta.idmov, vendedor.trim());

            if (isFilteredView) {
                await loadMainSalesPage(1, activeFilters);
            } else {
                await fetchSales();
            }

            if (showHistorical && !isFilteredView) {
                await loadHistoricalSales(historicalPage);
            }
        } catch (error) {
            console.error("Error al completar la venta:", error);
            const message = error?.response?.data?.error || "Error al completar la venta.";
            alert(message);
        }
    };

    const loadHistoricalSales = async (page = 1, customFilters = null) => {
        setIsHistoricalLoading(true);
        try {
            const activeFilters = customFilters || {
                numDocum: searchTerm.trim(),
                status: historicalStatus,
            };

            const result = await dailySalesService.getPage(page, 10, activeFilters);
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

    const handleSearch = async () => {
        const filters = buildFilters();

        if (!hasFilters(filters)) {
            clearSearch();
            return;
        }

        await loadMainSalesPage(1, filters);
    };

    const clearSearch = () => {
        const emptyFilters = { numDocum: "", status: "" };

        setSearchTerm("");
        setHistoricalStatus("");
        setActiveFilters(emptyFilters);
        setIsFilteredView(false);
        setMainPage(1);
        setTotalSales(0);
        setShowHistorical(false);
        setHistoricalSales([]);
        setHistoricalPage(1);
        setTotalHistorical(0);
        fetchSales();
    };

    const handleShowHistorical = () => {
        if (!showHistorical) {
            loadHistoricalSales(1);
        }
        setShowHistorical(!showHistorical);
    };

    const handleLoadMoreMain = () => {
        if (!isFilteredView || isLoadingMoreMain || sales.length >= totalSales) {
            return;
        }

        const nextPage = mainPage + 1;
        loadMainSalesPage(nextPage, activeFilters, true);
    };

    const handleLoadMore = () => {
        const nextPage = historicalPage + 1;
        loadHistoricalSales(nextPage);
    };

    const renderSearchFilters = () => (
        <div style={styles.searchContainer}>
            <div style={styles.searchFiltersRow}>
                <div style={styles.filterField}>
                    <label style={styles.filterLabel}>Buscar por Estado</label>
                    <select
                        value={historicalStatus}
                        onChange={(e) => setHistoricalStatus(e.target.value)}
                        style={styles.statusSelect}
                    >
                        <option value="">Todos</option>
                        <option value="ANULADO">ANULADO</option>
                        <option value="COMPLETADO">COMPLETADO</option>
                        <option value="EN PROCESO">EN PROCESO</option>
                    </select>
                </div>

                <div style={styles.filterField}>
                    <label style={styles.filterLabel}>Buscar por Número de Documento</label>
                    <input
                        type="text"
                        placeholder="Ej. N006 - 55945"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={styles.searchInput}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                </div>

                <div style={styles.filterActions}>
                    <button
                        style={styles.searchActionButton}
                        onClick={handleSearch}
                        disabled={isSearching}
                    >
                        <FaSearch />
                        <span>Buscar</span>
                    </button>

                    {(searchTerm || historicalStatus) && (
                        <button style={styles.clearButton} onClick={clearSearch}>
                            Limpiar
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    const renderSaleCard = (venta, index) => {
        const statusUI = getStatusUI(venta.estado);
        const cardKey = venta.idmov || venta.idcab || venta.num_docum || index;

        return (
            <div key={cardKey} style={styles.card}>
                <div style={styles.cardHeader}>
                    <div style={styles.cardHeaderContent}>
                        <h3 style={styles.cardTitle}>
                            {venta.num_docum || "Sin número de documento"}
                        </h3>
                        <p style={styles.cardDate}>
                            Fecha: {formatSaleDate(venta.fecha)}
                        </p>
                    </div>

                    <span style={{ ...styles.statusBadge, ...statusUI }}>
                        {venta.estado || "N/A"}
                    </span>
                </div>

                <div style={styles.cardDivider} />

                <div style={styles.cardBody}>
                    <div style={styles.infoRow}>
                        <span style={styles.infoLabel}>Cliente</span>
                        <span style={styles.infoValue}>{venta.cliente || "N/A"}</span>
                    </div>

                    <div style={styles.infoRow}>
                        <span style={styles.infoLabel}>IGV</span>
                        <span style={styles.infoValue}>{formatAmount(venta.igv)}</span>
                    </div>
                </div>

                <div style={styles.totalsBox}>
                    <div style={styles.totalRow}>
                        <span style={styles.totalLabel}>Valor de venta</span>
                        <span style={styles.totalValue}>S/ {formatAmount(venta.vvta)}</span>
                    </div>
                    <div style={{ ...styles.totalRow, ...styles.totalRowStrong }}>
                        <span style={styles.totalLabel}>Total</span>
                        <span style={styles.totalValue}>S/ {formatAmount(venta.total)}</span>
                    </div>
                </div>

                <div style={styles.actionsColumn}>
                    <button
                        style={styles.primaryButton}
                        onClick={() => openModal(venta)}
                    >
                        Más Información
                    </button>

                    {canCompleteSale(venta.estado) && (
                        <button
                            style={styles.secondaryActionButton}
                            onClick={() => handleCompleteSale(venta)}
                        >
                            Marcar como completada
                        </button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Ventas Diarias</h2>
            {role === "admin" && renderSearchFilters()}
            {isLoading ? (
                <p>Cargando ventas diarias...</p>
            ) : (
                <>
                    {isSearching && mainPage === 1 ? (
                        <p>Buscando ventas...</p>
                    ) : sales.length === 0 ? (
                        <p>{isFilteredView ? "No se encontraron ventas con esos filtros." : "No hay ventas registradas hoy."}</p>
                    ) : (
                        <div style={styles.cardList}>
                            {sales.map((venta, index) => renderSaleCard(venta, index))}
                        </div>
                    )}
                </>
            )}

            {role === "admin" && isFilteredView && sales.length < totalSales && (
                <div style={styles.historicalToggleContainer}>
                    {isLoadingMoreMain ? (
                        <p>Cargando más resultados...</p>
                    ) : (
                        <button style={styles.button} onClick={handleLoadMoreMain}>
                            Ver más resultados
                        </button>
                    )}
                </div>
            )}

            {role === "admin" && !isFilteredView && (
                <div style={styles.historicalToggleContainer}>
                    <button style={styles.button} onClick={handleShowHistorical}>
                        {showHistorical ? "Ocultar Registro Histórico" : "MOSTRAR REGISTRO HISTÓRICO"}
                    </button>
                </div>
            )}

            {role === "admin" && !isFilteredView && showHistorical && (
                <div style={styles.historicalSection}>
                    <h2 style={styles.title}>Registro Histórico</h2>

                    {isHistoricalLoading && historicalPage === 1 ? (
                        <p>Cargando registro histórico...</p>
                    ) : (
                        <>
                            {historicalSales.length === 0 ? (
                                <p>No hay registros históricos.</p>
                            ) : (
                                <div style={styles.cardList}>
                                    {historicalSales.map((venta, index) => renderSaleCard(venta, index))}
                                </div>
                            )}

                            {!searchTerm && !historicalStatus && historicalSales.length < totalHistorical && (
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

            {renderSaleDetailsModal()}
        </div>
    );
};

const styles = {
    container: {
        background: "linear-gradient(135deg, #14181f 0%, #1b2129 100%)",
        padding: "24px",
        margin: "10px auto",
        maxWidth: "92%",
        borderRadius: "18px",
        boxShadow: "0 12px 30px rgba(15, 23, 42, 0.24)",
    },
    title: {
        marginBottom: "18px",
        fontFamily: "'PT Sans Narrow', sans-serif",
        fontSize: "32px",
        textAlign: "center",
        color: "#F9FAFB",
        letterSpacing: "0.5px",
    },
    cardList: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
        gap: "32px",
        alignItems: "start",
        marginTop: "18px",
        marginBottom: "28px",
    },
    card: {
        background: "linear-gradient(180deg, #1C1917 0%, #111111 100%)",
        border: "1px solid rgba(245, 158, 11, 0.16)",
        borderRadius: "18px",
        padding: "18px",
        boxShadow: "0 14px 28px rgba(0, 0, 0, 0.35)",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        minHeight: "auto",
    },
    cardHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "12px",
    },
    cardHeaderContent: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        minWidth: 0,
    },
    cardTitle: {
        fontSize: "18px",
        fontWeight: 700,
        margin: 0,
        color: "#F9FAFB",
        lineHeight: "1.3",
    },
    cardDate: {
        margin: 0,
        fontSize: "13px",
        color: "#94A3B8",
    },
    statusBadge: {
        alignSelf: "flex-start",
        padding: "6px 10px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: 700,
        letterSpacing: "0.3px",
        whiteSpace: "nowrap",
    },
    cardDivider: {
        height: "1px",
        background: "rgba(148, 163, 184, 0.14)",
    },
    cardBody: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },
    infoRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "12px",
    },
    infoLabel: {
        fontSize: "13px",
        color: "#94A3B8",
        fontWeight: 600,
    },
    infoValue: {
        fontSize: "14px",
        color: "#F8FAFC",
        fontWeight: 600,
        textAlign: "right",
    },
    totalsBox: {
        background: "rgba(255, 255, 255, 0.04)",
        border: "1px solid rgba(148, 163, 184, 0.12)",
        borderRadius: "14px",
        padding: "12px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },
    totalRow: {
        display: "flex",
        justifyContent: "space-between",
        gap: "12px",
    },
    totalRowStrong: {
        paddingTop: "10px",
        borderTop: "1px solid rgba(148, 163, 184, 0.14)",
    },
    totalLabel: {
        fontSize: "14px",
        color: "#CBD5E1",
        fontWeight: 600,
    },
    totalValue: {
        fontSize: "16px",
        color: "#FFFFFF",
        fontWeight: 700,
    },
    actionsColumn: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        marginTop: "auto",
    },
    button: {
        marginTop: "8px",
        padding: "12px 18px",
        background: "linear-gradient(135deg, #4B5563 0%, #374151 100%)",
        color: "white",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "12px",
        cursor: "pointer",
        fontWeight: 700,
    },
    historicalToggleContainer: {
        margin: "30px 0 26px",
        textAlign: "center",
    },
    historicalSection: {
        marginTop: "10px",
        marginBottom: "34px",
    },
    primaryButton: {
        padding: "12px 16px",
        background: "linear-gradient(135deg, #4B5563 0%, #374151 100%)",
        color: "white",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "12px",
        cursor: "pointer",
        fontWeight: 700,
        width: "100%",
    },
    secondaryActionButton: {
        padding: "12px 16px",
        background: "rgba(245, 158, 11, 0.14)",
        color: "#FCD34D",
        border: "1px solid rgba(251, 191, 36, 0.28)",
        borderRadius: "12px",
        cursor: "pointer",
        fontWeight: 700,
        width: "100%",
    },
    searchContainer: {
        width: "100%",
        margin: "0 0 30px",
    },
    searchFiltersRow: {
        display: "grid",
        gridTemplateColumns: "minmax(240px, 300px) minmax(320px, 1fr) minmax(210px, 260px)",
        gap: "18px",
        alignItems: "end",
    },
    filterField: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },
    filterLabel: {
        fontSize: "14px",
        fontWeight: 700,
        color: "#F3F4F6",
    },
    statusSelect: {
        padding: "12px 14px",
        border: "1px solid rgba(148, 163, 184, 0.25)",
        borderRadius: "12px",
        minWidth: "100%",
        outline: "none",
        backgroundColor: "#1F2937",
        color: "#F9FAFB",
    },
    searchInput: {
        padding: "12px 14px",
        border: "1px solid rgba(148, 163, 184, 0.25)",
        borderRadius: "12px",
        outline: "none",
        width: "100%",
        backgroundColor: "#1F2937",
        color: "#F9FAFB",
        boxSizing: "border-box",
    },
    filterActions: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        justifyContent: "flex-end",
    },
    searchActionButton: {
        padding: "12px 16px",
        border: "none",
        background: "linear-gradient(135deg, #4B5563 0%, #374151 100%)",
        color: "white",
        borderRadius: "12px",
        cursor: "pointer",
        fontWeight: "bold",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
    },
    clearButton: {
        padding: "12px 16px",
        border: "1px solid rgba(248, 113, 113, 0.32)",
        background: "rgba(239, 68, 68, 0.12)",
        color: "#FCA5A5",
        borderRadius: "12px",
        cursor: "pointer",
        fontWeight: 700,
    },
    detailOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(3, 7, 18, 0.78)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "22px",
        boxSizing: "border-box",
    },
    detailModal: {
        width: "min(1080px, 96vw)",
        maxHeight: "92vh",
        overflowY: "auto",
        background: "linear-gradient(180deg, #111827 0%, #0F172A 100%)",
        border: "1px solid rgba(245, 158, 11, 0.22)",
        borderRadius: "22px",
        padding: "22px",
        boxShadow: "0 28px 80px rgba(0, 0, 0, 0.55)",
        color: "#F9FAFB",
    },
    detailHeader: {
        display: "flex",
        justifyContent: "space-between",
        gap: "18px",
        alignItems: "flex-start",
        borderBottom: "1px solid rgba(148, 163, 184, 0.16)",
        paddingBottom: "16px",
        marginBottom: "18px",
    },
    detailHeaderActions: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
    },
    detailEyebrow: {
        color: "#FBBF24",
        fontSize: "12px",
        fontWeight: 800,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
    },
    detailTitle: {
        margin: "6px 0 4px",
        fontSize: "28px",
        fontFamily: "'PT Sans Narrow', sans-serif",
        letterSpacing: "0.4px",
    },
    detailSubtitle: {
        margin: 0,
        color: "#94A3B8",
        fontSize: "14px",
    },
    detailCloseButton: {
        width: "38px",
        height: "38px",
        borderRadius: "12px",
        border: "1px solid rgba(248, 113, 113, 0.30)",
        background: "rgba(239, 68, 68, 0.14)",
        color: "#FCA5A5",
        cursor: "pointer",
        fontSize: "18px",
        fontWeight: 800,
    },
    detailLoadingBox: {
        padding: "32px",
        textAlign: "center",
        background: "rgba(255, 255, 255, 0.04)",
        borderRadius: "16px",
        color: "#CBD5E1",
    },
    detailError: {
        padding: "12px 14px",
        background: "rgba(239, 68, 68, 0.12)",
        border: "1px solid rgba(248, 113, 113, 0.28)",
        color: "#FCA5A5",
        borderRadius: "12px",
    },
    detailSummaryGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: "12px",
        marginBottom: "18px",
    },
    detailSummaryCard: {
        padding: "14px",
        borderRadius: "16px",
        background: "rgba(255, 255, 255, 0.045)",
        border: "1px solid rgba(148, 163, 184, 0.14)",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
    },
    detailSummaryCardStrong: {
        padding: "14px",
        borderRadius: "16px",
        background: "rgba(245, 158, 11, 0.12)",
        border: "1px solid rgba(245, 158, 11, 0.28)",
        display: "flex",
        flexDirection: "column",
        gap: "6px",
    },
    detailSummaryLabel: {
        color: "#94A3B8",
        fontSize: "12px",
        fontWeight: 800,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
    },
    detailSummaryValue: {
        color: "#F9FAFB",
        fontSize: "22px",
    },
    detailSection: {
        marginTop: "18px",
        padding: "16px",
        borderRadius: "18px",
        background: "rgba(255, 255, 255, 0.035)",
        border: "1px solid rgba(148, 163, 184, 0.12)",
    },
    sectionTitleRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "12px",
        marginBottom: "12px",
    },
    sectionTitle: {
        margin: 0,
        fontSize: "19px",
        color: "#F8FAFC",
    },
    sectionBadge: {
        padding: "6px 10px",
        borderRadius: "999px",
        background: "rgba(245, 158, 11, 0.14)",
        border: "1px solid rgba(245, 158, 11, 0.25)",
        color: "#FCD34D",
        fontSize: "12px",
        fontWeight: 800,
        whiteSpace: "nowrap",
    },
    emptyMessage: {
        margin: 0,
        color: "#CBD5E1",
    },
    productList: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },
    productItem: {
        display: "grid",
        gridTemplateColumns: "44px minmax(0, 1fr)",
        gap: "12px",
        alignItems: "center",
        padding: "12px",
        borderRadius: "14px",
        background: "rgba(15, 23, 42, 0.78)",
        border: "1px solid rgba(148, 163, 184, 0.12)",
    },
    productIndex: {
        width: "34px",
        height: "34px",
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(245, 158, 11, 0.16)",
        color: "#FCD34D",
        fontWeight: 900,
    },
    productInfo: {
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        minWidth: 0,
    },
    productName: {
        color: "#F8FAFC",
        lineHeight: 1.25,
    },
    productCode: {
        color: "#94A3B8",
        fontSize: "12px",
    },
    productNumbers: {
        gridColumn: "1 / -1",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "flex-end",
        gap: "8px 14px",
        textAlign: "right",
        color: "#CBD5E1",
        fontSize: "13px",
        fontWeight: 700,
    },
    productPhotoStrip: {
        gridColumn: "1 / -1",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "10px",
        flexWrap: "wrap",
        paddingTop: "10px",
        borderTop: "1px solid rgba(148, 163, 184, 0.12)",
    },
    productPhotoBadge: {
        padding: "5px 9px",
        borderRadius: "999px",
        background: "rgba(245, 158, 11, 0.12)",
        border: "1px solid rgba(245, 158, 11, 0.24)",
        color: "#FCD34D",
        fontSize: "12px",
        fontWeight: 800,
    },
    productInlinePhotos: {
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
    },
    productPhotoButton: {
        padding: 0,
        border: "1px solid rgba(148, 163, 184, 0.18)",
        borderRadius: "10px",
        background: "#020617",
        cursor: "pointer",
        overflow: "hidden",
    },
    productInlinePhoto: {
        width: "48px",
        height: "48px",
        objectFit: "cover",
        display: "block",
    },
    photoWorkspace: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "16px",
        alignItems: "start",
    },
    photoPreviewCard: {
        background: "rgba(15, 23, 42, 0.78)",
        border: "1px solid rgba(148, 163, 184, 0.12)",
        borderRadius: "16px",
        padding: "14px",
    },
    photoPreview: {
        width: "100%",
        maxHeight: "420px",
        objectFit: "contain",
        borderRadius: "14px",
        background: "#020617",
        display: "block",
    },
    photoDescription: {
        marginTop: "12px",
        display: "grid",
        gap: "6px",
        color: "#CBD5E1",
        fontSize: "14px",
    },
    photoThumbList: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        maxHeight: "520px",
        overflowY: "auto",
        paddingRight: "4px",
    },
    photoThumbButton: {
        display: "grid",
        gridTemplateColumns: "58px 1fr",
        gap: "10px",
        alignItems: "center",
        padding: "8px",
        borderRadius: "14px",
        border: "1px solid rgba(148, 163, 184, 0.12)",
        background: "rgba(15, 23, 42, 0.78)",
        color: "#CBD5E1",
        cursor: "pointer",
        textAlign: "left",
    },
    photoThumbButtonActive: {
        display: "grid",
        gridTemplateColumns: "58px 1fr",
        gap: "10px",
        alignItems: "center",
        padding: "8px",
        borderRadius: "14px",
        border: "1px solid rgba(245, 158, 11, 0.42)",
        background: "rgba(245, 158, 11, 0.14)",
        color: "#FCD34D",
        cursor: "pointer",
        textAlign: "left",
    },
    photoThumb: {
        width: "58px",
        height: "58px",
        objectFit: "cover",
        borderRadius: "10px",
        background: "#020617",
    },
    photoThumbText: {
        fontSize: "13px",
        fontWeight: 800,
        lineHeight: 1.25,
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
    },
};

export default DailySales;
