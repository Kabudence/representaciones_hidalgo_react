import React from "react";
import backgroundHome from "../../assets/images/background_home.jpg";
import AuthBox from "../../components/auth-components/AuthBox.jsx";

const Home = () => {
    return (
        <div style={styles.container}>
            {/* Sección del texto a la izquierda */}
            <div style={styles.textContainer}>
                <h2 style={styles.subHeading}>HIDALGO BUSINESS</h2>
                <h1 style={styles.heading}>Una solución eficaz para su empresa</h1>
            </div>
            {/* Sección del AuthBox a la derecha */}
            <div style={styles.authContainer}>
                <AuthBox />
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        flexDirection: "row", // Horizontal en pantallas grandes
        alignItems: "center",
        justifyContent: "space-between", // Separar texto y AuthBox
        padding: "0 5%", // Margen lateral
        height: "100vh",
        backgroundImage: `url(${backgroundHome})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        fontFamily: "'PT Sans Narrow', sans-serif", // Fuente global
    },
    textContainer: {
        flex: 1, // El texto ocupa el 50% del ancho
        color: "white",
        maxWidth: "50%", // Limitar ancho del texto
    },
    authContainer: {
        flex: 1, // El AuthBox ocupa el 50% del ancho
        display: "flex",
        justifyContent: "flex-end", // Alinear a la derecha
        maxWidth: "40%", // Limitar ancho del AuthBox
    },
    heading: {
        fontSize: "4rem", // Tamaño grande para pantallas grandes
        fontWeight: "bold",
        margin: 0,
    },
    subHeading: {
        fontSize: "1.5rem",
        fontWeight: "300",
        marginBottom: "20px",
        textTransform: "uppercase",
    },
    "@media (max-width: 768px)": {
        container: {
            flexDirection: "column", // Diseño vertical en pantallas pequeñas
        },
        textContainer: {
            textAlign: "center", // Centrar el texto en pantallas pequeñas
            maxWidth: "100%",
            marginBottom: "20px", // Separación entre texto y AuthBox
        },
        authContainer: {
            justifyContent: "center", // Centrar el AuthBox en pantallas pequeñas
            maxWidth: "100%",
        },
    },
};

export default Home;
