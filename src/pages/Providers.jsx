import { useState, useEffect } from "react";
import Provider from "../models/Provider";
import ProviderForm from "../components/ProviderForm";
import Pagination from "../components/Pagination";
import providerService from "../services/providerService";
import { useNavigate } from "react-router-dom";

const Providers = () => {
    const [providers, setProviders] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formType, setFormType] = useState("Agregar");
    const [currentProvider, setCurrentProvider] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(null);

    const itemsPerPage = 10;
    const navigate = useNavigate(); // Hook para redirección

    useEffect(() => {
        // Intentamos obtener authData desde sessionStorage
        const storedAuthData = localStorage.getItem("authData");

        if (storedAuthData) {
            try {
                const parsedAuthData = JSON.parse(storedAuthData);
                const roleValue = parsedAuthData.role
                    ? parsedAuthData.role.trim().toLowerCase()
                    : "";

                if (roleValue === "admin") {
                    setIsAuthorized(true);
                } else {
                    setIsAuthorized(false);
                    navigate("/no-autorizado", { replace: true });
                }
            } catch {
                setIsAuthorized(false);
                navigate("/login", { replace: true });
            }
        } else {
            console.warn("No se encontró authData en sessionStorage");
            setIsAuthorized(false);
            navigate("/login", { replace: true });
        }
    }, [navigate]);

    // Solo cargamos los proveedores si el usuario está autorizado (isAuthorized === true)
    useEffect(() => {
        if (isAuthorized) {
            providerService
                .getAll()
                .then((data) => {
                    const providerObjects = data.map(
                        (p) =>
                            new Provider(
                                p.ruc,
                                p.nomproveedor,
                                p.direccion,
                                p.telefono,
                                p.celular,
                                p.contacto,
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
        }
    }, [isAuthorized]);

    // Evitar que se renderice la UI antes de verificar autenticación
    if (isAuthorized === null) {
        return <div>Cargando autenticación...</div>;
    }

    const filteredProviders = providers.filter(
        (provider) =>
            provider.nomproveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            provider.ruc.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredProviders.length / itemsPerPage);
    const paginatedProviders = filteredProviders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleOpenModal = (type, provider = null) => {
        setFormType(type);
        setCurrentProvider(
            provider ||
            new Provider("", "", "", "", "", "", "", "1") // Estado por defecto "1"
        );
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleFormSubmit = (providerData) => {
        try {
            Provider.validate(providerData);

            const payload = {
                ruc: providerData.ruc,
                nomproveedor: providerData.nomproveedor,
                direccion: providerData.direccion,
                telefono: providerData.telefono,
                celular: providerData.celular,
                contacto: providerData.contacto,
                correo: providerData.correo,
                estado: providerData.estado,
            };

            if (formType === "Agregar") {
                providerService
                    .create(payload)
                    .then((newProvider) => {
                        setProviders([
                            ...providers,
                            new Provider(
                                newProvider.ruc,
                                newProvider.nomproveedor,
                                newProvider.direccion,
                                newProvider.telefono,
                                newProvider.celular,
                                newProvider.contacto,
                                newProvider.correo,
                                newProvider.estado
                            ),
                        ]);
                        handleCloseModal();
                    })
                    .catch((error) => console.error("Error creating provider:", error));
            } else {
                providerService
                    .update(providerData.ruc, payload)
                    .then((updatedProvider) => {
                        setProviders(
                            providers.map((prov) =>
                                prov.ruc === providerData.ruc
                                    ? new Provider(
                                        updatedProvider.ruc,
                                        updatedProvider.nomproveedor,
                                        updatedProvider.direccion,
                                        updatedProvider.telefono,
                                        updatedProvider.celular,
                                        updatedProvider.contacto,
                                        updatedProvider.correo,
                                        updatedProvider.estado
                                    )
                                    : prov
                            )
                        );
                        handleCloseModal();
                    })
                    .catch((error) => console.error("Error updating provider:", error));
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDelete = (ruc) => {
        providerService
            .delete(ruc)
            .then(() => {
                setProviders(providers.filter((prov) => prov.ruc !== ruc));
            })
            .catch((error) => console.error("Error deleting provider:", error));
    };

    const handlePageChange = (newPage) => {
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
                    <th>RUC</th>
                    <th>Nombre</th>
                    <th>Dirección</th>
                    <th>Teléfono</th>
                    <th>Celular</th>
                    <th>Contacto</th>
                    <th>Correo</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {paginatedProviders.map((provider) => (
                    <tr key={provider.ruc} style={styles.tableRow}>
                        <td style={styles.tableCell}>{provider.ruc}</td>
                        <td style={styles.tableCell}>{provider.nomproveedor}</td>
                        <td style={styles.tableCell}>{provider.direccion}</td>
                        <td style={styles.tableCell}>{provider.telefono}</td>
                        <td style={styles.tableCell}>{provider.celular}</td>
                        <td style={styles.tableCell}>{provider.contacto}</td>
                        <td style={styles.tableCell}>{provider.correo}</td>
                        <td
                            style={{
                                ...styles.tableCell,
                                color: provider.estado === "1" ? "green" : "red",
                            }}
                        >
                            {provider.estado === "1" ? "Activo" : "Inactivo"}
                        </td>
                        <td style={styles.tableCell}>
                            <button
                                onClick={() => handleOpenModal("Editar", provider)}
                                style={styles.editButton}
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => handleDelete(provider.ruc)}
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
