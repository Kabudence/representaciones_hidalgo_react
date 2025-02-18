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


    const login = (data) => {
        sessionStorage.setItem("authData", JSON.stringify(data));
        setAuthData(data); // Esto actualiza el contexto global
    };

    const logout = () => {
        sessionStorage.removeItem("authData"); // Limpiar sessionStorage
        setAuthData({ token: null, role: null, username: null });
    };

    const loadAuthData = () => {
        const savedData = sessionStorage.getItem("authData");
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                setAuthData(parsedData);
            } catch (error) {
                console.error("[AuthProvider] Error al parsear authData desde sessionStorage:", error);
            }
        } else {
        }
        setIsAuthDataLoaded(true);
    };

    useEffect(() => {
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