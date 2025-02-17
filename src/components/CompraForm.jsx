// src/components/CompraForm.jsx
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import AddItem from "./AddItem.jsx";

const CompraForm = ({ compra, setCompra, onSubmit, onCancel }) => {
    const [showAddItemModal, setShowAddItemModal] = useState(false);

    // Asegurarse de que ItemList comience como arreglo vacío si no existe
    useEffect(() => {
        if (!compra.ItemList) {
            setCompra({ ...compra, ItemList: [] });
        }
    }, [compra, setCompra]);

    // Manejo de cambios para los campos de la cabecera de la compra
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCompra({ ...compra, [name]: value });
    };

    // Manejo de cambios para los datos del proveedor
    const handleProveedorChange = (e) => {
        const { name, value } = e.target;
        setCompra({
            ...compra,
            proveedor: { ...compra.proveedor, [name]: value },
        });
    };

    // Función para agregar un ítem (recibido desde AddItem)
    const handleAddItem = (item) => {
        if (item.producto && item.producto.trim() !== "") {
            setCompra({
                ...compra,
                ItemList: [...(compra.ItemList || []), item],
            });
        }
        setShowAddItemModal(false);
    };

    // Función para eliminar un ítem del ItemList
    const handleRemoveItem = (index) => {
        const newItemList = compra.ItemList.filter((_, i) => i !== index);
        setCompra({ ...compra, ItemList: newItemList });
    };

    // Función para filtrar ítems vacíos y transformar el objeto antes de enviar
    const handleSubmitForm = (e) => {
        e.preventDefault();
        // Filtrar los ítems cuyo campo "producto" esté vacío y transformar cada uno
        const filteredItemList = (compra.ItemList || [])
            .filter((item) => item.producto && item.producto.trim() !== "")
            .map((item) => ({
                producto: item.productId || item.producto,
                cantidad: item.cantidad,
                precio: item.precio,
                igv: item.igv,
            }));
        let compraToSend = { ...compra, ItemList: filteredItemList };

        // Para los campos opcionales del proveedor, si quedan vacíos se asigna "a"
        if (!compraToSend.proveedor) {
            compraToSend.proveedor = {};
        }
        compraToSend.proveedor.nomproveedor =
            compraToSend.proveedor.nomproveedor && compraToSend.proveedor.nomproveedor.trim() !== ""
                ? compraToSend.proveedor.nomproveedor
                : "a";
        compraToSend.proveedor.direccion =
            compraToSend.proveedor.direccion && compraToSend.proveedor.direccion.trim() !== ""
                ? compraToSend.proveedor.direccion
                : "a";
        compraToSend.proveedor.contacto =
            compraToSend.proveedor.contacto && compraToSend.proveedor.contacto.trim() !== ""
                ? compraToSend.proveedor.contacto
                : "a";

        console.log("Enviando datos para crear compra:", compraToSend);
        onSubmit(compraToSend);
    };

    return (
        <form onSubmit={handleSubmitForm} style={styles.form}>
            <h2>Datos de la Compra</h2>
            <div style={styles.formGroup}>
                <label style={styles.label}>Número de Documento:</label>
                <input
                    type="text"
                    name="num_docum"
                    value={compra.num_docum}
                    onChange={handleChange}
                    style={styles.input}
                    required
                />
            </div>

            <div style={styles.formGroup}>
                <label style={styles.label}>RUC Cliente:</label>
                <input
                    type="text"
                    name="ruc_cliente"
                    value={compra.ruc_cliente}
                    onChange={handleChange}
                    style={styles.input}
                    required
                />
            </div>

            <h3>Datos del Proveedor</h3>
            <div style={styles.formGroup}>
                <label style={styles.label}>RUC:</label>
                <input
                    type="text"
                    name="ruc"
                    value={compra.proveedor?.ruc || ""}
                    onChange={handleProveedorChange}
                    style={styles.input}
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Nombre Proveedor:</label>
                <input
                    type="text"
                    name="nomproveedor"
                    value={compra.proveedor?.nomproveedor || ""}
                    onChange={handleProveedorChange}
                    style={styles.input}
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Dirección:</label>
                <input
                    type="text"
                    name="direccion"
                    value={compra.proveedor?.direccion || ""}
                    onChange={handleProveedorChange}
                    style={styles.input}
                />
            </div>
            <div style={styles.formGroup}>
                <label style={styles.label}>Contacto:</label>
                <input
                    type="text"
                    name="contacto"
                    value={compra.proveedor?.contacto || ""}
                    onChange={handleProveedorChange}
                    style={styles.input}
                />
            </div>

            <h3>Ítems de la Compra</h3>
            <div style={styles.buttonGroup}>
                <button
                    type="button"
                    onClick={() => setShowAddItemModal(true)}
                    style={styles.addButton}
                >
                    Agregar Ítem
                </button>
            </div>

            {/* Muestra la lista de ítems agregados */}
            {compra.ItemList && compra.ItemList.length > 0 && (
                <div style={styles.itemList}>
                    <ul style={styles.ul}>
                        {compra.ItemList.map((item, index) => (
                            <li key={index} style={styles.li}>
                <span>
                  <strong>Producto:</strong> {item.producto} -{" "}
                    <strong>Cantidad:</strong> {item.cantidad} -{" "}
                    <strong>Precio:</strong> {item.precio} -{" "}
                    <strong>IGV:</strong> {item.igv}
                </span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveItem(index)}
                                    style={styles.removeButton}
                                >
                                    Eliminar
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div style={styles.buttonGroup}>
                <button type="submit" style={styles.saveButton}>
                    Guardar
                </button>
                <button type="button" onClick={onCancel} style={styles.cancelButton}>
                    Cancelar
                </button>
            </div>

            {showAddItemModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <AddItem
                            onAddItem={handleAddItem}
                            onCancel={() => setShowAddItemModal(false)}
                        />
                    </div>
                </div>
            )}
        </form>
    );
};

CompraForm.propTypes = {
    compra: PropTypes.shape({
        num_docum: PropTypes.string.isRequired,
        ruc_cliente: PropTypes.string.isRequired,
        ItemList: PropTypes.arrayOf(
            PropTypes.shape({
                producto: PropTypes.string.isRequired,
                cantidad: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
                    .isRequired,
                precio: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
                    .isRequired,
                igv: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
                    .isRequired,
            })
        ),
        proveedor: PropTypes.shape({
            ruc: PropTypes.string,
            nomproveedor: PropTypes.string,
            direccion: PropTypes.string,
            contacto: PropTypes.string,
        }),
    }).isRequired,
    setCompra: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

const styles = {
    form: { display: "flex", flexDirection: "column", gap: "15px" },
    formGroup: {
        display: "flex",
        flexDirection: "column",
        marginBottom: "10px",
    },
    label: {
        marginBottom: "5px",
        fontWeight: "bold",
        fontFamily: "'PT Sans Narrow', sans-serif",
    },
    input: {
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        fontSize: "14px",
    },
    buttonGroup: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: "20px",
    },
    saveButton: {
        padding: "10px 20px",
        backgroundColor: "#524b4a",
        color: "white",
        borderRadius: "5px",
        border: "none",
        cursor: "pointer",
    },
    cancelButton: {
        padding: "10px 20px",
        backgroundColor: "#dc3545",
        color: "white",
        borderRadius: "5px",
        border: "none",
        cursor: "pointer",
    },
    addButton: {
        padding: "10px 20px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        alignSelf: "flex-start",
    },
    itemList: { marginTop: "10px" },
    ul: {
        listStyleType: "none",
        padding: 0,
        margin: 0,
    },
    li: {
        padding: "5px 0",
        borderBottom: "1px solid #ccc",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    removeButton: {
        padding: "5px 10px",
        backgroundColor: "#dc3545",
        color: "white",
        border: "none",
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

export default CompraForm;
