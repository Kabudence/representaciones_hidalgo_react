import { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import api from "../services/api";
import SalesNoteService from "../services/salesNoteService.js";
import CancelSaleModal from "../components/CancelSaleModal.jsx";

import {TbZoomCancelFilled} from "react-icons/tb";
import AddItem from "../components/AddItem.jsx";

const GenerateXMLStructureForm = () => {
    const [partyClient, setPartyClient] = useState({
        AddressTypeCode: "0000",
        RegistrationName: "",
        IdentifyCode: "",
    });
    const [editingIndex, setEditingIndex] = useState(-1);

    const [noteSalesInformation, setNoteSalesInformation] = useState({
        NoteID: "",
        IssueDate: "",
    });
    const [showAddItemModal, setShowAddItemModal] = useState(false);
    const [itemList, setItemList] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const isGeneratingRef = useRef(false);
    const [paymentTypes, setPaymentTypes] = useState([]);
    const [paymentList, setPaymentList] = useState([
        { tipo_venta_id: "", monto: "", referencia: "" }
    ]);


    const getPeruCurrentDate = () => {
        const date = new Date();
        date.setHours(date.getHours() - 5); // Ajuste UTC-5
        // Formato manual garantizado: dd/mm/aaaa
        return [
            String(date.getDate()).padStart(2, '0'),
            String(date.getMonth() + 1).padStart(2, '0'),
            date.getFullYear()
        ].join('/');
    };

    const getNoteIdFromNumDocum = (numDocum) => {
        if (!numDocum) {
            return noteSalesInformation.NoteID;
        }

        const parts = String(numDocum).split(" - ");
        return (parts[1] || parts[0] || noteSalesInformation.NoteID).trim();
    };



    // Función modificada para manejar edición y creación
    const handleAddItemFromModal = (item) => {
        const newItem = {
            ItemName: item.producto,
            ItemQuantity: item.cantidad,
            ItemPrice: item.precio,
            IGV: item.igv || "0"
        };

        if (editingIndex !== -1) {
            // Modificar ítem existente
            const updatedItems = [...itemList];
            updatedItems[editingIndex] = newItem;
            setItemList(updatedItems);
            setEditingIndex(-1);
        } else {
            // Agregar nuevo ítem
            setItemList(prev => [...prev, newItem]);
        }
        setShowAddItemModal(false);
    };

    useEffect(() => {
        const fetchNextNote = async () => {
            let nextNumber = "0000"; // Valor por defecto
            try {
                nextNumber = await SalesNoteService.getCurrentSalesNote();
            } catch (error) {
                console.error("Error obteniendo número de nota:", error);
            }

            // Establecer fecha INDEPENDIENTEMENTE del resultado de la API
            setNoteSalesInformation(prev => ({
                ...prev,
                NoteID: nextNumber.toString(),
                IssueDate: getPeruCurrentDate() // Fuerza actualización de fecha
            }));
        };
        fetchNextNote();
    }, []);

    useEffect(() => {
        const fetchPaymentTypes = async () => {
            try {
                const response = await api.get("/regmovcab-pagos/tipos-venta");
                setPaymentTypes(response.data?.tipos_venta || []);
            } catch (error) {
                console.error("Error obteniendo tipos de pago:", error);
            }
        };

        fetchPaymentTypes();
    }, []);


    useEffect(() => {
    }, [noteSalesInformation]);

    useEffect(() => {
    }, [showSuccess]);

    const getTotalVenta = () => {
        return itemList.reduce((total, item) => {
            return total + ((parseFloat(item.ItemQuantity) || 0) * (parseFloat(item.ItemPrice) || 0));
        }, 0);
    };

    const getTotalPagado = () => {
        return paymentList.reduce((total, payment) => {
            return total + (parseFloat(payment.monto) || 0);
        }, 0);
    };

    const getDiferenciaPago = () => {
        return getTotalVenta() - getTotalPagado();
    };

    const handlePaymentChange = (index, field, value) => {
        const updatedPayments = [...paymentList];
        updatedPayments[index] = {
            ...updatedPayments[index],
            [field]: value
        };
        setPaymentList(updatedPayments);
    };

    const addPayment = () => {
        setPaymentList(prev => [
            ...prev,
            { tipo_venta_id: "", monto: "", referencia: "" }
        ]);
    };

    const deletePayment = (index) => {
        if (paymentList.length === 1) {
            setPaymentList([{ tipo_venta_id: "", monto: "", referencia: "" }]);
            return;
        }
        setPaymentList(paymentList.filter((_, i) => i !== index));
    };

    const getPaymentPayload = () => {
        return paymentList.map(payment => ({
            tipo_venta_id: parseInt(payment.tipo_venta_id, 10),
            monto: parseFloat(payment.monto || 0).toFixed(2),
            referencia: payment.referencia || null
        }));
    };

    const validatePayments = () => {
        if (itemList.length === 0) {
            alert("Agrega al menos un producto antes de completar la venta.");
            return false;
        }

        if (paymentList.length === 0) {
            alert("Agrega al menos un medio de pago.");
            return false;
        }

        for (let index = 0; index < paymentList.length; index++) {
            const payment = paymentList[index];
            if (!payment.tipo_venta_id) {
                alert(`Selecciona el medio de pago en la fila ${index + 1}.`);
                return false;
            }

            const monto = parseFloat(payment.monto);
            if (!monto || monto <= 0) {
                alert(`Ingresa un monto valido mayor a 0 en la fila ${index + 1}.`);
                return false;
            }
        }

        const totalVenta = getTotalVenta();
        const totalPagado = getTotalPagado();
        const diferencia = totalVenta - totalPagado;

        if (Math.abs(diferencia) > 0.01) {
            alert(`La suma de pagos debe coincidir con el total de la venta. Total venta: S/ ${totalVenta.toFixed(2)}. Total pagado: S/ ${totalPagado.toFixed(2)}. Diferencia: S/ ${diferencia.toFixed(2)}.`);
            return false;
        }

        return true;
    };

    const handleGenerate = async () => {
        if (isGeneratingRef.current) {
            return;
        }

        isGeneratingRef.current = true;
        setIsGenerating(true);

        let completedSuccessfully = false;

        try {
            if (!validatePayments()) {
                return;
            }

            // 1. Ejecutar las operaciones en orden
            await callCreateAutomatic();

            const ventaCreada = await callCreateInProcess();

            if (!ventaCreada?.idmov) {
                throw new Error("No se recibio el idmov de la venta creada.");
            }

            const createdNoteId = getNoteIdFromNumDocum(ventaCreada.num_docum);
            const currentDate = getPeruCurrentDate();

            await api.post(`/regmovcab-pagos/${ventaCreada.idmov}`, {
                pagos: getPaymentPayload()
            });

            generatePDF(createdNoteId, currentDate);

            const nextNumber = ventaCreada.next_boleta || await SalesNoteService.getCurrentSalesNote();

            completedSuccessfully = true;

            setShowSuccess(true);



            setPartyClient({ AddressTypeCode: "0000", RegistrationName: "", IdentifyCode: "" });
            setItemList([]);
            setPaymentList([{ tipo_venta_id: "", monto: "", referencia: "" }]);


            // 5. Actualizar número de nota
            setNoteSalesInformation({
                NoteID: nextNumber.toString(),
                IssueDate: currentDate
            });


            // 6. Programar ocultar mensaje
            setTimeout(() => {
                setShowSuccess(false);
            }, 2000);

        } catch (error) {
            console.error("[ERROR] Durante el proceso:", error);
            alert(error.response?.data?.error || error.message || "Ocurrio un error durante el proceso.");
        } finally {
            const releaseGenerateLock = () => {
                isGeneratingRef.current = false;
                setIsGenerating(false);
            };

            if (completedSuccessfully) {
                setTimeout(releaseGenerateLock, 1200);
            } else {
                releaseGenerateLock();
            }
        }
    };

    const handlePartyClientChange = (e) => {
        const { name, value } = e.target;
        setPartyClient((prev) => ({ ...prev, [name]: value }));
    };



    const deleteItem = (index) => {
        const updatedItems = itemList.filter((_, i) => i !== index);
        setItemList(updatedItems);
    };

    const editItem = (index) => {
        setEditingIndex(index);
        setShowAddItemModal(true);
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
                num_docum: `N006 - ${noteSalesInformation.NoteID}`, // Formato solicitado
                ruc_cliente: partyClient.IdentifyCode,
                vvta: operationInfo.Amount,
                igv: operationInfo.IGV,
                total: operationInfo.TotalAmount,
                idemp: "06", // 🔹 Cambia esto por el valor dinámico que necesites
                ItemList: itemList,
            };
            const response = await api.post("/regmovcab/create-inprocess", data);
            return response.data;
        } catch (error) {
            console.error("Error creando venta en proceso:", error);
            throw error;
        }
    };

    const generatePDF = (noteId = noteSalesInformation.NoteID, issueDate = noteSalesInformation.IssueDate) => {
        const doc = new jsPDF("portrait", "pt", "a4"); // A4 vertical

        // Margen para el borde
        const margin = 40;
        const pageWidth = doc.internal.pageSize.getWidth();

        // Dibujar borde alrededor de todo el contenido
        doc.setLineWidth(0.9);

        // Contenido del PDF
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text("Representaciones HIDALGO", margin + 10, margin + 30);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text("Fabricación y Venta por Mayor y Menor de Muebles", margin + 10, margin + 45);
        doc.text("para el Hogar Metálicos y de Madera", margin + 10, margin + 57);
        doc.text("Colchones en General", margin + 10, margin + 69);

        // Nota de venta
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text(`NOTA DE VENTA `, 380, margin + 30);

        // Agrandar la letra del número de comprobante
        doc.setFontSize(18); // Tamaño de fuente más grande
        doc.text(`N° ${noteId}`, 405, margin + 52);

        // Fecha
        doc.setFont("helvetica", "normal");
        doc.setFontSize(13);
        doc.text(`Fecha: ${issueDate}`, 370, margin + 83);

        // Datos del cliente
        doc.setFontSize(11);
        doc.text("Nombre de cliente:", margin + 10, margin + 90);
        doc.text(partyClient.RegistrationName || "", margin + 103, margin + 90);

        // Reducir espacio entre Cliente y la tabla
        const startTableY = margin + 105; // Antes 160, ahora más arriba

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
            margin: { left: margin, right: margin },
            didDrawCell: function (data) {
                if (data.row.index === tableRows.length - 1) {
                    doc.setFont("helvetica", "bold");
                }
            },
        });

        // Obtener la posición Y final de la tabla
        const finalY = doc.lastAutoTable.finalY;

        // Agregar texto "NOTA" en la parte inferior izquierda
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("NOTA:", margin + 10, finalY + 20);
        doc.setFont("helvetica", "normal");
        doc.text("Sirvase a canjear por su boleta de venta o factura", margin + 50, finalY + 20);

        // Dibujar una línea para la firma (40 espacios más abajo)
        const lineY = finalY + 60; // 40 espacios más abajo
        doc.setLineWidth(0.5);
        doc.line(230, lineY, 330, lineY); // Línea horizontal para la firma

        // Agregar "Cancelado" debajo de la línea
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("Cancelado", 250, lineY + 20);

        // Ajustar el borde para que termine 10px más abajo de "Cancelado"
        const borderBottomY = lineY + 40; // 10px más abajo de "Cancelado"
        doc.setLineWidth(0.9); // Grosor de la línea del borde
        doc.rect(
            margin - 14, // Agrandar 14px a la izquierda
            margin - 5,  // Agrandar 5px arriba
            pageWidth - 2 * margin + 28, // Agrandar 28px en total (14px por lado)
            borderBottomY - margin + 5 // Ajustar altura para terminar 10px más abajo de "Cancelado"
        );

        // Guardamos
        doc.save(`NotaVenta_${noteId}.pdf`);
    };



    return (
        <div style={styles.container}>
            {/* Mensaje de éxito */}
            {showSuccess && (
                <div style={styles.successMessage}>
                    ¡VENTA GENERADA CON ÉXITO!
                </div>
            )}

            {/* Encabezado con título y botón de cancelar */}
            <div style={styles.titulo}>
                <h1 style={styles.headerTitle}>
                    CONSTANCIA DE PAGO N° {noteSalesInformation.NoteID}
                </h1>
                <button
                    type="button"
                    onClick={() => setShowCancelModal(true)}
                    style={styles.cancelButton}
                >
                    <TbZoomCancelFilled />
                </button>
            </div>

            {/* Fecha */}
            <div style={styles.dateText}>
                Fecha: {noteSalesInformation.IssueDate || getPeruCurrentDate()}
            </div>

            {/* Sección de datos del cliente */}
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

            {/* Sección de ítems */}
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Ítems</h2>

                {/* Botón para abrir modal de AddItem */}
                <button
                    type="button"
                    onClick={() => setShowAddItemModal(true)}
                    style={{
                        ...styles.addItemButton,

                    }}
                >
                    {editingIndex !== -1 ? "Editando Producto" : "Agregar Producto"}
                </button>

                {/* Lista de ítems agregados */}
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
                                            Precio Unit: S/ {item.ItemPrice} —
                                            Subtotal: S/ {(parseFloat(item.ItemQuantity) * parseFloat(item.ItemPrice)).toFixed(2)}
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

                        {/* Total */}
                        <div style={styles.totalContainer}>
                            <strong>Total : </strong>
                            S/ {itemList.reduce((total, item) => {
                            return total + (parseFloat(item.ItemQuantity) * parseFloat(item.ItemPrice));
                        }, 0).toFixed(2)}
                        </div>
                    </div>
                )}
            </div>

            {/* Sección de medios de pago */}
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Medios de Pago</h2>

                {paymentList.map((payment, index) => (
                    <div key={index} style={styles.paymentRow}>
                        <select
                            value={payment.tipo_venta_id}
                            onChange={(e) => handlePaymentChange(index, "tipo_venta_id", e.target.value)}
                            style={styles.paymentSelect}
                        >
                            <option value="">Seleccionar medio</option>
                            {paymentTypes.map((type) => (
                                <option key={type.tipo_venta_id} value={type.tipo_venta_id}>
                                    {type.name}
                                </option>
                            ))}
                        </select>

                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="Monto"
                            value={payment.monto}
                            onChange={(e) => handlePaymentChange(index, "monto", e.target.value)}
                            style={styles.paymentInput}
                        />

                        <input
                            type="text"
                            placeholder="Referencia"
                            value={payment.referencia}
                            onChange={(e) => handlePaymentChange(index, "referencia", e.target.value)}
                            style={styles.paymentInput}
                        />

                        <button
                            type="button"
                            onClick={() => deletePayment(index)}
                            style={styles.deletePaymentButton}
                        >
                            Eliminar
                        </button>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={addPayment}
                    style={styles.addPaymentButton}
                >
                    Agregar Medio de Pago
                </button>

                <div style={styles.paymentSummary}>
                    <div><strong>Total venta:</strong> S/ {getTotalVenta().toFixed(2)}</div>
                    <div><strong>Total pagado:</strong> S/ {getTotalPagado().toFixed(2)}</div>
                    <div style={Math.abs(getDiferenciaPago()) <= 0.01 ? styles.paymentDifferenceOk : styles.paymentDifferencePending}>
                        <strong>Diferencia:</strong> S/ {getDiferenciaPago().toFixed(2)}
                    </div>
                </div>
            </div>

            {/* Botón principal de compra */}
            <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                style={{
                    ...styles.generateButton,
                    opacity: isGenerating ? 0.6 : 1,
                    cursor: isGenerating ? "not-allowed" : "pointer"
                }}
            >
                {isGenerating ? "Generando venta..." : "Completar Compra"}
            </button>

            {/* Modal de cancelación */}
            {showCancelModal && (
                <CancelSaleModal
                    onClose={() => setShowCancelModal(false)}
                    onSuccess={() => setShowCancelModal(false)}
                />
            )}

            {/* Modal de AddItem */}
            {showAddItemModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <AddItem
                            onAddItem={handleAddItemFromModal}
                            onCancel={() => setShowAddItemModal(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {

    buttonGroup: {
       paddingTop: 5,
        paddingBottom: 5,
    },

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

    titulo: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between", // Asegura que los elementos se separen
        padding: "10px 20px",
        backgroundColor: "#f2f2f2",
        borderRadius: "8px",
        marginBottom: "20px",
    },

    totalContainer: {
        marginTop: "15px",
        padding: "10px",
        backgroundColor: "#f8f9fa",
        borderRadius: "5px",
        textAlign: "right",
        fontSize: "25px",
        borderTop: "2px solid #dee2e6",
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
        fontSize: "28px",
        margin: 0,
        color: "#333",
        flexGrow: 1,
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
    successMessage: {
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '15px 30px',
        borderRadius: '5px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        zIndex: 1000,
        animation: 'slideIn 0.5s ease-out'
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
    cancelButton: {
        backgroundColor: "#dc3545",
        border: "none",
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        marginLeft: "20px",
        outline: "none",
        fontSize: "26px",
    },
    modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },
    modalContent: {
        backgroundColor: "white",
        padding: "25px",
        borderRadius: "12px",
        width: "90%",
        maxWidth: "600px",
        maxHeight: "90vh",
        overflowY: "auto",
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.2)",
    },
    addItemButton: {
        margin: "10px auto", // Centra el botón horizontalmente
        padding: "12px 24px",
        backgroundColor: "#FFC107",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "16px",
        transition: "all 0.3s ease",
        display: "block",  // Asegura que el margin auto funcione correctamente
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
    },

    paymentRow: {
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1fr) minmax(0, 1fr) max-content",
        gap: "10px",
        alignItems: "center",
        marginBottom: "10px",
        width: "100%",
        boxSizing: "border-box",
    },
    paymentSelect: {
        padding: "8px",
        border: "1px solid #ced4da",
        borderRadius: "4px",
        backgroundColor: "#ffffff",
        color: "#212529",
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
    },
    paymentInput: {
        padding: "8px",
        border: "1px solid #ced4da",
        borderRadius: "4px",
        backgroundColor: "#ffffff",
        color: "#212529",
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
    },
    addPaymentButton: {
        margin: "10px auto",
        padding: "10px 18px",
        backgroundColor: "#198754",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
        display: "block",
    },
    deletePaymentButton: {
        backgroundColor: "#dc3545",
        color: "white",
        border: "none",
        padding: "8px 10px",
        cursor: "pointer",
        borderRadius: "5px",
        fontWeight: "bold",
        whiteSpace: "nowrap",
        maxWidth: "100%",
        boxSizing: "border-box",
    },
    paymentSummary: {
        marginTop: "15px",
        padding: "10px",
        backgroundColor: "#f8f9fa",
        borderRadius: "5px",
        fontSize: "18px",
        borderTop: "2px solid #dee2e6",
        display: "flex",
        flexDirection: "column",
        gap: "5px",
    },
    paymentDifferenceOk: {
        color: "#198754",
    },
    paymentDifferencePending: {
        color: "#dc3545",
    },

    itemContainer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        padding: "8px 0",
    },
    itemText: {
        flex: 1,
        marginRight: "15px",
        fontSize: "17px",
    },

};


export default GenerateXMLStructureForm;
