import React, { useState, useEffect } from "react";
import backgroundHome from "../../assets/images/background_home.jpg";
import AuthBox from "../../components/auth-components/AuthBox.jsx";

const Home = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Función para chequear autenticación en sessionStorage
        const checkAuth = () => {
            const authData = localStorage.getItem("authData");
            setIsAuthenticated(!!authData); // Convierte a booleano
        };

        checkAuth(); // Verificar al cargar la página

        // Agregar event listener para detectar cambios en sessionStorage
        const handleStorageChange = (event) => {
            if (event.key === "authData") {
                checkAuth(); // Actualizar estado en tiempo real
            }
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    return (
        <div style={styles.container}>
            <div style={styles.textContainer}>
                <h2 style={styles.subHeading}>HIDALGO BUSINESS</h2>
                <h1 style={styles.heading}>Una solución eficaz para su empresa</h1>
            </div>
            {!isAuthenticated && (
                <div style={styles.authContainer}>
                    <AuthBox />
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 5%",
        height: "100vh",
        backgroundImage: `url(${backgroundHome})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        fontFamily: "'PT Sans Narrow', sans-serif",
    },
    textContainer: {
        flex: 1,
        color: "white",
        maxWidth: "50%",
    },
    authContainer: {
        flex: 1,
        display: "flex",
        justifyContent: "flex-end",
        maxWidth: "40%",
    },
    heading: {
        fontSize: "4rem",
        fontWeight: "bold",
        margin: 0,
    },
    subHeading: {
        fontSize: "1.5rem",
        fontWeight: "300",
        marginBottom: "20px",
        textTransform: "uppercase",
    }
};

export default Home;
