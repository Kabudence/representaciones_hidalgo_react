// AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authData, setAuthData] = useState({
        token: null,
        role: null,
        username: null,
    });
    const [isAuthDataLoaded, setIsAuthDataLoaded] = useState(false);

    // Log para depurar el estado inicial
    console.log("[AuthProvider] Estado inicial de authData:", authData);

    const login = (data) => {
        console.log("[AuthProvider] Iniciando sesión con:", data);
        sessionStorage.setItem("authData", JSON.stringify(data));
        setAuthData(data); // Esto actualiza el contexto global
        console.log("[AuthProvider] authData después de iniciar sesión:", data);
    };

    const logout = () => {
        console.log("[AuthProvider] Cerrando sesión...");
        sessionStorage.removeItem("authData"); // Limpiar sessionStorage
        setAuthData({ token: null, role: null, username: null });
        console.log("[AuthProvider] authData después de logout:", authData);
    };

    const loadAuthData = () => {
        console.log("[AuthProvider] Intentando cargar authData desde sessionStorage...");
        const savedData = sessionStorage.getItem("authData");
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                setAuthData(parsedData);
                console.log("[AuthProvider] authData cargado correctamente desde sessionStorage:", parsedData);
            } catch (error) {
                console.error("[AuthProvider] Error al parsear authData desde sessionStorage:", error);
            }
        } else {
            console.log("[AuthProvider] No se encontró authData en sessionStorage.");
        }
        setIsAuthDataLoaded(true);
    };

    useEffect(() => {
        console.log("[AuthProvider] useEffect ejecutado, cargando datos de sesión...");
        loadAuthData();
    }, []);

    return (
        <AuthContext.Provider value={{ authData, isAuthDataLoaded, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};