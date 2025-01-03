import { useState } from "react";
import Client from "../models/Client";
import ClientForm from "../components/ClientForm";
import Pagination from "../components/Pagination";

const Clientes = () => {
    const [clients, setClients] = useState([
        new Client(1, "CLI001", "Carlos Gómez", "Calle Luna 456", "987654321", "Activo"),
        new Client(2, "CLI002", "Mariana Torres", "Av. Sol 789", "987123456", "Inactivo"),
        // Generar más datos de prueba
        ...Array.from({ length: 1000 }, (_, i) =>
            new Client(i + 3, `CLI00${i + 3}`, `Cliente ${i + 3}`, `Dirección ${i + 3}`, "987654321", "Activo")
        ),
    ]);

    const [showModal, setShowModal] = useState(false);
    const [formType, setFormType] = useState("Agregar");
    const [currentClient, setCurrentClient] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 10;

    const filteredClients = clients.filter(
        (client) =>
            client.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

    const paginatedClients = filteredClients.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleOpenModal = (type, client = null) => {
        setFormType(type);
        setCurrentClient(client || new Client(clients.length + 1, "", "", "", "", "Activo"));
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        try {
            Client.validate(currentClient);
            if (formType === "Agregar") {
                setClients([...clients, currentClient]);
            } else {
                setClients(clients.map((cli) => (cli.id === currentClient.id ? currentClient : cli)));
            }
            handleCloseModal();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDelete = (id) => {
        setClients(clients.filter((client) => client.id !== id));
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

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
                            <button onClick={() => handleOpenModal("Editar", client)} style={styles.editButton}>
                                Editar
                            </button>
                            <button onClick={() => handleDelete(client.id)} style={styles.deleteButton}>
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
