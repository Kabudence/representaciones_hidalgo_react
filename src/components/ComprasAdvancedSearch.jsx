import React, { useState } from "react";
import PropTypes from "prop-types";

const ComprasAdvancedSearch = ({ onSearch }) => {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [filters, setFilters] = useState({
        fromPrice: "",
        toPrice: "",
        providerName: "",
        fromDate: "",
        toDate: "",
        saleType: "",
        clientRUC: "",
        status: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(filters);
        }
    };

    const handleClear = () => {
        setFilters({
            fromPrice: "",
            toPrice: "",
            providerName: "",
            fromDate: "",
            toDate: "",
            saleType: "",
            clientRUC: "",
            status: "",
        });
        if (onSearch) {
            onSearch(null); // Resetea los filtros
        }
    };

    const toggleAdvancedSearch = () => {
        setShowAdvanced(!showAdvanced);
    };

    const styles = {
        container: {
            backgroundColor: "#f9f9f9",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            marginBottom: "20px",
        },
        header: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
        },
        title: {
            margin: "0",
            fontWeight: "bold",
            fontSize: "18px",
        },
        form: {
            display: showAdvanced ? "grid" : "none", // Oculta el formulario si showAdvanced es falso
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            alignItems: "center",
            gap: "15px",
            marginTop: "20px",
        },
        actions: {
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            gridColumn: "1 / -1", // Ocupa toda la fila al final
        },
        input: {
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "14px",
        },
        select: {
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "14px",
        },
        button: {
            padding: "10px 20px",
            backgroundColor: "#524b4a",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
        },
        clearButton: {
            padding: "10px 20px",
            backgroundColor: "#dc3545", // Color rojo para "Limpiar"
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h3 style={styles.title}>Búsqueda Avanzada</h3>
                <button style={styles.button} onClick={toggleAdvancedSearch}>
                    {showAdvanced ? "Ocultar 🔍" : "Mostrar 🔍"}
                </button>
            </div>
            <form style={styles.form} onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="fromPrice"
                    placeholder="Desde S/"
                    value={filters.fromPrice}
                    onChange={handleChange}
                    style={styles.input}
                />
                <input
                    type="text"
                    name="toPrice"
                    placeholder="Hasta S/"
                    value={filters.toPrice}
                    onChange={handleChange}
                    style={styles.input}
                />
                <input
                    type="text"
                    name="providerName"
                    placeholder="Nombre del Proveedor"
                    value={filters.providerName}
                    onChange={handleChange}
                    style={styles.input}
                />
                <input
                    type="date"
                    name="fromDate"
                    placeholder="Fecha Desde"
                    value={filters.fromDate}
                    onChange={handleChange}
                    style={styles.input}
                />
                <input
                    type="date"
                    name="toDate"
                    placeholder="Fecha Hasta"
                    value={filters.toDate}
                    onChange={handleChange}
                    style={styles.input}
                />
                <select
                    name="saleType"
                    value={filters.saleType}
                    onChange={handleChange}
                    style={styles.select}
                >
                    <option value="">Tipo de Venta</option>
                    <option value="TRANSFERENCIA">TRANSFERENCIA</option>
                    <option value="CONTADO">CONTADO</option>
                </select>
                <input
                    type="text"
                    name="clientRUC"
                    placeholder="RUC del Cliente"
                    value={filters.clientRUC}
                    onChange={handleChange}
                    style={styles.input}
                />
                <select
                    name="status"
                    value={filters.status}
                    onChange={handleChange}
                    style={styles.select}
                >
                    <option value="">Estado</option>
                    <option value="COMPLETADO">COMPLETADO</option>
                    <option value="EN PROCESO">EN PROCESO</option>
                </select>
                <button type="submit" style={styles.button}>
                    Buscar
                </button>
                <button type="button" style={styles.clearButton} onClick={handleClear}>
                    Limpiar
                </button>
            </form>
        </div>
    );
};

ComprasAdvancedSearch.propTypes = {
    onSearch: PropTypes.func.isRequired,
};

export default ComprasAdvancedSearch;
