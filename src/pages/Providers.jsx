import { useState, useEffect } from "react";
import Provider from "../models/Provider";
import ProviderForm from "../components/ProviderForm";
import Pagination from "../components/Pagination";
import providerService from "../services/providerService";

const Providers = () => {
    const [providers, setProviders] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formType, setFormType] = useState("Agregar");
    const [currentProvider, setCurrentProvider] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const itemsPerPage = 10;

    // useEffect para cargar proveedores desde el backend
    useEffect(() => {
        console.log("useEffect: intentando obtener la lista de proveedores...");
        providerService
            .getAll()
            .then((data) => {
                console.log("Proveedores recibidos del backend:", data);
                // Convertir cada objeto en una instancia de Provider (opcional)
                const providerObjects = data.map(
                    (p) =>
                        new Provider(
                            p.id,
                            p.codigo,
                            p.nombre,
                            p.direccion,
                            p.telefono,
                            p.correo,
                            p.estado
                        )
                );
                setProviders(providerObjects);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching providers:", error);
                setLoading(false);
            });
    }, []);

    // Filtrado de búsqueda
    const filteredProviders = providers.filter(
        (provider) =>
            provider.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            provider.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Cálculo de paginación
    const totalPages = Math.ceil(filteredProviders.length / itemsPerPage);
    const paginatedProviders = filteredProviders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Abre modal para Agregar o Editar
    const handleOpenModal = (type, provider = null) => {
        console.log(`handleOpenModal: modo '${type}'`);
        setFormType(type);

        if (provider) {
            console.log("Editando proveedor existente:", provider);
            setCurrentProvider(provider);
        } else {
            console.log("Creando nuevo proveedor");
            // id = null y estado por defecto "Activo"
            setCurrentProvider(new Provider(null, "", "", "", "", "", "Activo"));
        }

        setShowModal(true);
    };

    const handleCloseModal = () => {
        console.log("Cerrando modal");
        setShowModal(false);
    };

    // Guardar (Agregar / Editar)
    const handleFormSubmit = (e) => {
        e.preventDefault();
        console.log("handleFormSubmit: validando currentProvider:", currentProvider);

        try {
            // Validar campos requeridos en front
            Provider.validate(currentProvider);

            // Construimos un payload sin "id" (si tu schema lo tiene dump_only)
            const payload = {
                codigo: currentProvider.codigo,
                nombre: currentProvider.nombre,
                direccion: currentProvider.direccion,
                telefono: currentProvider.telefono,
                correo: currentProvider.correo,
                contacto: currentProvider.contacto, // si tu schema lo define
                estado: currentProvider.estado,
            };

            if (formType === "Agregar") {
                console.log("Agregando nuevo proveedor (POST)...");
                providerService
                    .create(payload)
                    .then((newProv) => {
                        console.log("Proveedor creado en backend:", newProv);
                        // Agregar a la lista local
                        const updatedList = [
                            ...providers,
                            new Provider(
                                newProv.id,
                                newProv.codigo,
                                newProv.nombre,
                                newProv.direccion,
                                newProv.telefono,
                                newProv.correo,
                                newProv.estado
                            ),
                        ];
                        setProviders(updatedList);
                        handleCloseModal();
                    })
                    .catch((error) => {
                        console.error("Error creating provider:", error);
                    });
            } else {
                console.log("Editando proveedor con id:", currentProvider.id);
                providerService
                    .update(currentProvider.id, payload)
                    .then((updatedProv) => {
                        console.log("Proveedor actualizado en backend:", updatedProv);
                        const updatedList = providers.map((prov) =>
                            prov.id === currentProvider.id
                                ? new Provider(
                                    updatedProv.id,
                                    updatedProv.codigo,
                                    updatedProv.nombre,
                                    updatedProv.direccion,
                                    updatedProv.telefono,
                                    updatedProv.correo,
                                    updatedProv.estado
                                )
                                : prov
                        );
                        setProviders(updatedList);
                        handleCloseModal();
                    })
                    .catch((error) => {
                        console.error("Error updating provider:", error);
                    });
            }
        } catch (error) {
            alert(error.message);
        }
    };

    // Eliminar
    const handleDelete = (id) => {
        console.log("Eliminando proveedor con id:", id);
        providerService
            .delete(id)
            .then((res) => {
                console.log("Proveedor eliminado en backend:", res);
                // Actualizar lista local
                setProviders(providers.filter((prov) => prov.id !== id));
            })
            .catch((error) => {
                console.error("Error deleting provider:", error);
            });
    };

    // Cambio de página
    const handlePageChange = (newPage) => {
        console.log("Cambiando a página:", newPage);
        setCurrentPage(newPage);
    };

    if (loading) {
        return <div>Cargando proveedores...</div>;
    }

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
                                color: provider.estado === "Activo" ? "green" : "red",
                                fontWeight: "bold",
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

// Estilos
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
    editButton: {
        backgroundColor: "#ffc107",
        color: "black",
        border: "none",
        padding: "8px 16px",
        cursor: "pointer",
        borderRadius: "5px",
        marginRight: "5px",
        fontWeight: "bold",
    },
    deleteButton: {
        backgroundColor: "#dc3545",
        color: "white",
        border: "none",
        padding: "8px 16px",
        cursor: "pointer",
        borderRadius: "5px",
        fontWeight: "bold",
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
