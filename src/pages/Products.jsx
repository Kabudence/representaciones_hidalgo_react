import {useState, useEffect} from "react";
import Product from "../models/Product";
import HistoryModal from "../components/HistoryModal";
import ProductForm from "../components/ProductForm.jsx";
import Pagination from "../components/Pagination";
import productService from "../services/productService";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formType, setFormType] = useState("Agregar");
    const [currentProduct, setCurrentProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [role, setRole] = useState(null);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [historyProductId, setHistoryProductId] = useState(null);


    const itemsPerPage = 10;

    const handleOpenHistory = (idprod) => {
        setHistoryProductId(idprod);
        setShowHistoryModal(true);
    };

    useEffect(() => {
        const storedUserData = sessionStorage.getItem("authData");
        if (storedUserData) {
            const { role } = JSON.parse(storedUserData);
            setRole(role);
        }

        loadProducts();
    }, []);

    const loadProducts = () => {
        productService.getAll()
            .then((data) => {
                console.log(data);
                const productObjects = data.map((p) => ({
                    id: p.idprod,
                    _nombreOriginal: p.nomproducto || "Sin Nombre",
                    unidad_medida: p.umedida || "Sin Unidad",
                    stock_inicial: p.st_ini || 0,
                    stock_actual: p.st_act || 0,
                    stock_minimo: p.st_min || 0,
                    precio_costo: p.pr_costo || 0.0,
                    precio_venta: p.prventa || 0.0,
                    modelo: p.modelo || "Sin Modelo",
                    medida: p.medida || "Sin Medida",
                }));
                setProducts(productObjects);
                setFilteredProducts(productObjects);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
                setLoading(false);
            });
    };

    useEffect(() => {
        const searchDebounce = setTimeout(() => {
            if (searchTerm.trim()) {
                productService.search(searchTerm)
                    .then(results => {
                        const formattedResults = results.map(p => ({
                            id: p.idprod,
                            _nombreOriginal: p.nomproducto,
                            unidad_medida: p.umedida,
                            stock_inicial: p.st_ini || 0,
                            stock_actual: p.st_act || 0,
                            stock_minimo: p.st_min || 0,
                            precio_costo: Number(p.pr_costo) || 0.0,  // Asegurar que sea un número
                            precio_venta: Number(p.prventa) || 0.0,
                            modelo: p.modelo,
                            medida: p.medida
                        }));
                        setFilteredProducts(formattedResults);
                    })
                    .catch(() => setFilteredProducts([]));
            } else {
                setFilteredProducts(products);
            }
        }, 300);

        return () => clearTimeout(searchDebounce);
    }, [searchTerm, products]);

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    const exportToPDF = () => {
        const doc = new jsPDF("landscape");
        const now = new Date();
        doc.setFontSize(12);
        doc.text("Tu Empresa", 10, 10);
        doc.text(`Fecha: ${now.toLocaleDateString("es-PE")}`, 250, 10);
        doc.text(`Hora: ${now.toLocaleTimeString("es-PE")}`, 250, 15);
        doc.setFontSize(14);
        doc.text("Listado de Productos", 148, 30, { align: "center" });

        const tableColumn = [
            "ID",
            "Nombre",
            "Unidad de Medida",
            "Stock Inicial",
            "Stock Actual",
            "Stock Mínimo",
            "Precio Costo",
            "Precio Venta",
            "Modelo",
            "Medida",
        ];

        const tableRows = filteredProducts.map((product) => [
            product.id,
            product._nombreOriginal,
            product.unidad_medida,
            product.stock_inicial || 0,
            product.stock_actual || 0,
            product.stock_minimo || 0,
            (product.precio_costo || 0).toFixed(2),
            (product.precio_venta || 0).toFixed(2),
            product.modelo,
            product.medida,
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

        doc.save("listado_productos.pdf");
    };

    const handleOpenModal = (type, product = null) => {
        setFormType(type);
        setCurrentProduct(
            product ||
            new Product({
                id: "",
                nombre: "",
                unidad_medida: "",
                stock_inicial: 0,
                stock_actual: 0,
                stock_minimo: 0,
                precio_costo: 0.0,
                precio_venta: 0.0,
                modelo: "",
                medida: "",
            })
        );
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleFormSubmit = (productData) => {

        if (formType === "Agregar") {
            productService
                .create(productData)
                .then((newProduct) => {
                    setProducts([...products, newProduct]);
                    handleCloseModal();
                })
                .catch((error) =>
                    alert(`Error al crear el producto: ${error.message}`)
                );
        } else {
            productService
                .update(productData.id, productData)
                .then(() => {
                    setProducts(
                        products.map((p) =>
                            p.id === productData.id ? { ...p, ...productData } : p
                        )
                    );
                    handleCloseModal();
                })
                .catch((error) =>
                    alert(`Error al actualizar el producto: ${error.message}`)
                );
        }
    };

    const handleDelete = (id) => {
        productService
            .remove(id)
            .then(() => {
                setProducts(products.filter((product) => product.id !== id));
            })
            .catch((error) => console.error("Error deleting product:", error));
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    if (loading) {
        return <div>Cargando productos...</div>;
    }

    return (
        <div style={styles.container}>
            {/* Encabezado con el título y botón Generar PDF */}
            <div style={styles.header}>
                <h1 style={styles.title}>Lista de Productos</h1>
                <div>
                    <button
                        onClick={exportToPDF}
                        style={{ ...styles.addButton, marginLeft: "10px" }}
                    >
                        Generar PDF
                    </button>
                </div>
            </div>

            {/* Barra de búsqueda con el botón Agregar Producto */}
            <div style={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Buscar producto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.searchInput}
                />

                {role === "admin" && (
                    <button
                        onClick={() => handleOpenModal("Agregar")}
                        style={{ ...styles.addButton, marginLeft: "10px" }}
                    >
                        Agregar Producto
                    </button>
                )}
            </div>

            <table style={styles.table}>
                <thead>
                {role === "admin" ? (
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
                        <th>Acciones</th>
                    </tr>
                ) : (
                    <tr style={styles.tableHeader}>
                        <th>Nombre</th>
                        <th>Modelo</th>
                        <th>Medida</th>
                        <th>Stock Actual</th>
                        <th>Precio Venta</th>
                        <th>Acciones</th>
                    </tr>
                )}
                </thead>
                <tbody>
                {paginatedProducts.map((product, index) =>
                    role === "admin" ? (
                        <tr key={product.id || `row-${index}`} style={styles.tableRow}>
                            <td style={styles.tableCell}>{product.id}</td>
                            <td style={styles.tableCell}>{product._nombreOriginal}</td>
                            <td style={styles.tableCell}>{product.unidad_medida}</td>
                            <td style={styles.tableCell}>{product.stock_inicial}</td>
                            <td style={styles.tableCell}>{product.stock_actual}</td>
                            <td style={styles.tableCell}>{product.stock_minimo}</td>
                            <td style={styles.tableCell}>{product.precio_costo.toFixed(2)}</td>
                            <td style={styles.tableCell}>{product.precio_venta.toFixed(2)}</td>
                            <td style={styles.tableCell}>{product.modelo}</td>
                            <td style={styles.tableCell}>{product.medida}</td>
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
                                <button
                                    style={styles.recordButton}
                                    onClick={() => handleOpenHistory(product.id)}
                                >
                                    Historial
                                </button>

                            </td>
                        </tr>
                    ) : (
                        <tr key={product.id || `row-${index}`} style={styles.tableRow}>
                            <td style={styles.tableCell}>{product._nombreOriginal}</td>
                            <td style={styles.tableCell}>{product.modelo}</td>
                            <td style={styles.tableCell}>{product.medida}</td>
                            <td style={styles.tableCell}>{product.stock_actual}</td>
                            <td style={styles.tableCell}>{product.precio_venta.toFixed(2)}</td>
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
                    )
                )}
                </tbody>
            </table>
            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />
            {showHistoryModal && (
                <HistoryModal
                    idprod={historyProductId}
                    onClose={() => setShowHistoryModal(false)}
                />
            )}
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
    searchContainer: {
        marginBottom: "20px",
        display: "flex",
        alignItems: "center",
    },
    recordButton: {
        backgroundColor: "#2196F3",
        border: "none",
        padding: "8px 16px",
        borderRadius: "5px",
        marginLeft: "5px",
        cursor: "pointer",
        color: "white",
    },
    searchInput: {
        width: "100%",
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
        zIndex: 1000,
    },
    modal: {
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "8px",
        width: "90%",
        maxWidth: "600px",
        maxHeight: "90vh",
        overflowY: "auto",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
};

export default Products;
