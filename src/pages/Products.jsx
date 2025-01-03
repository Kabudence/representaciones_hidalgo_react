import { useState } from "react";
import Product from "../models/Product";
import ProductForm from "../components/ProductForm.jsx";
import Pagination from "../components/Pagination";

const Products = () => {
    const [products, setProducts] = useState([
        new Product("P001", "Producto 1", "kg", 50, 30, 10, 20.0, 25.0, "Modelo1", "10x10", "Clase A"),
        new Product("P002", "Producto 2", "unit", 100, 80, 20, 15.0, 20.0, "Modelo2", "20x20", "Clase B"),
        ...Array.from({ length: 100 }, (_, i) =>
            new Product(`P00${i + 3}`, `Producto ${i + 3}`, "unit", i * 10, i * 8, 5, 10.0 + i, 12.5 + i, `Modelo${i + 3}`, `${i}x${i}`, "Clase C")
        ),
    ]);

    const [showModal, setShowModal] = useState(false);
    const [formType, setFormType] = useState("Agregar");
    const [currentProduct, setCurrentProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 10;

    const filteredProducts = products.filter(
        (product) =>
            product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleOpenModal = (type, product = null) => {
        setFormType(type);
        setCurrentProduct(
            product ||
            new Product("", "", "", 0, 0, 0, 0.0, 0.0, "", "", "")
        );
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        try {
            Product.validate(currentProduct);
            if (formType === "Agregar") {
                setProducts([...products, currentProduct]);
            } else {
                setProducts(
                    products.map((p) => (p.id === currentProduct.id ? currentProduct : p))
                );
            }
            handleCloseModal();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDelete = (id) => {
        setProducts(products.filter((product) => product.id !== id));
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Lista de Productos</h1>
            <div style={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Buscar producto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.searchInput}
                />
                <button onClick={() => handleOpenModal("Agregar")} style={styles.addButton}>
                    Agregar Producto
                </button>
            </div>
            <table style={styles.table}>
                <thead>
                <tr style={styles.tableHeader}>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Unidad de Medida</th>
                    <th>Stock Inicial</th>
                    <th>Stock Actual</th>
                    <th>Stock Mínimo</th>
                    <th>Precio Costo</th>
                    <th>Precio Venta</th>
                    <th>Modelo</th>
                    <th>Medida</th>
                    <th>Clase</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {paginatedProducts.map((product) => (
                    <tr key={product.id} style={styles.tableRow}>
                        <td style={styles.tableCell}>{product.id}</td>
                        <td style={styles.tableCell}>{product.nombre}</td>
                        <td style={styles.tableCell}>{product.unidad_medida}</td>
                        <td style={styles.tableCell}>{product.stock_inicial}</td>
                        <td style={styles.tableCell}>{product.stock_actual}</td>
                        <td style={styles.tableCell}>{product.stock_minimo}</td>
                        <td style={styles.tableCell}>{product.precio_costo.toFixed(2)}</td>
                        <td style={styles.tableCell}>{product.precio_venta.toFixed(2)}</td>
                        <td style={styles.tableCell}>{product.modelo}</td>
                        <td style={styles.tableCell}>{product.medida}</td>
                        <td style={styles.tableCell}>{product.clase}</td>
                        <td style={styles.tableCell}>
                            <button
                                onClick={() => handleOpenModal("Editar", product)}
                                style={styles.editButton}
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => handleDelete(product.id)}
                                style={styles.deleteButton}
                            >
                                Eliminar
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />
            {showModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <h2>{formType} Producto</h2>
                        <ProductForm
                            product={currentProduct}
                            setProduct={setCurrentProduct}
                            onSubmit={handleFormSubmit}
                            onCancel={handleCloseModal}
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
    title: {
        marginBottom: "15px",
        fontFamily: "'PT Sans Narrow', sans-serif",
        fontSize: "50px",
    },
    searchContainer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
    },
    searchInput: {
        width: "80%",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "5px",
    },
    addButton: {
        padding: "10px 20px",
        backgroundColor: "#524b4a",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
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
    },
    tableRow: {
        borderBottom: "1px solid #ccc",
    },
    tableCell: {
        padding: "15px 10px",
        textAlign: "left",
    },
    editButton: {
        backgroundColor: "#ffc107",
        border: "none",
        padding: "8px 16px",
        borderRadius: "5px",
        marginRight: "5px",
        cursor: "pointer",
    },
    deleteButton: {
        backgroundColor: "#dc3545",
        border: "none",
        padding: "8px 16px",
        borderRadius: "5px",
        cursor: "pointer",
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
        width: "400px",
    },
};

export default Products;
