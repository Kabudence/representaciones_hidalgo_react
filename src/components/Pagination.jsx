import PropTypes from 'prop-types';

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
    const maxVisibleButtons = 5;

    const getPageNumbers = () => {
        const pageNumbers = [];
        const startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
        const endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return pageNumbers;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div style={styles.pagination}>
            <button
                style={styles.pageButton}
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                Anterior
            </button>
            {pageNumbers[0] > 1 && <span style={styles.ellipsis}>...</span>}
            {pageNumbers.map((page) => (
                <button
                    key={page}
                    style={{
                        ...styles.pageButton,
                        ...(currentPage === page ? styles.activePageButton : {}),
                    }}
                    onClick={() => onPageChange(page)}
                >
                    {page}
                </button>
            ))}
            {pageNumbers[pageNumbers.length - 1] < totalPages && (
                <span style={styles.ellipsis}>...</span>
            )}
            <button
                style={styles.pageButton}
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                Siguiente
            </button>
        </div>
    );
};

const styles = {
    pagination: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "20px",
    },
    pageButton: {
        margin: "0 5px",
        padding: "8px 16px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        cursor: "pointer",
        backgroundColor: "#fff",
    },
    activePageButton: {
        backgroundColor: "#524b4a",
        color: "white",
        fontWeight: "bold",
    },
    ellipsis: {
        margin: "0 10px",
        color: "#888",
    },
};

Pagination.propTypes = {
    totalPages: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
