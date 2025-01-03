import { useState, useEffect } from "react";
import Client from "../models/Client";
import ClientForm from "../components/ClientForm";
import Pagination from "../components/Pagination";
import clientService from "../services/clientService";

const Clientes = () => {
    const [clients, setClients] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formType, setFormType] = useState("Agregar");
    const [currentClient, setCurrentClient] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const itemsPerPage = 10;

    // Se ejecuta al montar el componente, para traer clientes desde el backend
    useEffect(() => {
        console.log("useEffect: intentando obtener la lista de clientes...");
        clientService.getAll()
            .then((data) => {
                console.log("useEffect: data recibida desde el backend:", data);
                // Convertimos cada objeto JSON en una instancia de Client
                const clientObjects = data.map((c) => new Client(
                    c.id,
                    c.codigo,
                    c.nombre,
                    c.direccion,
                    c.telefono,
                    c.estado
                ));
                setClients(clientObjects);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching clients:", error);
                setLoading(false);
            });
    }, []);

    // Filtrado de clientes en base al searchTerm
    const filteredClients = clients.filter((client) =>
        client.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Cálculo de paginación
    const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
    const paginatedClients = filteredClients.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Abre el modal para agregar/editar
    const handleOpenModal = (type, client = null) => {
        console.log(`handleOpenModal: se abre modal en modo '${type}'`);
        setFormType(type);

        // Si no hay client, significa que es 'Agregar'; si hay client, 'Editar'
        if (client) {
            console.log("handleOpenModal: editando cliente existente:", client);
            setCurrentClient(client);
        } else {
            console.log("handleOpenModal: creando nuevo cliente por defecto");
            setCurrentClient(new Client(null, "", "", "", "", "Activo"));
        }

        setShowModal(true);
    };

    const handleCloseModal = () => {
        console.log("handleCloseModal: cerrando modal");
        setShowModal(false);
    };

    // Lógica que corre al dar "Guardar" en el formulario
    const handleFormSubmit = (e) => {
        e.preventDefault();
        console.log("handleFormSubmit: validando currentClient:", currentClient);

        try {
            Client.validate(currentClient);

            if (formType === "Agregar") {
                // Construye un objeto sin "id"
                const payload = {
                    codigo: currentClient.codigo,
                    nombre: currentClient.nombre,
                    direccion: currentClient.direccion,
                    telefono: currentClient.telefono,
                    estado: currentClient.estado,
                };

                clientService.create(payload)
                    .then((newClient) => {
                        console.log("handleFormSubmit: cliente creado en el backend:", newClient);

                        const updatedList = [
                            ...clients,
                            new Client(
                                newClient.id,
                                newClient.codigo,
                                newClient.nombre,
                                newClient.direccion,
                                newClient.telefono,
                                newClient.estado
                            ),
                        ];
                        setClients(updatedList);
                        handleCloseModal();
                    })
                    .catch((error) => {
                        console.error("Error creating client:", error);
                    });
            } else {
                // Editar: se asume que currentClient sí tiene un 'id'
                console.log("handleFormSubmit: editando cliente con id:", currentClient.id);

                // Para PUT, normalmente pasas todo, salvo que tu schema se queje del id.
                // Si tu schema 'id' es dump_only, no lo incluyas:
                const payload = {
                    codigo: currentClient.codigo,
                    nombre: currentClient.nombre,
                    direccion: currentClient.direccion,
                    telefono: currentClient.telefono,
                    estado: currentClient.estado,
                };

                clientService.update(currentClient.id, payload)
                    .then((updatedClient) => {
                        console.log("handleFormSubmit: cliente actualizado en el backend:", updatedClient);
                        const updatedList = clients.map((cli) =>
                            cli.id === currentClient.id
                                ? new Client(
                                    updatedClient.id,
                                    updatedClient.codigo,
                                    updatedClient.nombre,
                                    updatedClient.direccion,
                                    updatedClient.telefono,
                                    updatedClient.estado
                                )
                                : cli
                        );
                        setClients(updatedList);
                        handleCloseModal();
                    })
                    .catch((error) => {
                        console.error("Error updating client:", error);
                    });
            }
        } catch (error) {
            alert(error.message);
        }
    };

    // Eliminar un cliente
    const handleDelete = (id) => {
        console.log("handleDelete: intentando eliminar cliente con id:", id);
        clientService.delete(id)
            .then(() => {
                console.log("handleDelete: cliente eliminado. Eliminando de la lista local...");
                setClients(clients.filter((client) => client.id !== id));
            })
            .catch((error) => {
                console.error("Error deleting client:", error);
            });
    };

    // Cambio de página en la paginación
    const handlePageChange = (newPage) => {
        console.log("handlePageChange: cambiando página a:", newPage);
        setCurrentPage(newPage);
    };

    // Mostrar mientras carga
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
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Dirección</th>
                    <th>Teléfono</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {paginatedClients.map((client) => (
                    <tr key={client.id} style={styles.tableRow}>
                        <td style={styles.tableCell}>{client.id}</td>
                        <td style={styles.tableCell}>{client.codigo}</td>
                        <td style={styles.tableCell}>{client.nombre}</td>
                        <td style={styles.tableCell}>{client.direccion}</td>
                        <td style={styles.tableCell}>{client.telefono}</td>
                        <td
                            style={{
                                ...styles.tableCell,
                                color: client.estado === "Activo" ? "green" : "red",
                            }}
                        >
                            {client.estado}
                        </td>
                        <td style={styles.tableCell}>
                            <button
                                onClick={() => handleOpenModal("Editar", client)}
                                style={styles.editButton}
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => handleDelete(client.id)}
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
                            setClient={setCurrentClient}
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
