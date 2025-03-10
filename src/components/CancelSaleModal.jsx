import { useState } from "react";
import PropTypes from "prop-types";
import SalesNoteService from "../services/salesNoteService.js";

const CancelSaleModal = ({ onClose, onSuccess }) => {
    const [digits, setDigits] = useState("");
    const [searchResult, setSearchResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSearch = async () => {
        if (digits.length !== 5) {
            setError("Debe ingresar exactamente 5 dígitos");
            return;
        }

        try {
            setLoading(true);
            const result = await SalesNoteService.searchNumDocum(digits);

            setSearchResult(result);
            setError("");
        } catch (err) {
            console.error(err);
            setError("No se encontró la nota de venta");
            setSearchResult(null);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelSale = async () => {
        try {
            await SalesNoteService.cancelSale(searchResult.num_docum);
            setSuccess(true);
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 2000);
        } catch (err) {
            console.error(err);
            setError("Error al cancelar la venta");
        }
    };

    return (
        <div style={modalStyles.overlay}>
            <div style={modalStyles.modal}>
                <h2 style={modalStyles.title}>ANULAR NOTA DE VENTA</h2>

                {!success && (
                    <>
                        <label style={modalStyles.label}>
                            Digite los últimos 5 dígitos:
                            <input
                                type="text"
                                value={digits}
                                onChange={(e) => setDigits(e.target.value.replace(/\D/g, '').slice(0, 5))}
                                style={modalStyles.input}
                            />
                        </label>

                        {error && <div style={modalStyles.error}>{error}</div>}

                        {!searchResult ? (
                            <button
                                onClick={handleSearch}
                                style={modalStyles.button}
                                disabled={loading}
                            >
                                {loading ? "Buscando..." : "Buscar Nota"}
                            </button>
                        ) : (
                            <>
                                <div style={modalStyles.result}>
                                    Número de documento encontrado: {searchResult.num_docum}

                                </div>
                                <button
                                    onClick={handleCancelSale}
                                    style={modalStyles.confirmButton}
                                >
                                    CONFIRMAR CANCELACIÓN
                                </button>
                            </>
                        )}
                    </>
                )}

                {success && (
                    <div style={modalStyles.success}>
                        ¡Anulacìon exitosa!
                    </div>
                )}

                <button
                    onClick={onClose}
                    style={modalStyles.closeButton}
                >
                    Cerrar
                </button>
            </div>
        </div>
    );
};

const modalStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modal: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        width: '400px',
        position: 'relative',
    },
    title: {
        textAlign: 'center',
        marginBottom: '20px',
        color: '#333',
    },
    label: {
        display: 'block',
        marginBottom: '15px',
    },
    input: {
        width: '100%',
        padding: '8px',
        marginTop: '5px',
        border: '1px solid #ced4da',
        borderRadius: '4px',
    },
    button: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#524b4a',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginBottom: '10px',
    },
    confirmButton: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginBottom: '10px',
    },
    closeButton: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    error: {
        color: '#dc3545',
        margin: '10px 0',
        textAlign: 'center',
    },
    success: {
        color: '#28a745',
        margin: '20px 0',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    result: {
        backgroundColor: '#f8f9fa',
        padding: '10px',
        borderRadius: '4px',
        margin: '15px 0',
        textAlign: 'center',
    }
};

CancelSaleModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
};

export default CancelSaleModal;
