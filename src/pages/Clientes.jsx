import { useState, useEffect } from "react";
import Client from "../models/Client";
import ClientForm from "../components/ClientForm";
import Pagination from "../components/Pagination";
import clientService from "../services/clientService";
import {useNavigate} from "react-router-dom";

const Clientes = () => {
    const [clients, setClients] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formType, setFormType] = useState("Agregar");
    const [currentClient, setCurrentClient] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const navigate = useNavigate(); // Hook para redirección

    const itemsPerPage = 10;

    useEffect(() => {
        // Obtener authData desde sessionStorage
        const storedAuthData = localStorage.getItem("authData");
        if (storedAuthData) {
            try {
                const parsedAuthData = JSON.parse(storedAuthData);

                if (parsedAuthData.role === "admin") {
                    setIsAuthorized(true); // Usuario autorizado
                } else {
                    console.warn("Acceso denegado: Usuario no es admin");
                    navigate("/no-autorizado"); // Redirigir si no es admin
                }
            } catch (error) {
                console.error("Error parseando authData:", error);
                navigate("/login"); // Si hay error, enviarlo al login
            }
        } else {
            console.warn("No se encontró authData en sessionStorage");
            navigate("/login"); // Si no hay authData, redirigir al login
        }
    }, [navigate]);

    useEffect(() => {
        if (isAuthorized) {
            clientService.getAll()
                .then((data) => {
                    const clientObjects = data.map((c) =>
                        new Client(
                            c.idcliente,
                            c.tdoc,
                            c.nomcliente,
                            c.direccion,
                            c.telefono,
                            c.estado
                        )
                    );
                    setClients(clientObjects);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching clients:", error);
                    setLoading(false);
                });
        }
    }, [isAuthorized]);

    const filteredClients = clients.filter(
        (client) =>
            client.nomcliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.idcliente.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
    const paginatedClients = filteredClients.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Abre el modal para Agregar o Editar
    const handleOpenModal = (type, client = null) => {
        setFormType(type);
        // Si no hay cliente (Agregar), por defecto 'estado' = "1" => Activo
        setCurrentClient(client || new Client("", "", "", "", "", "1"));
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    // Recibe el objeto clientData con estado ya convertido a número en ClientForm
    const handleFormSubmit = (clientData) => {
        try {
            // Validación (throws si falta algún dato)
            Client.validate(clientData);

            // Construimos el payload que se enviará al backend
            const payload = {
                idcliente: clientData.idcliente,
                tdoc: clientData.tdoc,
                nomcliente: clientData.nomcliente,
                direccion: clientData.direccion,
                telefono: clientData.telefono,
                estado: clientData.estado, // <-- ya es un número
            };

            if (formType === "Agregar") {
                // Crear nuevo
                clientService
                    .create(payload)
                    .then((newClient) => {
                        // Actualiza el estado local con el nuevo cliente
                        setClients([
                            ...clients,
                            new Client(
                                newClient.idcliente,
                                newClient.tdoc,
                                newClient.nomcliente,
                                newClient.direccion,
                                newClient.telefono,
                                newClient.estado
                            ),
                        ]);
                        handleCloseModal();
                    })
                    .catch((error) => console.error("Error creating client:", error));
            } else {
                // Editar existente
                clientService
                    .update(clientData.idcliente, payload)
                    .then((updatedClient) => {
                        setClients(
                            clients.map((cli) =>
                                cli.idcliente === clientData.idcliente
                                    ? new Client(
                                        updatedClient.idcliente,
                                        updatedClient.tdoc,
                                        updatedClient.nomcliente,
                                        updatedClient.direccion,
                                        updatedClient.telefono,
                                        updatedClient.estado
                                    )
                                    : cli
                            )
                        );
                        handleCloseModal();
                    })
                    .catch((error) => console.error("Error updating client:", error));
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDelete = (id) => {
        clientService
            .delete(id)
            .then(() => {
                setClients(clients.filter((client) => client.idcliente !== id));
            })
            .catch((error) => console.error("Error deleting client:", error));
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    if (loading) {
        return <div>Cargando clientes...</div>;
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Lista de Clientes</h1>
            <div style={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Buscar cliente..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.searchInput}
                />
                <button onClick={() => handleOpenModal("Agregar")} style={styles.addButton}>
                    Agregar Cliente
                </button>
            </div>

            <table style={styles.table}>
                <thead>
                <tr style={styles.tableHeader}>
                    <th>ID</th>
                    <th>Documento</th>
                    <th>Nombre</th>
                    <th>Dirección</th>
                    <th>Teléfono</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {paginatedClients.map((client) => (
                    <tr key={client.idcliente} style={styles.tableRow}>
                        <td style={styles.tableCell}>{client.idcliente}</td>
                        <td style={styles.tableCell}>{client.tdoc}</td>
                        <td style={styles.tableCell}>{client.nomcliente}</td>
                        <td style={styles.tableCell}>{client.direccion}</td>
                        <td style={styles.tableCell}>{client.telefono}</td>
                        <td
                            style={{
                                ...styles.tableCell,
                                color: client.estado === "1" ? "green" : "red",
                            }}
                        >
                            {client.estado === "1" ? "Activo" : "Inactivo"}
                        </td>
                        <td style={styles.tableCell}>
                            <button
                                onClick={() => handleOpenModal("Editar", client)}
                                style={styles.editButton}
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => handleDelete(client.idcliente)}
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
                        <h2>{formType} Cliente</h2>
                        <ClientForm
                            client={currentClient}
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
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.3)",
    },
};

export default Clientes;
