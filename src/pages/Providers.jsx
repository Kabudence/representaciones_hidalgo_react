import { useState } from "react";
import Provider from "../models/Provider";
import ProviderForm from "../components/ProviderForm.jsx";
import Pagination from "../components/Pagination";

const Providers = () => {
    const [providers, setProviders] = useState([
        new Provider(1, "PROV001", "Proveedor 1", "Av. Principal 123", "987654321", "prov1@example.com", "Activo"),
        new Provider(2, "PROV002", "Proveedor 2", "Av. Secundaria 456", "987123456", "prov2@example.com", "Inactivo"),
        ...Array.from({ length: 100 }, (_, i) =>
            new Provider(i + 3, `PROV00${i + 3}`, `Proveedor ${i + 3}`, `Calle ${i + 3}`, "987654321", "Activo")
        ),
    ]);

    const [showModal, setShowModal] = useState(false);
    const [formType, setFormType] = useState("Agregar");
    const [currentProvider, setCurrentProvider] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 10;

    const filteredProviders = providers.filter(
        (provider) =>
            provider.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            provider.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredProviders.length / itemsPerPage);

    const paginatedProviders = filteredProviders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleOpenModal = (type, provider = null) => {
        setFormType(type);
        setCurrentProvider(
            provider || new Provider(providers.length + 1, "", "", "", "", "", "Activo")
        );
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        try {
            Provider.validate(currentProvider); // Validar datos
            if (formType === "Agregar") {
                setProviders([...providers, currentProvider]);
            } else {
                setProviders(
                    providers.map((prov) => (prov.id === currentProvider.id ? currentProvider : prov))
                );
            }
            handleCloseModal();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDelete = (id) => {
        setProviders(providers.filter((provider) => provider.id !== id));
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Lista de Proveedores</h1>
            <div style={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Buscar proveedor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.searchInput}
                />
                <button onClick={() => handleOpenModal("Agregar")} style={styles.addButton}>
                    Agregar Proveedor
                </button>
            </div>
            <table style={styles.table}>
                <thead>
                <tr style={styles.tableHeader}>
                    <th>ID</th>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Dirección</th>
                    <th>Teléfono</th>
                    <th>Correo</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {paginatedProviders.map((provider) => (
                    <tr key={provider.id} style={styles.tableRow}>
                        <td style={styles.tableCell}>{provider.id}</td>
                        <td style={styles.tableCell}>{provider.codigo}</td>
                        <td style={styles.tableCell}>{provider.nombre}</td>
                        <td style={styles.tableCell}>{provider.direccion}</td>
                        <td style={styles.tableCell}>{provider.telefono}</td>
                        <td style={styles.tableCell}>{provider.correo}</td>
                        <td
                            style={{
                                ...styles.tableCell,
                                ...(provider.estado === "Activo" ? styles.active : styles.inactive),
                            }}
                        >
                            {provider.estado}
                        </td>
                        <td style={styles.tableCell}>
                            <button
                                onClick={() => handleOpenModal("Editar", provider)}
                                style={styles.editButton}
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => handleDelete(provider.id)}
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
                        <h2>{formType} Proveedor</h2>
                        <ProviderForm
                            provider={currentProvider}
                            setProvider={setCurrentProvider}
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
        paddingBottom: "30px",
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
        width: "15%",
        padding: "10px",
        backgroundColor: "#524b4a",
        color: "white",
        border: "none",
        cursor: "pointer",
        borderRadius: "5px",
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
    },
    active: {
        color: "green",
        fontWeight: "bold",
    },
    inactive: {
        color: "red",
        fontWeight: "bold",
    },
    editButton: {
        backgroundColor: "#ffc107",
        color: "black",
        border: "none",
        padding: "8px 16px",
        cursor: "pointer",
        borderRadius: "5px",
        marginRight: "5px",
    },
    deleteButton: {
        backgroundColor: "#dc3545",
        color: "white",
        border: "none",
        padding: "8px 16px",
        cursor: "pointer",
        borderRadius: "5px",
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
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
    },
};

export default Providers;
