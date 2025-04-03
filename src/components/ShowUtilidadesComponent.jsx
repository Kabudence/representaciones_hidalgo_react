// src/components/ShowUtilidadesComponent.jsx
import React, { useState } from "react";
import utilidadesService from "../services/utilidadesService";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";

const ShowUtilidadesComponent = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Mapeo de etiquetas a los códigos que espera el backend
    const empresaMapping = {
        "KATHERINE": "01",
        "SAC 01": "02",
        "SAC 02": "03",
        "RAFAEL": "04",
        "SAC 03": "05",
        "NOTAS DE VENTA": "06",
    };

    const generatePDF = (data, title = "Listado de Utilidades") => {

        const doc = new jsPDF("landscape");
        const now = new Date();

        // Cabecera del PDF
        doc.setFontSize(12);
        doc.text("Representaciones Hidalgo", 10, 10);
        doc.text("Av. América Norte", 10, 16);
        doc.text(`Fecha: ${now.toLocaleDateString("es-PE")}`, 250, 10);
        doc.text(`Hora: ${now.toLocaleTimeString("es-PE")}`, 250, 15);
        doc.setFontSize(14);
        doc.text(title, 148, 30, { align: "center" });

        // Definir las columnas (sin la columna "Empresa")
        const tableColumn = [
            "Fecha",
            "N° Doc",
            "Vendedor",
            "DNI Vendedor",
            "Producto",
            "Precio Costo",
            "Precio Venta",
            "Utilidades"
        ];

        const utilidadesArray = Array.isArray(data)
            ? data
            : (data.utilidades || []);

        // Generar las filas de la tabla
        const tableRows = utilidadesArray.map((util) => [
            moment(util.fecha).format("YYYY-MM-DD"),
            util.num_docum,
            util.nombre_vendedor,
            util.dni_vendedor,
            util.nomproducto,
            parseFloat(util.precio_costo).toFixed(2),
            parseFloat(util.precio_venta).toFixed(2),
            parseFloat(util.utilidades).toFixed(2)
        ]);

        // Calcular totales para "Precio Venta" y "Utilidades"
        const sumPrecioVenta = utilidadesArray.reduce(
            (acc, util) => acc + parseFloat(util.precio_venta),
            0
        );
        const sumUtilidades = utilidadesArray.reduce(
            (acc, util) => acc + parseFloat(util.utilidades),
            0
        );

        // Agregar una fila final con los totales
        tableRows.push([
            "",
            "",
            "",
            "",
            "Totales:",
            "",
            sumPrecioVenta.toFixed(2),
            sumUtilidades.toFixed(2)
        ]);


        // Crear la tabla en el PDF
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

        doc.save("listado_utilidades.pdf");
    };

    const handleGetUtilidades = async () => {
        if (!startDate || !endDate) {
            alert("Debe proporcionar fecha de inicio y fecha de fin");
            return;
        }
        try {
            const data = await utilidadesService.getUtilidades(startDate, endDate);
            generatePDF(data, "Listado de Utilidades Generales");
        } catch (error) {
            console.error("Error al obtener utilidades generales:", error);
            alert("Error al obtener utilidades generales");
        }
    };

    const handleGetUtilidadesPorEmpresa = async (label) => {
        if (!startDate || !endDate) {
            alert("Debe proporcionar fecha de inicio y fecha de fin");
            return;
        }
        // Obtener el código correspondiente de la etiqueta
        const empresa = empresaMapping[label];
        console.log(`ID EMPRESA:${empresa}`);
        if (!empresa) {
            alert("No se encontró el código para la empresa seleccionada");
            return;
        }

        try {
            const data = await utilidadesService.getUtilidadesPorEmpresa(
                startDate,
                endDate,
                empresa
            );
            generatePDF(data, `Utilidades - ${label}`);
        } catch (error) {
            console.error(`Error al obtener utilidades para ${label}:`, error);
            alert(`Error al obtener utilidades para ${label}`);
        }
    };

    // Array de etiquetas para los botones
    const empresaLabels = [
        "KATHERINE",
        "SAC 01",
        "SAC 02",
        "RAFAEL",
        "SAC 03",
        "NOTAS DE VENTA"
    ];

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Generar Utilidades</h2>
            <div style={styles.inputGroup}>
                <label style={styles.label}>Fecha de inicio:</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={styles.input}
                />
            </div>
            <div style={styles.inputGroup}>
                <label style={styles.label}>Fecha de fin:</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={styles.input}
                />
            </div>
            <div style={styles.buttonGroup}>
                <button onClick={handleGetUtilidades} style={styles.button}>
                    Generar PDF Utilidades Generales
                </button>
            </div>
            <div style={styles.empresaButtons}>
                {empresaLabels.map((label) => (
                    <button
                        key={label}
                        onClick={() => handleGetUtilidadesPorEmpresa(label)}
                        style={styles.empresaButton}
                    >
                        Utilidades Empresa {label}
                    </button>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: "#f2f2f2",
        padding: "20px",
        margin: "20px auto",
        maxWidth: "600px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    },
    title: {
        textAlign: "center",
        fontFamily: "'PT Sans Narrow', sans-serif",
        fontSize: "32px",
        marginBottom: "20px",
    },
    inputGroup: {
        marginBottom: "15px",
    },
    label: {
        display: "block",
        marginBottom: "5px",
        fontWeight: "bold",
        fontFamily: "'PT Sans Narrow', sans-serif",
    },
    input: {
        width: "100%",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        fontSize: "14px",
    },
    buttonGroup: {
        textAlign: "center",
        marginBottom: "20px",
    },
    button: {
        padding: "10px 20px",
        backgroundColor: "#524b4a",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontWeight: "bold",
    },
    empresaButtons: {
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        justifyContent: "center",
    },
    // AQUÍ LA ÚNICA MODIFICACIÓN: un ancho fijo para todos los botones
    empresaButton: {
        padding: "10px 20px",
        backgroundColor: "#665757",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontWeight: "bold",
        width: "200px",       // <- Nuevo ancho fijo
        textAlign: "center",
    },
};

export default ShowUtilidadesComponent;
