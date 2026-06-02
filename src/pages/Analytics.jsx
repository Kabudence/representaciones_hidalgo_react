import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import analyticsService from "../services/analyticsService";

const PAYMENT_RANGES = [
    { value: "today", label: "Hoy" },
    { value: "7d", label: "7 días" },
    { value: "month", label: "Mes" },
];

const ANALYTICS_RANGES = [
    { value: "7d", label: "7 días" },
    { value: "1m", label: "1 mes" },
    { value: "3m", label: "3 meses" },
    { value: "6m", label: "6 meses" },
    { value: "1y", label: "1 año" },
];

const MONTH_OPTIONS = [
    { value: 3, label: "3 meses" },
    { value: 6, label: "6 meses" },
    { value: 12, label: "12 meses" },
];

const styles = {
    page: {
        minHeight: "100vh",
        background: "#10151d",
        color: "#f8fafc",
        padding: "28px 24px 48px",
        fontFamily: "Arial, sans-serif",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "16px",
        marginBottom: "22px",
    },
    title: {
        margin: 0,
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: "38px",
        letterSpacing: "1px",
    },
    subtitle: {
        margin: "8px 0 0",
        color: "#94a3b8",
        fontSize: "14px",
    },
    card: {
        background: "linear-gradient(180deg, #182131 0%, #111827 100%)",
        border: "1px solid #27364d",
        borderRadius: "18px",
        boxShadow: "0 16px 30px rgba(0, 0, 0, 0.25)",
        padding: "20px",
        minWidth: 0,
    },
    cardHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "14px",
        marginBottom: "16px",
    },
    cardTitle: {
        margin: 0,
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: "24px",
        letterSpacing: "0.7px",
    },
    select: {
        backgroundColor: "#0f172a",
        border: "1px solid #334155",
        borderRadius: "10px",
        color: "#f8fafc",
        padding: "9px 12px",
        fontWeight: "700",
        outline: "none",
        minWidth: "120px",
    },
    metricGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: "12px",
        marginBottom: "18px",
    },
    metricCard: {
        background: "#0f172a",
        border: "1px solid #26344a",
        borderRadius: "14px",
        padding: "14px",
    },
    metricLabel: {
        color: "#94a3b8",
        fontSize: "12px",
        marginBottom: "8px",
        textTransform: "uppercase",
        letterSpacing: "0.6px",
    },
    metricValue: {
        fontSize: "21px",
        fontWeight: "800",
        color: "#f8fafc",
    },
    list: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },
    listRow: {
        background: "#0f172a",
        border: "1px solid #26344a",
        borderRadius: "14px",
        padding: "12px",
    },
    rowTop: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "12px",
        marginBottom: "8px",
    },
    rowTitle: {
        fontWeight: "800",
        color: "#f8fafc",
    },
    rowSubtitle: {
        color: "#94a3b8",
        fontSize: "12px",
    },
    amount: {
        fontWeight: "800",
        color: "#facc15",
        whiteSpace: "nowrap",
    },
    progressOuter: {
        height: "8px",
        borderRadius: "999px",
        background: "#1e293b",
        overflow: "hidden",
    },
    progressInner: {
        height: "100%",
        borderRadius: "999px",
        background: "linear-gradient(90deg, #facc15, #22c55e)",
    },
    chartWrap: {
        display: "flex",
        alignItems: "end",
        gap: "10px",
        height: "230px",
        borderRadius: "14px",
        background: "#0f172a",
        border: "1px solid #26344a",
        padding: "18px 14px 12px",
        overflowX: "auto",
    },
    chartBarBox: {
        minWidth: "58px",
        flex: "1 0 58px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        height: "100%",
        gap: "8px",
    },
    chartBar: {
        width: "100%",
        maxWidth: "42px",
        borderRadius: "10px 10px 4px 4px",
        background: "linear-gradient(180deg, #22c55e 0%, #16a34a 100%)",
        minHeight: "8px",
    },
    chartLabel: {
        color: "#94a3b8",
        fontSize: "11px",
        whiteSpace: "nowrap",
    },
    chartAmount: {
        color: "#f8fafc",
        fontSize: "11px",
        fontWeight: "700",
        whiteSpace: "nowrap",
    },
    tableContainer: {
        overflowX: "auto",
        borderRadius: "14px",
        border: "1px solid #26344a",
        background: "#0f172a",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        minWidth: "720px",
    },
    th: {
        textAlign: "left",
        color: "#cbd5e1",
        fontSize: "12px",
        textTransform: "uppercase",
        letterSpacing: "0.6px",
        borderBottom: "1px solid #26344a",
        padding: "12px",
    },
    td: {
        color: "#f8fafc",
        borderBottom: "1px solid #1e293b",
        padding: "12px",
        fontSize: "14px",
    },
    empty: {
        background: "#0f172a",
        border: "1px dashed #334155",
        borderRadius: "14px",
        color: "#94a3b8",
        padding: "18px",
        textAlign: "center",
    },
    error: {
        background: "rgba(220, 38, 38, 0.15)",
        border: "1px solid rgba(248, 113, 113, 0.45)",
        color: "#fecaca",
        borderRadius: "12px",
        padding: "12px",
        marginBottom: "14px",
    },
    badge: {
        display: "inline-flex",
        alignItems: "center",
        borderRadius: "999px",
        padding: "6px 10px",
        fontSize: "12px",
        fontWeight: "800",
        background: "rgba(250, 204, 21, 0.15)",
        color: "#facc15",
        border: "1px solid rgba(250, 204, 21, 0.35)",
    },
};

const css = `
    .analytics-grid-2 {
        display: grid;
        grid-template-columns: minmax(0, 1.15fr) minmax(360px, 0.85fr);
        gap: 18px;
        margin-bottom: 18px;
    }

    .analytics-grid-3 {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 18px;
        margin-bottom: 18px;
    }

    .analytics-month-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 14px;
    }

    @media (max-width: 1120px) {
        .analytics-grid-2,
        .analytics-grid-3 {
            grid-template-columns: 1fr;
        }
    }

    @media (max-width: 720px) {
        .analytics-page {
            padding: 20px 12px 36px !important;
        }

        .analytics-header,
        .analytics-card-header {
            flex-direction: column;
            align-items: stretch !important;
        }
    }
`;

const formatCurrency = (value) => {
    const amount = Number(value || 0);
    return `S/ ${amount.toLocaleString("es-PE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
};

const formatNumber = (value) => {
    const amount = Number(value || 0);
    return amount.toLocaleString("es-PE", {
        minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 2,
    });
};

const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(`${value}T00:00:00`);
    return date.toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit" });
};

const formatMonth = (value) => {
    if (!value) return "-";
    const date = new Date(`${value}-01T00:00:00`);
    return date.toLocaleDateString("es-PE", { month: "long", year: "numeric" });
};

const getErrorMessage = (error) => {
    return error?.response?.data?.error || error?.response?.data?.msg || error?.message || "No se pudo cargar la información.";
};

const SectionCard = ({ title, children, rightContent }) => (
    <section style={styles.card}>
        <div className="analytics-card-header" style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>{title}</h2>
            {rightContent}
        </div>
        {children}
    </section>
);

const RangeSelect = ({ value, onChange, options }) => (
    <select style={styles.select} value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
            <option key={option.value} value={option.value}>
                {option.label}
            </option>
        ))}
    </select>
);

const MetricCard = ({ label, value }) => (
    <div style={styles.metricCard}>
        <div style={styles.metricLabel}>{label}</div>
        <div style={styles.metricValue}>{value}</div>
    </div>
);

const LoadingBlock = () => <div style={styles.empty}>Cargando información...</div>;

const EmptyBlock = ({ message = "No hay datos para mostrar." }) => <div style={styles.empty}>{message}</div>;

const ProgressList = ({ items, valueKey, titleKey, subtitleBuilder, amountBuilder }) => {
    const maxValue = Math.max(...items.map((item) => Number(item[valueKey] || 0)), 0);

    if (!items.length) {
        return <EmptyBlock />;
    }

    return (
        <div style={styles.list}>
            {items.map((item, index) => {
                const value = Number(item[valueKey] || 0);
                const width = maxValue > 0 ? Math.max((value / maxValue) * 100, 3) : 0;
                const key = item.idprod || item.tipo_venta_id || item.idvend || `${item[titleKey]}-${index}`;

                return (
                    <div key={key} style={styles.listRow}>
                        <div style={styles.rowTop}>
                            <div>
                                <div style={styles.rowTitle}>{item[titleKey]}</div>
                                <div style={styles.rowSubtitle}>{subtitleBuilder(item)}</div>
                            </div>
                            <div style={styles.amount}>{amountBuilder(item)}</div>
                        </div>
                        <div style={styles.progressOuter}>
                            <div style={{ ...styles.progressInner, width: `${width}%` }} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const SalesByDayChart = ({ data }) => {
    const rows = data || [];
    const maxValue = Math.max(...rows.map((row) => Number(row.monto_total || 0)), 0);

    if (!rows.length) {
        return <EmptyBlock />;
    }

    return (
        <div style={styles.chartWrap}>
            {rows.map((row) => {
                const amount = Number(row.monto_total || 0);
                const height = maxValue > 0 ? Math.max((amount / maxValue) * 165, 8) : 8;

                return (
                    <div key={row.fecha} style={styles.chartBarBox}>
                        <div style={styles.chartAmount}>{formatCurrency(amount)}</div>
                        <div style={{ ...styles.chartBar, height: `${height}px` }} />
                        <div style={styles.chartLabel}>{formatDate(row.fecha)}</div>
                    </div>
                );
            })}
        </div>
    );
};

const Analytics = () => {
    const navigate = useNavigate();
    const [isAuthorized, setIsAuthorized] = useState(false);

    const [paymentRange, setPaymentRange] = useState("today");
    const [productsRange, setProductsRange] = useState("7d");
    const [profitRange, setProfitRange] = useState("7d");
    const [sellersRange, setSellersRange] = useState("7d");
    const [monthlyMonths, setMonthlyMonths] = useState("12");

    const [paymentSummary, setPaymentSummary] = useState(null);
    const [topProducts, setTopProducts] = useState(null);
    const [profitProducts, setProfitProducts] = useState(null);
    const [sellersPerformance, setSellersPerformance] = useState(null);
    const [monthlyTopProducts, setMonthlyTopProducts] = useState(null);

    const [loading, setLoading] = useState({
        payment: false,
        products: false,
        profit: false,
        sellers: false,
        monthly: false,
    });

    const [errors, setErrors] = useState({
        payment: "",
        products: "",
        profit: "",
        sellers: "",
        monthly: "",
    });

    useEffect(() => {
        const storedAuthData = sessionStorage.getItem("authData");
        if (!storedAuthData) {
            navigate("/");
            return;
        }

        try {
            const parsedAuthData = JSON.parse(storedAuthData);
            if (parsedAuthData.role !== "admin") {
                navigate("/no-autorizado");
                return;
            }
            setIsAuthorized(true);
        } catch (error) {
            console.error("Error parseando authData:", error);
            navigate("/");
        }
    }, [navigate]);

    useEffect(() => {
        if (!isAuthorized) return;

        const fetchPaymentSummary = async () => {
            setLoading((prev) => ({ ...prev, payment: true }));
            setErrors((prev) => ({ ...prev, payment: "" }));
            try {
                const data = await analyticsService.getPaymentSummary(paymentRange);
                setPaymentSummary(data);
            } catch (error) {
                setErrors((prev) => ({ ...prev, payment: getErrorMessage(error) }));
            } finally {
                setLoading((prev) => ({ ...prev, payment: false }));
            }
        };

        fetchPaymentSummary();
    }, [isAuthorized, paymentRange]);

    useEffect(() => {
        if (!isAuthorized) return;

        const fetchTopProducts = async () => {
            setLoading((prev) => ({ ...prev, products: true }));
            setErrors((prev) => ({ ...prev, products: "" }));
            try {
                const data = await analyticsService.getTopProducts(productsRange, 10);
                setTopProducts(data);
            } catch (error) {
                setErrors((prev) => ({ ...prev, products: getErrorMessage(error) }));
            } finally {
                setLoading((prev) => ({ ...prev, products: false }));
            }
        };

        fetchTopProducts();
    }, [isAuthorized, productsRange]);

    useEffect(() => {
        if (!isAuthorized) return;

        const fetchProfitProducts = async () => {
            setLoading((prev) => ({ ...prev, profit: true }));
            setErrors((prev) => ({ ...prev, profit: "" }));
            try {
                const data = await analyticsService.getTopProfitProducts(profitRange, 10);
                setProfitProducts(data);
            } catch (error) {
                setErrors((prev) => ({ ...prev, profit: getErrorMessage(error) }));
            } finally {
                setLoading((prev) => ({ ...prev, profit: false }));
            }
        };

        fetchProfitProducts();
    }, [isAuthorized, profitRange]);

    useEffect(() => {
        if (!isAuthorized) return;

        const fetchSellersPerformance = async () => {
            setLoading((prev) => ({ ...prev, sellers: true }));
            setErrors((prev) => ({ ...prev, sellers: "" }));
            try {
                const data = await analyticsService.getSellersPerformance(sellersRange, 10);
                setSellersPerformance(data);
            } catch (error) {
                setErrors((prev) => ({ ...prev, sellers: getErrorMessage(error) }));
            } finally {
                setLoading((prev) => ({ ...prev, sellers: false }));
            }
        };

        fetchSellersPerformance();
    }, [isAuthorized, sellersRange]);

    useEffect(() => {
        if (!isAuthorized) return;

        const fetchMonthlyTopProducts = async () => {
            setLoading((prev) => ({ ...prev, monthly: true }));
            setErrors((prev) => ({ ...prev, monthly: "" }));
            try {
                const data = await analyticsService.getMonthlyTopProducts(Number(monthlyMonths), 5);
                setMonthlyTopProducts(data);
            } catch (error) {
                setErrors((prev) => ({ ...prev, monthly: getErrorMessage(error) }));
            } finally {
                setLoading((prev) => ({ ...prev, monthly: false }));
            }
        };

        fetchMonthlyTopProducts();
    }, [isAuthorized, monthlyMonths]);

    if (!isAuthorized) {
        return (
            <main className="analytics-page" style={styles.page}>
                <style>{css}</style>
                <EmptyBlock message="Validando acceso..." />
            </main>
        );
    }

    const paymentTotals = paymentSummary?.totals || {};
    const topByUnits = sellersPerformance?.top_by_units;
    const topByProfit = sellersPerformance?.top_by_profit;

    return (
        <main className="analytics-page" style={styles.page}>
            <style>{css}</style>

            <header className="analytics-header" style={styles.header}>
                <div>
                    <h1 style={styles.title}>Analíticas</h1>
                    <p style={styles.subtitle}>
                        Reportes de ventas, medios de pago, productos, ganancias y rendimiento de vendedores.
                    </p>
                </div>
            </header>

            <div className="analytics-grid-2">
                <SectionCard
                    title="Resumen por medio de pago"
                    rightContent={<RangeSelect value={paymentRange} onChange={setPaymentRange} options={PAYMENT_RANGES} />}
                >
                    {errors.payment && <div style={styles.error}>{errors.payment}</div>}
                    {loading.payment ? (
                        <LoadingBlock />
                    ) : (
                        <>
                            <div style={styles.metricGrid}>
                                <MetricCard label="Ventas" value={formatNumber(paymentTotals.ventas_count)} />
                                <MetricCard label="Unidades" value={formatNumber(paymentTotals.unidades_count)} />
                                <MetricCard label="Pagos" value={formatNumber(paymentTotals.pagos_count)} />
                                <MetricCard label="Total vendido" value={formatCurrency(paymentTotals.monto_total)} />
                            </div>

                            {Number(paymentTotals.ventas_sin_pago_o_descuadradas_count || 0) > 0 && (
                                <div style={styles.error}>
                                    Hay {formatNumber(paymentTotals.ventas_sin_pago_o_descuadradas_count)} venta(s) sin pago o con pagos descuadrados por {formatCurrency(paymentTotals.monto_sin_pago_o_descuadrado)}.
                                </div>
                            )}

                            <ProgressList
                                items={paymentSummary?.by_payment_method || []}
                                valueKey="monto_total"
                                titleKey="medio_pago"
                                subtitleBuilder={(item) => `${formatNumber(item.ventas_count)} venta(s) / ${formatNumber(item.pagos_count)} pago(s)`}
                                amountBuilder={(item) => formatCurrency(item.monto_total)}
                            />
                        </>
                    )}
                </SectionCard>

                <SectionCard title="Ventas por día">
                    {errors.payment && <div style={styles.error}>{errors.payment}</div>}
                    {loading.payment ? <LoadingBlock /> : <SalesByDayChart data={paymentSummary?.sales_by_day || []} />}
                </SectionCard>
            </div>

            <div className="analytics-grid-3">
                <SectionCard
                    title="Productos más vendidos"
                    rightContent={<RangeSelect value={productsRange} onChange={setProductsRange} options={ANALYTICS_RANGES} />}
                >
                    {errors.products && <div style={styles.error}>{errors.products}</div>}
                    {loading.products ? (
                        <LoadingBlock />
                    ) : (
                        <ProgressList
                            items={topProducts?.products || []}
                            valueKey="cantidad_total"
                            titleKey="nomproducto"
                            subtitleBuilder={(item) => `${formatNumber(item.ventas_count)} venta(s) / ${formatCurrency(item.monto_venta)}`}
                            amountBuilder={(item) => `${formatNumber(item.cantidad_total)} und.`}
                        />
                    )}
                </SectionCard>

                <SectionCard
                    title="Productos con más ganancia"
                    rightContent={<RangeSelect value={profitRange} onChange={setProfitRange} options={ANALYTICS_RANGES} />}
                >
                    {errors.profit && <div style={styles.error}>{errors.profit}</div>}
                    {loading.profit ? (
                        <LoadingBlock />
                    ) : (
                        <ProgressList
                            items={profitProducts?.products || []}
                            valueKey="ganancia_total"
                            titleKey="nomproducto"
                            subtitleBuilder={(item) => `${formatNumber(item.cantidad_total)} und. / margen ${formatNumber(item.margen_pct)}%`}
                            amountBuilder={(item) => formatCurrency(item.ganancia_total)}
                        />
                    )}
                </SectionCard>

                <SectionCard
                    title="Rendimiento por vendedor"
                    rightContent={<RangeSelect value={sellersRange} onChange={setSellersRange} options={ANALYTICS_RANGES} />}
                >
                    {errors.sellers && <div style={styles.error}>{errors.sellers}</div>}
                    {loading.sellers ? (
                        <LoadingBlock />
                    ) : (
                        <>
                            <div style={styles.metricGrid}>
                                <div style={styles.metricCard}>
                                    <div style={styles.metricLabel}>Más unidades</div>
                                    <div style={styles.metricValue}>{topByUnits?.nomvendedor || "-"}</div>
                                    <div style={styles.rowSubtitle}>{formatNumber(topByUnits?.productos_vendidos)} producto(s)</div>
                                </div>
                                <div style={styles.metricCard}>
                                    <div style={styles.metricLabel}>Más ganancia</div>
                                    <div style={styles.metricValue}>{topByProfit?.nomvendedor || "-"}</div>
                                    <div style={styles.rowSubtitle}>{formatCurrency(topByProfit?.ganancia_total)}</div>
                                </div>
                            </div>

                            <ProgressList
                                items={sellersPerformance?.sellers || []}
                                valueKey="ganancia_total"
                                titleKey="nomvendedor"
                                subtitleBuilder={(item) => `${formatNumber(item.productos_vendidos)} productos / margen ${formatNumber(item.margen_pct)}%`}
                                amountBuilder={(item) => formatCurrency(item.ganancia_total)}
                            />
                        </>
                    )}
                </SectionCard>
            </div>

            <div className="analytics-grid-2">
                <SectionCard title="Detalle diario por medio de pago">
                    {loading.payment ? (
                        <LoadingBlock />
                    ) : (paymentSummary?.payment_by_day || []).length ? (
                        <div style={styles.tableContainer}>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>Fecha</th>
                                        <th style={styles.th}>Medio</th>
                                        <th style={styles.th}>Ventas</th>
                                        <th style={styles.th}>Pagos</th>
                                        <th style={styles.th}>Monto</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paymentSummary.payment_by_day.map((row, index) => (
                                        <tr key={`${row.fecha}-${row.tipo_venta_id}-${index}`}>
                                            <td style={styles.td}>{formatDate(row.fecha)}</td>
                                            <td style={styles.td}>{row.medio_pago}</td>
                                            <td style={styles.td}>{formatNumber(row.ventas_count)}</td>
                                            <td style={styles.td}>{formatNumber(row.pagos_count)}</td>
                                            <td style={styles.td}>{formatCurrency(row.monto_total)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <EmptyBlock />
                    )}
                </SectionCard>

                <SectionCard
                    title="Productos más vendidos por mes"
                    rightContent={<RangeSelect value={monthlyMonths} onChange={setMonthlyMonths} options={MONTH_OPTIONS} />}
                >
                    {errors.monthly && <div style={styles.error}>{errors.monthly}</div>}
                    {loading.monthly ? (
                        <LoadingBlock />
                    ) : (monthlyTopProducts?.months || []).length ? (
                        <div className="analytics-month-grid">
                            {monthlyTopProducts.months.map((month) => (
                                <div key={month.month} style={styles.listRow}>
                                    <div style={{ ...styles.rowTop, marginBottom: "12px" }}>
                                        <div style={styles.rowTitle}>{formatMonth(month.month)}</div>
                                        <span style={styles.badge}>Top {month.products.length}</span>
                                    </div>
                                    <div style={styles.list}>
                                        {month.products.map((product) => (
                                            <div key={`${month.month}-${product.idprod}`} style={{ ...styles.rowTop, marginBottom: 0 }}>
                                                <div>
                                                    <div style={styles.rowTitle}>{product.nomproducto}</div>
                                                    <div style={styles.rowSubtitle}>{formatCurrency(product.monto_venta)}</div>
                                                </div>
                                                <div style={styles.amount}>{formatNumber(product.cantidad_total)} und.</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyBlock />
                    )}
                </SectionCard>
            </div>
        </main>
    );
};

export default Analytics;
