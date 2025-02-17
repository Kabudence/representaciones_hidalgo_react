// src/components/AddItem.jsx
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Fuse from "fuse.js";
import productService from "../services/productService";

const AddItem = ({ onAddItem, onCancel }) => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [precio, setPrecio] = useState("");
    const [cantidad, setCantidad] = useState("1");
    const [igv, setIgv] = useState("0");

    // Obtener productos al montar el componente
    useEffect(() => {
        productService
            .getAll()
            .then((data) => {
                setProducts(data);
                setFilteredProducts(data);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
            });
    }, []);

    // Configuración de Fuse.js para búsqueda flexible
    const fuseOptions = {
        includeScore: true,
        threshold: 0.3,
        keys: ["nomproducto"],
        tokenize: true,
        findAllMatches: true,
        useExtendedSearch: true,
    };

    const fuse = new Fuse(products, fuseOptions);

    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredProducts(products);
        } else {
            const results = fuse.search(searchTerm).map((result) => result.item);
            setFilteredProducts(results);
        }
    }, [searchTerm, products]);

    const handleSelectProduct = (product) => {
        setSelectedProduct(product);
        // Se establece el precio sugerido (se usa prventa si está definido)
        setPrecio(product.prventa || 0);
        // Reiniciamos cantidad e IGV
        setCantidad("1");
        setIgv("0");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedProduct) {
            alert("Seleccione un producto");
            return;
        }
        // Construir el objeto item a agregar
        const item = {
            producto: selectedProduct.nomproducto,
            productId: selectedProduct.idprod,
            cantidad: cantidad,
            precio: precio,
            igv: igv,
        };
        onAddItem(item);
    };

    return (
        <div style={styles.container}>
            <h3 style={styles.title}>Agregar Ítem</h3>
            <input
                type="text"
                placeholder="Buscar producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
            />
            <ul style={styles.productList}>
                {filteredProducts.map((product, index) => (
                    <li
                        key={index}
                        style={{
                            ...styles.productItem,
                            backgroundColor:
                                selectedProduct && selectedProduct.idprod === product.idprod
                                    ? "#d3d3d3"
                                    : "transparent",
                        }}
                        onClick={() => handleSelectProduct(product)}
                    >
                        {product.nomproducto}
                    </li>
                ))}
            </ul>
            {selectedProduct && (
                <div style={styles.selectedContainer}>
                    <p>
                        Producto seleccionado:{" "}
                        <strong>{selectedProduct.nomproducto}</strong>
                    </p>
                    <div style={styles.fieldGroup}>
                        <label style={styles.fieldLabel}>Cantidad:</label>
                        <input
                            type="number"
                            value={cantidad}
                            onChange={(e) => setCantidad(e.target.value)}
                            style={styles.inputSmall}
                        />
                    </div>
                    <div style={styles.fieldGroup}>
                        <label style={styles.fieldLabel}>Precio sugerido:</label>
                        <input
                            type="number"
                            value={precio}
                            onChange={(e) => setPrecio(e.target.value)}
                            style={styles.inputSmall}
                        />
                    </div>
                    <div style={styles.fieldGroup}>
                        <label style={styles.fieldLabel}>IGV:</label>
                        <input
                            type="number"
                            value={igv}
                            onChange={(e) => setIgv(e.target.value)}
                            style={styles.inputSmall}
                        />
                    </div>
                    <p style={styles.summary}>
                        {selectedProduct.nomproducto} - Cantidad: {cantidad} - Precio:{" "}
                        {precio} - IGV: {igv}
                    </p>
                </div>
            )}
            <div style={styles.buttonGroup}>
                <button type="button" onClick={handleSubmit} style={styles.addButton}>
                    Agregar
                </button>
                <button type="button" onClick={onCancel} style={styles.cancelButton}>
                    Cancelar
                </button>
            </div>
        </div>
    );
};

AddItem.propTypes = {
    onAddItem: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

const styles = {
    container: {
        padding: "20px",
    },
    title: {
        marginBottom: "10px",
        fontFamily: "'PT Sans Narrow', sans-serif",
        fontSize: "24px",
    },
    searchInput: {
        width: "100%",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        marginBottom: "10px",
    },
    productList: {
        listStyleType: "none",
        padding: 0,
        maxHeight: "150px",
        overflowY: "auto",
        marginBottom: "10px",
    },
    productItem: {
        padding: "8px",
        cursor: "pointer",
    },
    selectedContainer: {
        marginBottom: "10px",
        borderTop: "1px solid #ccc",
        paddingTop: "10px",
    },
    fieldGroup: {
        marginBottom: "5px",
        display: "flex",
        alignItems: "center",
    },
    fieldLabel: {
        fontWeight: "bold",
        marginRight: "5px",
        fontSize: "14px",
    },
    inputSmall: {
        width: "100px",
        padding: "5px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        fontSize: "14px",
    },
    summary: {
        marginTop: "10px",
        fontStyle: "italic",
        color: "#555",
    },
    buttonGroup: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: "20px",
    },
    addButton: {
        padding: "10px 20px",
        backgroundColor: "#524b4a",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
    cancelButton: {
        padding: "10px 20px",
        backgroundColor: "#dc3545",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
};

export default AddItem;
