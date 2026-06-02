import React, { useState, useEffect } from "react";
import backgroundHome from "../../assets/images/background_home.jpg";
import AuthBox from "../../components/auth-components/AuthBox.jsx";

const Home = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Función para chequear autenticación en sessionStorage
        const checkAuth = () => {
            const authData = sessionStorage.getItem("authData");
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


    const responsiveCss = `
    @media (max-width: 860px) {
        .home-container {
            flex-direction: column !important;
            justify-content: center !important;
            gap: 28px !important;
            padding: 28px 18px !important;
            height: auto !important;
            min-height: 100dvh !important;
            box-sizing: border-box !important;
            text-align: center !important;
        }

        .home-text-container {
            max-width: 100% !important;
            width: 100% !important;
        }

        .home-auth-container {
            max-width: 440px !important;
            width: 100% !important;
            justify-content: center !important;
        }

        .home-heading {
            font-size: 2.7rem !important;
            line-height: 1.05 !important;
        }
    }

    @media (max-width: 520px) {
        .home-container {
            padding: 22px 14px !important;
            gap: 22px !important;
            background-position: center !important;
        }

        .home-sub-heading {
            font-size: 1rem !important;
            margin-bottom: 12px !important;
        }

        .home-heading {
            font-size: 2.05rem !important;
        }
    }
`;

    return (
        <>
            <style>{responsiveCss}</style>
            <div className="home-container" style={styles.container}>
                <div className="home-text-container" style={styles.textContainer}>
                    <h2 className="home-sub-heading" style={styles.subHeading}>HIDALGO BUSINESS</h2>
                    <h1 className="home-heading" style={styles.heading}>Una solución eficaz para su empresa</h1>
                </div>
                {!isAuthenticated && (
                    <div className="home-auth-container" style={styles.authContainer}>
                        <AuthBox />
                    </div>
                )}
            </div>
        </>
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
