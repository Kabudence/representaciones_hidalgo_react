import { useEffect, useMemo, useState } from "react";
import paymentEvidenceService from "../services/paymentEvidenceService";
import { formatLimaDate, formatLimaTimestamp } from "../utils/limaTime";
import "./PaymentEvidence.css";

const EMPTY_PAYMENT = {
    tipo_venta_id: "",
    monto: "",
    referencia: "",
};

const getCurrentUsername = () => {
    try {
        const authData = JSON.parse(sessionStorage.getItem("authData") || "{}");
        return authData.username || "web";
    } catch {
        return "web";
    }
};

const toMoney = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
};

const formatMoney = (value) =>
    new Intl.NumberFormat("es-PE", {
        style: "currency",
        currency: "PEN",
        minimumFractionDigits: 2,
    }).format(toMoney(value));

const formatDate = (value, includeTime = false) => {
    if (!value) return "Sin fecha";
    return includeTime ? formatLimaTimestamp(value) : formatLimaDate(value);
};

const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error(`No se pudo leer ${file.name}`));
        reader.readAsDataURL(file);
    });

const PaymentEvidence = () => {
    const [evidenceStatus, setEvidenceStatus] = useState("PENDIENTE");
    const [initialView, setInitialView] = useState(true);
    const [saleStatus, setSaleStatus] = useState("");
    const [numDocum, setNumDocum] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const [sales, setSales] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [evidenceTypes, setEvidenceTypes] = useState([]);
    const [paymentTypes, setPaymentTypes] = useState([]);

    const [selectedIdmov, setSelectedIdmov] = useState(null);
    const [detail, setDetail] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailError, setDetailError] = useState("");

    const [paymentDrafts, setPaymentDrafts] = useState([{ ...EMPTY_PAYMENT }]);
    const [evidenceDrafts, setEvidenceDrafts] = useState([]);
    const [observation, setObservation] = useState("");
    const [saving, setSaving] = useState(false);

    const username = useMemo(() => getCurrentUsername(), []);

    const loadCatalogs = async () => {
        try {
            const [evidenceCatalog, paymentCatalog] = await Promise.all([
                paymentEvidenceService.getTypes(),
                paymentEvidenceService.getPaymentTypes(),
            ]);
            setEvidenceTypes(evidenceCatalog?.tipos_evidencia || []);
            setPaymentTypes(paymentCatalog || []);
        } catch (catalogError) {
            console.error("No se pudieron cargar los catálogos:", catalogError);
        }
    };

    const loadSales = async (overrides = {}) => {
        setLoading(true);
        setError("");
        try {
            const result = await paymentEvidenceService.getSales({
                evidenceStatus: overrides.evidenceStatus ?? evidenceStatus,
                saleStatus: overrides.saleStatus ?? saleStatus,
                numDocum: (overrides.numDocum ?? numDocum).trim(),
                fromDate: overrides.fromDate ?? fromDate,
                toDate: overrides.toDate ?? toDate,
                initialView: overrides.initialView ?? initialView,
                page: 1,
                size: 60,
            });
            setSales(result.ventas || []);
            setTotal(result.total || 0);
        } catch (loadError) {
            console.error("Error cargando evidencias:", loadError);
            setError(
                loadError?.response?.data?.error ||
                "No se pudo cargar el módulo de evidencias.",
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCatalogs();
        loadSales({ evidenceStatus: "PENDIENTE", initialView: true });
    }, []);

    const selectEvidenceStatus = (status) => {
        setEvidenceStatus(status);
        setInitialView(false);
        loadSales({ evidenceStatus: status, initialView: false });
    };

    const searchSales = () => {
        setInitialView(false);
        loadSales({ initialView: false });
    };

    const closeDetail = () => {
        setSelectedIdmov(null);
        setDetail(null);
        setDetailError("");
        setPaymentDrafts([{ ...EMPTY_PAYMENT }]);
        setEvidenceDrafts([]);
        setObservation("");
    };

    const openDetail = async (sale) => {
        setSelectedIdmov(sale.idmov);
        setDetail(null);
        setDetailLoading(true);
        setDetailError("");
        setPaymentDrafts([{ ...EMPTY_PAYMENT }]);
        setEvidenceDrafts([]);
        setObservation("");

        try {
            const response = await paymentEvidenceService.getSaleDetail(
                sale.idmov,
                true,
            );
            setDetail(response);
            setObservation(response?.estado_evidencia?.observacion || "");
        } catch (loadError) {
            console.error("Error cargando detalle:", loadError);
            setDetailError(
                loadError?.response?.data?.error ||
                "No se pudo cargar el detalle de la venta.",
            );
        } finally {
            setDetailLoading(false);
        }
    };

    const reloadDetail = async () => {
        if (!selectedIdmov) return;
        const response = await paymentEvidenceService.getSaleDetail(
            selectedIdmov,
            true,
        );
        setDetail(response);
        setObservation(response?.estado_evidencia?.observacion || "");
    };

    const updatePaymentDraft = (index, field, value) => {
        setPaymentDrafts((current) =>
            current.map((payment, paymentIndex) =>
                paymentIndex === index
                    ? { ...payment, [field]: value }
                    : payment,
            ),
        );
    };

    const addPaymentDraft = () => {
        setPaymentDrafts((current) => [...current, { ...EMPTY_PAYMENT }]);
    };

    const removePaymentDraft = (index) => {
        setPaymentDrafts((current) => {
            if (current.length === 1) return [{ ...EMPTY_PAYMENT }];
            return current.filter((_, paymentIndex) => paymentIndex !== index);
        });
    };

    const paymentDraftTotal = paymentDrafts.reduce(
        (sum, payment) => sum + toMoney(payment.monto),
        0,
    );

    const saleTotal = toMoney(detail?.venta?.total);
    const paymentDifference = saleTotal - paymentDraftTotal;

    const addEvidenceFiles = async (event) => {
        const files = Array.from(event.target.files || []);
        if (!files.length) return;

        try {
            const newDrafts = await Promise.all(
                files.map(async (file) => {
                    if (!file.type.startsWith("image/")) {
                        throw new Error(`${file.name} no es una imagen.`);
                    }
                    if (file.size > 8 * 1024 * 1024) {
                        throw new Error(`${file.name} supera el límite de 8 MB.`);
                    }
                    const dataUrl = await fileToDataUrl(file);
                    return {
                        localId: `${Date.now()}-${Math.random()}`,
                        fileName: file.name,
                        mime_type: file.type || "image/jpeg",
                        foto_codigo: dataUrl,
                        preview: dataUrl,
                        tipo_evidencia: evidenceTypes[0]?.value || "OTRO",
                        descripcion: "",
                    };
                }),
            );
            setEvidenceDrafts((current) => [...current, ...newDrafts]);
        } catch (fileError) {
            alert(fileError.message);
        } finally {
            event.target.value = "";
        }
    };

    const updateEvidenceDraft = (localId, field, value) => {
        setEvidenceDrafts((current) =>
            current.map((evidence) =>
                evidence.localId === localId
                    ? { ...evidence, [field]: value }
                    : evidence,
            ),
        );
    };

    const removeEvidenceDraft = (localId) => {
        setEvidenceDrafts((current) =>
            current.filter((evidence) => evidence.localId !== localId),
        );
    };

    const validateNewPayments = () => {
        if (detail?.pagos?.length) return true;

        for (let index = 0; index < paymentDrafts.length; index += 1) {
            const payment = paymentDrafts[index];
            if (!payment.tipo_venta_id) {
                alert(`Selecciona el medio de pago en la fila ${index + 1}.`);
                return false;
            }
            if (toMoney(payment.monto) <= 0) {
                alert(`El monto de la fila ${index + 1} debe ser mayor a 0.`);
                return false;
            }
        }

        if (Math.abs(paymentDifference) > 0.01) {
            alert(
                `Los pagos deben sumar ${formatMoney(saleTotal)}. ` +
                `Actualmente suman ${formatMoney(paymentDraftTotal)}.`,
            );
            return false;
        }
        return true;
    };

    const registerEvidenceFlow = async () => {
        if (!detail?.venta?.idmov || saving) return;
        if (!evidenceDrafts.length) {
            alert("Adjunta al menos una foto o comprobante.");
            return;
        }
        if (!validateNewPayments()) return;

        const payload = {
            actualizado_por: username,
            observacion: observation.trim() || null,
            evidencias: evidenceDrafts.map((evidence) => ({
                tipo_evidencia: evidence.tipo_evidencia,
                descripcion: evidence.descripcion.trim() || null,
                mime_type: evidence.mime_type,
                foto_codigo: evidence.foto_codigo,
                creado_por: username,
            })),
        };

        if (!detail.pagos?.length) {
            payload.pagos = paymentDrafts.map((payment) => ({
                tipo_venta_id: Number(payment.tipo_venta_id),
                monto: toMoney(payment.monto).toFixed(2),
                referencia: payment.referencia.trim() || null,
            }));
        }

        setSaving(true);
        try {
            await paymentEvidenceService.registerFlow(
                detail.venta.idmov,
                payload,
            );
            setEvidenceDrafts([]);
            setPaymentDrafts([{ ...EMPTY_PAYMENT }]);
            await Promise.all([reloadDetail(), loadSales()]);
            alert("Evidencias registradas correctamente.");
        } catch (saveError) {
            console.error("Error registrando evidencia:", saveError);
            alert(
                saveError?.response?.data?.error ||
                "No se pudo registrar la evidencia.",
            );
        } finally {
            setSaving(false);
        }
    };

    const changeEvidenceStatus = async (nextStatus) => {
        if (!detail?.venta?.idmov || saving) return;
        setSaving(true);
        try {
            await paymentEvidenceService.updateEvidenceStatus(
                detail.venta.idmov,
                {
                    estado: nextStatus,
                    observacion: observation.trim() || null,
                    actualizado_por: username,
                },
            );
            await Promise.all([reloadDetail(), loadSales()]);
        } catch (statusError) {
            alert(
                statusError?.response?.data?.error ||
                "No se pudo actualizar el estado documental.",
            );
        } finally {
            setSaving(false);
        }
    };

    const deleteExistingEvidence = async (evidence) => {
        if (!window.confirm("¿Eliminar esta evidencia?")) return;
        try {
            await paymentEvidenceService.deleteEvidence(evidence.idevidencia);
            await Promise.all([reloadDetail(), loadSales()]);
        } catch (deleteError) {
            alert(
                deleteError?.response?.data?.error ||
                "No se pudo eliminar la evidencia.",
            );
        }
    };

    const clearFilters = () => {
        setEvidenceStatus("PENDIENTE");
        setInitialView(true);
        setSaleStatus("");
        setNumDocum("");
        setFromDate("");
        setToDate("");
        loadSales({
            evidenceStatus: "PENDIENTE",
            saleStatus: "",
            numDocum: "",
            fromDate: "",
            toDate: "",
            initialView: true,
        });
    };

    return (
        <main className="pe-page">
            <section className="pe-hero">
                <div>
                    <span className="pe-eyebrow">Control documental</span>
                    <h1>Evidencias de pago</h1>
                    <p>
                        Gestiona fotos de Yape, transferencias, depósitos,
                        tarjetas y boletas físicas sin modificar el estado
                        operativo de la venta.
                    </p>
                </div>
                <div className="pe-hero-summary">
                    <span>{evidenceStatus === "PENDIENTE" ? "Pendientes" : "Completadas"}</span>
                    <strong>{total}</strong>
                    <small>ventas encontradas</small>
                </div>
            </section>

            <section className="pe-toolbar">
                <div className="pe-tabs" role="tablist">
                    <button
                        type="button"
                        className={evidenceStatus === "PENDIENTE" ? "active" : ""}
                        onClick={() => selectEvidenceStatus("PENDIENTE")}
                    >
                        Pendientes
                    </button>
                    <button
                        type="button"
                        className={evidenceStatus === "COMPLETADO" ? "active" : ""}
                        onClick={() => selectEvidenceStatus("COMPLETADO")}
                    >
                        Completadas
                    </button>
                </div>

                <div className="pe-filters">
                    <label>
                        Estado de venta
                        <select
                            value={saleStatus}
                            onChange={(event) => setSaleStatus(event.target.value)}
                        >
                            <option value="">Todos</option>
                            <option value="EN PROCESO">En proceso</option>
                            <option value="COMPLETADO">Completado</option>
                        </select>
                    </label>
                    <label>
                        Documento
                        <input
                            value={numDocum}
                            onChange={(event) => setNumDocum(event.target.value)}
                            placeholder="N006, B001, F001..."
                            onKeyDown={(event) => event.key === "Enter" && searchSales()}
                        />
                    </label>
                    <label>
                        Desde
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(event) => setFromDate(event.target.value)}
                        />
                    </label>
                    <label>
                        Hasta
                        <input
                            type="date"
                            value={toDate}
                            onChange={(event) => setToDate(event.target.value)}
                        />
                    </label>
                    <div className="pe-filter-actions">
                        <button type="button" className="pe-primary" onClick={searchSales}>
                            Buscar
                        </button>
                        <button type="button" className="pe-muted" onClick={clearFilters}>
                            Limpiar
                        </button>
                    </div>
                </div>
            </section>

            {error && <div className="pe-error">{error}</div>}

            {loading ? (
                <div className="pe-loading">Cargando ventas...</div>
            ) : sales.length === 0 ? (
                <div className="pe-empty">
                    <strong>No hay ventas en este estado documental.</strong>
                    <span>Prueba con otro período o filtro.</span>
                </div>
            ) : (
                <section className="pe-grid">
                    {sales.map((sale) => {
                        const paymentReady = Math.abs(toMoney(sale.diferencia_pago)) <= 0.01;
                        return (
                            <article className="pe-card" key={sale.idmov}>
                                <div className="pe-card-top">
                                    <div>
                                        <span className="pe-doc">{sale.num_docum}</span>
                                        <small>{formatDate(sale.fecha)}</small>
                                    </div>
                                    <span className={`pe-badge ${sale.estado_evidencia.toLowerCase()}`}>
                                        {sale.estado_evidencia}
                                    </span>
                                </div>

                                <h2>{sale.cliente || "Cliente sin nombre"}</h2>
                                <span className="pe-client-doc">Documento: {sale.ruc_cliente || "N/D"}</span>

                                <div className="pe-card-data">
                                    <div>
                                        <span>Total venta</span>
                                        <strong>{formatMoney(sale.total)}</strong>
                                    </div>
                                    <div>
                                        <span>Estado de venta</span>
                                        <strong>{sale.estado_venta || sale.estado_venta_id}</strong>
                                    </div>
                                    <div>
                                        <span>Pagos</span>
                                        <strong className={paymentReady ? "ok" : "pending"}>
                                            {sale.cantidad_pagos} · {formatMoney(sale.total_pagado)}
                                        </strong>
                                    </div>
                                    <div>
                                        <span>Evidencias</span>
                                        <strong>{sale.cantidad_evidencias}</strong>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="pe-card-action"
                                    onClick={() => openDetail(sale)}
                                >
                                    Ver y actualizar
                                </button>
                            </article>
                        );
                    })}
                </section>
            )}

            {selectedIdmov && (
                <div className="pe-overlay" onMouseDown={closeDetail}>
                    <section
                        className="pe-modal"
                        onMouseDown={(event) => event.stopPropagation()}
                    >
                        <button type="button" className="pe-close" onClick={closeDetail}>
                            ×
                        </button>

                        {detailLoading ? (
                            <div className="pe-loading">Cargando detalle...</div>
                        ) : detailError ? (
                            <div className="pe-error">{detailError}</div>
                        ) : detail ? (
                            <>
                                <header className="pe-modal-header">
                                    <div>
                                        <span className="pe-eyebrow">Venta #{detail.venta.idmov}</span>
                                        <h2>{detail.venta.num_docum}</h2>
                                        <p>
                                            {detail.venta.cliente || "Cliente sin nombre"} · {formatDate(detail.venta.fecha)}
                                        </p>
                                    </div>
                                    <div className="pe-modal-statuses">
                                        <span className="pe-badge sale">{detail.venta.estado_venta}</span>
                                        <span className={`pe-badge ${detail.estado_evidencia.estado.toLowerCase()}`}>
                                            Evidencia {detail.estado_evidencia.estado}
                                        </span>
                                    </div>
                                </header>

                                <div className="pe-summary-row">
                                    <div><span>Total</span><strong>{formatMoney(detail.venta.total)}</strong></div>
                                    <div><span>Pagado</span><strong>{formatMoney(detail.pagos_resumen.total_pagado)}</strong></div>
                                    <div><span>Productos</span><strong>{detail.productos.length}</strong></div>
                                    <div><span>Evidencias</span><strong>{detail.evidencias.length}</strong></div>
                                </div>

                                <section className="pe-panel">
                                    <div className="pe-section-heading">
                                        <div>
                                            <span className="pe-step">1</span>
                                            <div>
                                                <h3>Distribución de pagos</h3>
                                                <p>
                                                    Los porcentajes se calculan automáticamente a partir del monto total.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {detail.pagos.length > 0 ? (
                                        <div className="pe-payment-list">
                                            {detail.pagos.map((payment) => (
                                                <div className="pe-payment-readonly" key={payment.idpago}>
                                                    <div>
                                                        <strong>{payment.tipo_venta}</strong>
                                                        <span>{payment.referencia || "Sin referencia"}</span>
                                                    </div>
                                                    <div>
                                                        <strong>{formatMoney(payment.monto)}</strong>
                                                        <span>{toMoney(payment.porcentaje).toFixed(2)}%</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <>
                                            <div className="pe-payment-editor">
                                                {paymentDrafts.map((payment, index) => {
                                                    const amount = toMoney(payment.monto);
                                                    const percentage = saleTotal > 0 ? (amount / saleTotal) * 100 : 0;
                                                    return (
                                                        <div className="pe-payment-row" key={`payment-${index}`}>
                                                            <select
                                                                value={payment.tipo_venta_id}
                                                                onChange={(event) => updatePaymentDraft(index, "tipo_venta_id", event.target.value)}
                                                            >
                                                                <option value="">Medio de pago</option>
                                                                {paymentTypes.map((type) => (
                                                                    <option key={type.tipo_venta_id} value={type.tipo_venta_id}>
                                                                        {type.name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            <input
                                                                type="number"
                                                                min="0.01"
                                                                step="0.01"
                                                                placeholder="Monto"
                                                                value={payment.monto}
                                                                onChange={(event) => updatePaymentDraft(index, "monto", event.target.value)}
                                                            />
                                                            <input
                                                                placeholder="Referencia opcional"
                                                                value={payment.referencia}
                                                                onChange={(event) => updatePaymentDraft(index, "referencia", event.target.value)}
                                                            />
                                                            <span className="pe-percentage">{percentage.toFixed(2)}%</span>
                                                            <button type="button" className="pe-row-delete" onClick={() => removePaymentDraft(index)}>
                                                                Eliminar
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <div className="pe-payment-footer">
                                                <button type="button" className="pe-muted" onClick={addPaymentDraft}>
                                                    Agregar medio
                                                </button>
                                                <div>
                                                    <span>Total distribuido: {formatMoney(paymentDraftTotal)}</span>
                                                    <strong className={Math.abs(paymentDifference) <= 0.01 ? "ok" : "pending"}>
                                                        Diferencia: {formatMoney(paymentDifference)}
                                                    </strong>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </section>

                                <section className="pe-panel">
                                    <div className="pe-section-heading">
                                        <div>
                                            <span className="pe-step">2</span>
                                            <div>
                                                <h3>Fotos y comprobantes</h3>
                                                <p>Adjunta capturas de Yape, vouchers, tarjeta o boleta física.</p>
                                            </div>
                                        </div>
                                        <label className="pe-file-button">
                                            Agregar imágenes
                                            <input type="file" accept="image/*" multiple onChange={addEvidenceFiles} />
                                        </label>
                                    </div>

                                    {detail.evidencias.length > 0 && (
                                        <div className="pe-existing-evidence">
                                            {detail.evidencias.map((evidence) => (
                                                <article key={evidence.idevidencia}>
                                                    <img
                                                        src={`data:${evidence.mime_type};base64,${evidence.foto_codigo}`}
                                                        alt={evidence.tipo_evidencia}
                                                    />
                                                    <div>
                                                        <strong>{evidence.tipo_evidencia.replace(/_/g, " ")}</strong>
                                                        <span>{evidence.descripcion || "Sin descripción"}</span>
                                                        <small>{evidence.fecha_peru || formatDate(evidence.fecha, true)}</small>
                                                    </div>
                                                    <button type="button" onClick={() => deleteExistingEvidence(evidence)}>
                                                        Eliminar
                                                    </button>
                                                </article>
                                            ))}
                                        </div>
                                    )}

                                    {evidenceDrafts.length > 0 ? (
                                        <div className="pe-draft-grid">
                                            {evidenceDrafts.map((evidence) => (
                                                <article key={evidence.localId}>
                                                    <img src={evidence.preview} alt={evidence.fileName} />
                                                    <select
                                                        value={evidence.tipo_evidencia}
                                                        onChange={(event) => updateEvidenceDraft(evidence.localId, "tipo_evidencia", event.target.value)}
                                                    >
                                                        {evidenceTypes.map((type) => (
                                                            <option key={type.value} value={type.value}>{type.label}</option>
                                                        ))}
                                                    </select>
                                                    <input
                                                        placeholder="Descripción opcional"
                                                        value={evidence.descripcion}
                                                        onChange={(event) => updateEvidenceDraft(evidence.localId, "descripcion", event.target.value)}
                                                    />
                                                    <button type="button" onClick={() => removeEvidenceDraft(evidence.localId)}>
                                                        Quitar
                                                    </button>
                                                </article>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="pe-helper">No hay imágenes nuevas seleccionadas.</p>
                                    )}
                                </section>

                                <section className="pe-panel compact">
                                    <label className="pe-observation">
                                        Observación documental
                                        <textarea
                                            value={observation}
                                            onChange={(event) => setObservation(event.target.value)}
                                            placeholder="Comentario opcional..."
                                            maxLength={255}
                                        />
                                    </label>
                                </section>

                                <footer className="pe-modal-actions">
                                    {detail.estado_evidencia.estado === "COMPLETADO" && (
                                        <button
                                            type="button"
                                            className="pe-muted"
                                            disabled={saving}
                                            onClick={() => changeEvidenceStatus("PENDIENTE")}
                                        >
                                            Reabrir como pendiente
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        className="pe-primary large"
                                        disabled={saving}
                                        onClick={registerEvidenceFlow}
                                    >
                                        {saving ? "Guardando..." : "Guardar pagos y evidencias"}
                                    </button>
                                </footer>
                            </>
                        ) : null}
                    </section>
                </div>
            )}
        </main>
    );
};

export default PaymentEvidence;
