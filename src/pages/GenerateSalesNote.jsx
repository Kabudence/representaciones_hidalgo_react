import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import api from "../services/api";
import SalesNoteService from "../services/salesNoteService.js";

const GenerateXMLStructureForm = () => {
    // Eliminado myInformation ya que no se usa
    const [partyClient, setPartyClient] = useState({
        AddressTypeCode: "0000",
        RegistrationName: "",
        IdentifyCode: "",
    });

    const [noteSalesInformation, setNoteSalesInformation] = useState({
        NoteID: "",
        IssueDate: "",
    });

    const [itemList, setItemList] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false); // Nuevo estado para el mensaje
    const [newItem, setNewItem] = useState({
        ItemName: "",
        ItemQuantity: "",
        ItemPrice: "",
    });
    const [editingIndex, setEditingIndex] = useState(-1);

    useEffect(() => {
        const fetchNextNote = async () => {
            try {
                const nextNumber = await SalesNoteService.getCurrentSalesNote();
                const currentDate = new Date().toISOString().split("T")[0];
                setNoteSalesInformation({
                    NoteID: nextNumber.toString(),
                    IssueDate: currentDate,
                });
            } catch (error) {
                console.error("Error fetching next sales note:", error);
            }
        };
        fetchNextNote();
    }, []);

    const handlePartyClientChange = (e) => {
        const { name, value } = e.target;
        setPartyClient((prev) => ({ ...prev, [name]: value }));
    };

    const handleNewItemChange = (e) => {
        const { name, value } = e.target;
        setNewItem((prev) => ({ ...prev, [name]: value }));
    };

    const addItem = () => {
        if (newItem.ItemName.trim() !== "") {
            if (editingIndex === -1) {
                setItemList((prev) => [...prev, newItem]);
            } else {
                const updatedItems = [...itemList];
                updatedItems[editingIndex] = newItem;
                setItemList(updatedItems);
                setEditingIndex(-1);
            }
            setNewItem({ ItemName: "", ItemQuantity: "", ItemPrice: "" });
        }
    };

    const deleteItem = (index) => {
        const updatedItems = itemList.filter((_, i) => i !== index);
        setItemList(updatedItems);
    };

    const editItem = (index) => {
        setEditingIndex(index);
        setNewItem(itemList[index]);
    };

    const computeOperationInformation = () => {
        let subTotal = 0;
        itemList.forEach((item) => {
            const qty = parseFloat(item.ItemQuantity) || 0;
            const price = parseFloat(item.ItemPrice) || 0;
            subTotal += qty * price;
        });

        return {
            TotalAmount: subTotal.toFixed(2),
            IGV: "0",
            Amount: subTotal.toFixed(2),
            TypeOperation: "Contado",
        };
    };

    // Simplificado sin try/catch redundante
    const callCreateAutomatic = async () => {
        const data = {
            PartyClient: {
                IdentifyCode: partyClient.IdentifyCode,
                RegistrationName: partyClient.RegistrationName,
            },
        };
        await api.post("/clientes/automatic-create", data);
    };

    // Simplificado sin try/catch redundante
    const callCreateInProcess = async () => {
        try {
            const operationInfo = computeOperationInformation();
            const data = {
                tip_mov: 1,
                tip_docum: "09",
                num_docum: `N - ${noteSalesInformation.NoteID}`, // Formato solicitado
                ruc_cliente: partyClient.IdentifyCode,
                vvta: operationInfo.Amount,
                igv: operationInfo.IGV,
                total: operationInfo.TotalAmount,
                idemp: "06", // 🔹 Cambia esto por el valor dinámico que necesites
                ItemList: itemList,
            };
            const response = await api.post("/regmovcab/create-inprocess", data);
            console.log("Venta en proceso creada:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error creando venta en proceso:", error);
            throw error;
        }
    };

    const generatePDF = () => {
        const doc = new jsPDF("portrait", "pt", "a4"); // A4 vertical

        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text("Representaciones HIDALGO", 40, 40);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text("Fabricación y Venta por Mayor y Menor de Muebles", 40, 55);
        doc.text("para el Hogar Metálicos y de Madera", 40, 67);
        doc.text("Colchones en General", 40, 79);

        // Nota de venta
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text(`COMPROBANTE DE PAGO N° ${noteSalesInformation.NoteID}`, 350, 50);

        // Fecha
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text(`Fecha: ${noteSalesInformation.IssueDate}`, 350, 68);

        // Datos del cliente
        doc.setFontSize(11);
        doc.text("Nombre de cliente:", 40, 120);
        doc.text(partyClient.RegistrationName || "", 134, 120);

        // Reducir espacio entre Cliente y la tabla
        const startTableY = 135; // Antes 160, ahora más arriba

        // Columnas de la tabla
        const tableColumn = ["CANT.", "DESCRIP.", "PRECIO UNIT.", "PRECIO TOTAL"];

        // Generamos las filas
        const tableRows = itemList.map((item) => {
            const qty = item.ItemQuantity || "";
            const desc = item.ItemName || "";
            const priceUnit = item.ItemPrice || "";
            const priceTotal = (parseFloat(item.ItemPrice) * parseInt(item.ItemQuantity)).toFixed(2) || "";

            return [qty, desc, priceUnit, priceTotal];
        });

        // Agregar fila con el total
        const operationInfo = computeOperationInformation();
        tableRows.push(["", "Total", "", `S/ ${operationInfo.TotalAmount}`]);

        // Generamos la tabla con autoTable
        doc.autoTable({
            columnStyles: {
                0: { cellWidth: 52 },  // CANT. (10%)
                1: { cellWidth: 300 }, // DESCRIPCIÓN (60%)
                2: { cellWidth: 82 },  // PRECIO UNIT. (15%)
                3: { cellWidth: 81 },  // PRECIO TOTAL (15%)
            },
            startY: startTableY,
            head: [tableColumn],
            body: tableRows,
            theme: "grid",
            headStyles: {
                fillColor: [211, 211, 211],
                textColor: [0, 0, 0],
                fontSize: 10,
            },
            bodyStyles: {
                fontSize: 9,
                textColor: [0, 0, 0],
            },
            tableLineColor: [0, 0, 0],
            tableLineWidth: 0.5,
            margin: { left: 40, right: 40 },
            didDrawCell: function (data) {
                if (data.row.index === tableRows.length - 1) {
                    doc.setFont("helvetica", "bold");
                }
            },
        });

        // Guardamos
        doc.save(`NotaVenta_${noteSalesInformation.NoteID}.pdf`);
    };

    const handleGenerate = async () => {
        try {
            await callCreateAutomatic();
            await callCreateInProcess();
            generatePDF();
            await SalesNoteService.incrementSalesNote();

            // Mostrar mensaje de éxito
            setShowSuccess(true);

            // Recargar la página después de 2 segundos
            setTimeout(() => {
                window.location.reload();
            }, 2000);

        } catch (error) {
            console.error("Error durante el proceso:", error);
        }
    };

    return (
        <div style={styles.container}>
            {/* Mensaje de éxito */}
            {showSuccess && (
                <div style={styles.successMessage}>
                    ¡VENTA GENERADA CON ÉXITO!
                </div>
            )}
            <h1 style={styles.headerTitle}>
                CONSTANCIA DE PAGO N° {noteSalesInformation.NoteID}
            </h1>
            <div style={styles.dateText}>
                Fecha: {noteSalesInformation.IssueDate}
            </div>

            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Datos del Cliente</h2>
                <label style={styles.label}>
                    Nombre / Razón Social:
                    <input
                        type="text"
                        name="RegistrationName"
                        value={partyClient.RegistrationName}
                        onChange={handlePartyClientChange}
                        style={styles.input}
                    />
                </label>
                <label style={styles.label}>
                    Documento / RUC:
                    <input
                        type="text"
                        name="IdentifyCode"
                        value={partyClient.IdentifyCode}
                        onChange={handlePartyClientChange}
                        style={styles.input}
                    />
                </label>
            </div>

            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Ítems</h2>
                <label style={styles.label}>
                    Descripción:
                    <input
                        type="text"
                        name="ItemName"
                        value={newItem.ItemName}
                        onChange={handleNewItemChange}
                        style={styles.input}
                    />
                </label>
                <label style={styles.label}>
                    Cantidad:
                    <input
                        type="number"
                        name="ItemQuantity"
                        value={newItem.ItemQuantity}
                        onChange={handleNewItemChange}
                        style={styles.input}
                    />
                </label>
                <label style={styles.label}>
                    Precio:
                    <input
                        type="number"
                        name="ItemPrice"
                        value={newItem.ItemPrice}
                        onChange={handleNewItemChange}
                        style={styles.input}
                    />
                </label>
                <button type="button" onClick={addItem} style={styles.addItemButton}>
                    {editingIndex === -1 ? "Agregar Ítem" : "Guardar Cambios"}
                </button>

                {itemList.length > 0 && (
                    <div style={styles.currentItems}>
                        <h3 style={styles.subTitle}>Ítems Agregados</h3>
                        <ul style={styles.ul}>
                            {itemList.map((item, index) => (
                                <li key={index} style={styles.li}>
                                    <div style={styles.itemContainer}>
                                        <div style={styles.itemText}>
                                            <strong>{item.ItemName}</strong> —
                                            Cant: {item.ItemQuantity} —
                                            Precio: {item.ItemPrice}
                                        </div>
                                        <div style={styles.buttonGroup}>
                                            <button
                                                style={styles.editButton}
                                                onClick={() => editItem(index)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                style={styles.deleteButton}
                                                onClick={() => deleteItem(index)}
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <button type="button" onClick={handleGenerate} style={styles.generateButton}>
                Completar Compra
            </button>
        </div>
    );
};

const styles = {
    container: {
        margin: "40px auto",
        padding: "40px",
        maxWidth: "600px",
        backgroundColor: "#f2f2f2",
        border: "1px solid #dee2e6", // Borde más suave
        borderRadius: "8px",
        fontFamily: "'PT Sans Narrow', sans-serif",
        color: "#333333",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
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
    headerTitle: {
        textAlign: "center",
        fontSize: "28px",
        marginBottom: "10px",
        color: "#333",
    },
    dateText: {
        fontSize: "16px",
        marginBottom: "20px",
        color: "#666666",
    },
    section: {
        width: "100%",
        marginBottom: "20px",
        padding: "15px",
        border: "1px solid #ced4da", // Borde gris claro
        borderRadius: "8px",
        backgroundColor: "#fff",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    },
    sectionTitle: {
        fontSize: "20px",
        marginBottom: "10px",
        color: "#212529", // Negro suave
        textAlign: "center",
    },
    label: {
        display: "block",
        marginBottom: "10px",
        fontWeight: "bold",
        color: "#495057", // Gris oscuro
    },
    input: {
        width: "100%",
        padding: "8px",
        marginTop: "5px",
        marginBottom: "10px",
        border: "1px solid #ced4da", // Borde gris claro
        borderRadius: "4px",
        backgroundColor: "#ffffff", // Fondo blanco
        color: "#212529", // Texto oscuro
    },
    addItemButton: {
        marginTop: "10px",
        padding: "8px 16px",
        backgroundColor: "#524b4a", // Gris medio como botones de Lines
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
    currentItems: {
        marginTop: "15px",
    },
    subTitle: {
        fontSize: "16px",
        marginBottom: "10px",
        color: "#333333",
    },
    ul: {
        listStyleType: "none",
        padding: 0,
    },
    li: {
        padding: "5px 0",
        borderBottom: "1px solid #444",
    },
    generateButton: {
        padding: "10px 20px",
        backgroundColor: "#524b4a",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontWeight: "bold",
        marginTop: "10px",
    },
    pre: {
        backgroundColor: "#333",
        padding: "10px",
        borderRadius: "5px",
        whiteSpace: "pre-wrap",
        border: "1px solid #444",
        color: "#333333",
        width: "100%",
        overflowX: "auto",
        marginTop: "20px",
    },
};

export default GenerateXMLStructureForm;
