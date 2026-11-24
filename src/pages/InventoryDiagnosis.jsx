import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";
import analyticsService from "../services/analyticsService";
import productService from "../services/productService";
import { formatLimaDate } from "../utils/limaTime";
import "../assets/styles/inventory-diagnosis.css";

const numbers = new Intl.NumberFormat("es-PE", { maximumFractionDigits: 2 });
const money = new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" });
const searchKey = (value) => String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const relationLabels = { SELECCIONADO: "Seleccionado", NOMBRE_IGUAL: "Nombre igual", NOMBRE_PARECIDO: "Nombre parecido" };

const InventoryDiagnosis = () => {
    const [catalog, setCatalog] = useState([]);
    const [catalogError, setCatalogError] = useState("");
    const [query, setQuery] = useState("");
    const [productId, setProductId] = useState("");
    const [date, setDate] = useState(() => formatLimaDate().split("/").reverse().join("-"));
    const [daysBefore, setDaysBefore] = useState("3");
    const [daysAfter, setDaysAfter] = useState("3");
    const [request, setRequest] = useState(null);
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;
        productService.getAll().then((products) => {
            if (active) setCatalog(products);
        }).catch(() => {
            if (active) setCatalogError("No se pudo cargar el catálogo de productos.");
        });
        return () => { active = false; };
    }, []);

    const suggestions = useMemo(() => {
        const words = searchKey(query).trim().split(/\s+/).filter(Boolean);
        if (!words.length) return [];
        return catalog.filter((product) => {
            const label = searchKey(`${product.idprod} ${product.nomproducto}`);
            return words.every((word) => label.includes(word));
        }).slice(0, 20);
    }, [catalog, query]);

    useEffect(() => {
        if (!request) return;
        const controller = new AbortController();
        setLoading(true);
        setError("");
        analyticsService.getInventoryDiagnosis(request, controller.signal).then((result) => {
            if (!controller.signal.aborted) setReport(result);
        }).catch((requestError) => {
            if (!controller.signal.aborted) setError(requestError.response?.data?.error || "No se pudo consultar el diagnóstico.");
        }).finally(() => {
            if (!controller.signal.aborted) setLoading(false);
        });
        return () => controller.abort();
    }, [request]);

    const selectedId = productId || (suggestions.length === 1 ? suggestions[0].idprod : "");
    const runDiagnosis = (event) => {
        event.preventDefault();
        if (!selectedId) return;
        setReport(null);
        setRequest({ product_id: selectedId, date, days_before: daysBefore, days_after: daysAfter, page: 1 });
    };

    const selected = report?.products[0];
    const variantsWithSales = report?.products.slice(1).filter((product) => product.sales > 0).length ?? 0;
    const totalPages = report ? Math.ceil(report.total / report.size) : 0;

    return (
        <main className="inventory-diagnosis">
            <Link className="diagnosis-back" to="/analiticas"><FaArrowLeft aria-hidden="true" /> Analíticas</Link>
            <h1>Diagnóstico de inventario</h1>

            <form className="diagnosis-filters" onSubmit={runDiagnosis}>
                <label>Buscar producto<input type="search" value={query} placeholder="Nombre o código" onChange={(event) => { setQuery(event.target.value); setProductId(""); }} /></label>
                <label>Referencia
                    <select value={selectedId} onChange={(event) => setProductId(event.target.value)} disabled={!suggestions.length}>
                        {suggestions.length !== 1 && <option value="">{query ? "Seleccionar referencia" : "Sin referencia"}</option>}
                        {suggestions.map((product) => <option key={product.idprod} value={product.idprod}>{product.idprod} · {product.nomproducto}</option>)}
                    </select>
                </label>
                <label>Fecha de referencia<input type="date" required value={date} onChange={(event) => setDate(event.target.value)} /></label>
                <label>Días antes<input type="number" required min="0" max="60" step="1" value={daysBefore} onChange={(event) => setDaysBefore(event.target.value)} /></label>
                <label>Días después<input type="number" required min="0" max="60" step="1" value={daysAfter} onChange={(event) => setDaysAfter(event.target.value)} /></label>
                <button type="submit" disabled={!selectedId || loading}><FaSearch aria-hidden="true" /> Analizar</button>
            </form>

            {catalogError && <p role="alert">{catalogError}</p>}
            {query.trim() && catalog.length > 0 && !suggestions.length && <p role="status">No se encontraron productos.</p>}
            {loading && <p role="status">Consultando movimientos…</p>}
            {error && <p role="alert">{error}</p>}

            {report && selected && (
                <>
                    <section className="diagnosis-findings">
                        <h2>{selected.name}</h2>
                        <p>{selected.idprod} · {formatLimaDate(report.from_date)} a {formatLimaDate(report.to_date)}</p>
                        <dl>
                            <div><dt>Stock actual</dt><dd>{selected.stock == null ? "Sin dato" : numbers.format(selected.stock)}</dd></div>
                            <div><dt>Unidades vendidas</dt><dd>{numbers.format(selected.sold)}</dd></div>
                            <div><dt>Unidades compradas</dt><dd>{numbers.format(selected.purchased)}</dd></div>
                            <div><dt>Saldo de movimientos aplicados</dt><dd>{numbers.format(selected.purchased - selected.sold)}</dd></div>
                        </dl>
                        {selected.stock != null && selected.stock < 0 && <p className="diagnosis-alert">El stock actual de la referencia es negativo.</p>}
                        {selected.pending_sales > 0 && <p>{selected.pending_sales} venta(s) en proceso de esta referencia no se incluyen como descuento de stock.</p>}
                        {selected.cancelled > 0 && <p>{selected.cancelled} movimiento(s) anulado(s) de esta referencia no se incluyen en el saldo.</p>}
                        {variantsWithSales > 0 && <p className="diagnosis-alert">Hay ventas en {variantsWithSales} referencia(s) de nombre parecido. Compara el código, la medida, el modelo y el precio: la similitud no demuestra un registro equivocado.</p>}
                    </section>

                    <section>
                        <h2>Referencias comparadas</h2>
                        <div className="diagnosis-scroll" role="region" tabIndex={0} aria-label="Referencias comparadas">
                            <table>
                                <thead><tr><th scope="col">Producto</th><th scope="col">Relación</th><th scope="col">Modelo y medida</th><th scope="col">Tienda</th><th scope="col">Precio actual</th><th scope="col">Stock actual</th><th scope="col">Vendidas</th><th scope="col">Compradas</th></tr></thead>
                                <tbody>{report.products.map((product) => (
                                    <tr key={product.idprod}>
                                        <th scope="row">{product.idprod} · {product.name}</th><td>{relationLabels[product.relation]}</td>
                                        <td>{[product.model, product.size].filter(Boolean).join(" · ") || "-"}</td><td>{product.store || "-"}</td>
                                        <td>{money.format(product.catalog_price)}</td><td>{product.stock == null ? "-" : numbers.format(product.stock)}</td>
                                        <td>{numbers.format(product.sold)}</td><td>{numbers.format(product.purchased)}</td>
                                    </tr>
                                ))}</tbody>
                            </table>
                        </div>
                    </section>

                    <section>
                        <h2>Movimientos del rango</h2>
                        {report.movements.length ? (
                            <div className="diagnosis-scroll" role="region" tabIndex={0} aria-label="Movimientos de inventario">
                                <table>
                                    <thead><tr><th scope="col">Fecha</th><th scope="col">Documento</th><th scope="col">Referencia</th><th scope="col">Movimiento</th><th scope="col">Estado</th><th scope="col">Cantidad</th><th scope="col">Precio unitario</th><th scope="col">Stock registrado</th><th scope="col">Vendedor</th></tr></thead>
                                    <tbody>{report.movements.map((movement) => (
                                        <tr key={movement.iddet} data-variant={movement.product_id !== selected.idprod}>
                                            <td>{formatLimaDate(movement.date)}</td><th scope="row">{movement.document}</th>
                                            <td>{movement.product_id}</td><td>{movement.movement}</td><td>{movement.status}</td>
                                            <td>{numbers.format(movement.quantity)}</td><td>{money.format(movement.unit_price)}</td>
                                            <td>{movement.applied && movement.stock_after != null ? numbers.format(movement.stock_after) : "-"}</td>
                                            <td>{movement.seller || "-"}</td>
                                        </tr>
                                    ))}</tbody>
                                </table>
                            </div>
                        ) : <p>No hay movimientos en este intervalo.</p>}
                        {totalPages > 1 && (
                            <nav className="diagnosis-pages" aria-label="Páginas de movimientos">
                                <span>Página {report.page} de {totalPages}</span>
                                <button type="button" aria-label="Página anterior" disabled={loading || report.page <= 1} onClick={() => setRequest({ ...request, page: report.page - 1 })}><FaChevronLeft aria-hidden="true" /></button>
                                <button type="button" aria-label="Página siguiente" disabled={loading || report.page >= totalPages} onClick={() => setRequest({ ...request, page: report.page + 1 })}><FaChevronRight aria-hidden="true" /></button>
                            </nav>
                        )}
                    </section>
                </>
            )}
        </main>
    );
};

export default InventoryDiagnosis;