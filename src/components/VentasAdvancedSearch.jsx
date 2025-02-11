import React, { useState } from "react";
import PropTypes from "prop-types";

const VentasAdvancedSearch = ({ onSearch, onClear }) => {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [filters, setFilters] = useState({
        fromPrice: "",
        toPrice: "",
        clientName: "",
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
            clientName: "",
            fromDate: "",
            toDate: "",
            saleType: "",
            clientRUC: "",
            status: "",
        });
        if (onClear) {
            onClear(); // Llama a la función pasada como prop para limpiar los resultados
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
            display: showAdvanced ? "grid" : "none",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "15px",
            marginTop: "20px",
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
            gridColumn: "span 2",
            justifySelf: "center",
            fontWeight: "bold",
        },
        clearButton: {
            padding: "10px 20px",
            backgroundColor: "#d9534f",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
            marginLeft: "10px",
        },
        toggleButton: {
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
            display: "flex",
            alignItems: "center",
        },
        icon: {
            fontSize: "20px",
            color: "#007bff",
            marginLeft: "8px",
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h3 style={styles.title}>Búsqueda Avanzada</h3>
                <button
                    style={styles.toggleButton}
                    onClick={toggleAdvancedSearch}
                >
                    <span>🔍</span>
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
                    name="clientName"
                    placeholder="Nombre del Cliente"
                    value={filters.clientName}
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
                <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                    <button type="submit" style={styles.button}>
                        Buscar
                    </button>
                    <button type="button" onClick={handleClear} style={styles.clearButton}>
                        Limpiar
                    </button>
                </div>
            </form>
        </div>
    );
};

VentasAdvancedSearch.propTypes = {
    onSearch: PropTypes.func.isRequired,
    onClear: PropTypes.func, // Prop para limpiar los resultados
};

export default VentasAdvancedSearch;
