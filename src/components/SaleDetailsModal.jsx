// src/components/SaleDetailsModal.jsx
import React, { useState, useEffect } from "react";
import dailySalesService from "../services/dailySalesService";
import PropTypes from "prop-types";
import moment from "moment-timezone";

// Para decodificar la foto en Base64
function base64ToBlob(base64Data) {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    return new Blob([new Uint8Array(byteNumbers)], { type: "image/png" });
}

const SaleDetailsModal = ({ idcab, onClose }) => {
    const [currentPhoto, setCurrentPhoto] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0); // offset
    const [hasNext, setHasNext] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const paginationLimit = 2; // Pedimos 2 fotos para saber si hay siguiente

    useEffect(() => {
        loadPhoto();
        // eslint-disable-next-line
    }, [currentIndex]);

    const loadPhoto = async () => {
        setIsLoading(true);
        try {
            // Pedimos 2 fotos (limit=2). Si llegan 2, hay "hasNext".
            const photos = await dailySalesService.getPhotosByIdCab(
                idcab,
                currentIndex,
                paginationLimit
            );
            if (photos.length > 0) {
                setCurrentPhoto(photos[0]); // Mostramos la primera
                setHasNext(photos.length > 1); // Si hay 2, existe "siguiente"
            } else {
                setCurrentPhoto(null);
                setHasNext(false);
            }
        } catch (error) {
            console.error("Error al cargar la foto:", error);
        }
        setIsLoading(false);
    };

    const handleNext = () => {
        if (hasNext) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            // Al retroceder, asumimos que puede haber "siguiente"
            setHasNext(true);
        }
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <button onClick={onClose} style={styles.closeButton}>X</button>

                {isLoading ? (
                    <p>Cargando foto...</p>
                ) : currentPhoto ? (
                    <div style={styles.content}>
                        <h2>{currentPhoto.nombre_producto || "Producto sin nombre"}</h2>

                        {/* Decodificamos la foto base64 */}
                        <div style={styles.imageContainer}>
                            <img
                                src={URL.createObjectURL(base64ToBlob(currentPhoto.foto_codigo))}
                                alt="Foto Producto"
                                style={{ maxWidth: "100%", maxHeight: "300px" }}
                            />
                        </div>

                        <p>Precio vendido: {currentPhoto.precio_vendido}</p>
                        <p>Cantidad: {currentPhoto.cantidad}</p>
                        <p>Fecha: {moment.utc(currentPhoto.fecha).add(5, "hours")}</p>

                        {/* Botones anterior / siguiente */}
                        <div style={styles.navButtons}>
                            <button
                                onClick={handlePrevious}
                                disabled={currentIndex <= 0}
                                style={styles.button}
                            >
                                Anterior
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={!hasNext}
                                style={styles.button}
                            >
                                Siguiente
                            </button>
                        </div>

                        <p style={styles.counter}>Foto {currentIndex + 1}</p>
                    </div>
                ) : (
                    <p>No hay fotos disponibles.</p>
                )}
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
    },
    modal: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 20,
        width: "500px",
        maxHeight: "80vh",
        overflowY: "auto",
        position: "relative",
    },
    closeButton: {
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: "transparent",
        border: "none",
        fontSize: 18,
        cursor: "pointer",
    },
    content: {
        textAlign: "center",
    },
    imageContainer: {
        margin: "16px 0",
    },
    navButtons: {
        display: "flex",
        justifyContent: "space-evenly",
        marginTop: 16,
    },
    button: {
        padding: "8px 16px",
        backgroundColor: "#524b4a",
        color: "white",
        border: "none",
        borderRadius: 5,
        cursor: "pointer",
    },
    counter: {
        marginTop: 8,
    },
};
SaleDetailsModal.propTypes = {
    idcab: PropTypes.number.isRequired,  // idcab debe ser un número
    onClose: PropTypes.func.isRequired,  // onClose debe ser una función
};

export default SaleDetailsModal;
