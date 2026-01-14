import React, { useState, useContext } from "react";
import { AuthContext } from "./AuthContext.jsx";

const AuthBox = () => {
    const { login } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const url = "https://salesmanagerproject-production.up.railway.app/api/auth/login";

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                login({
                    token: data.access_token,
                    role: data.role,
                    username: data.username,
                });

                sessionStorage.setItem(
                    "authData",
                    JSON.stringify({
                        token: data.access_token,
                        role: data.role,
                        username: data.username,
                    })
                );

                alert("Inicio de sesión exitoso");
                window.location.reload();
            } else {
                alert(data.msg || "Ocurrió un error");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error de conexión");
        }
    };

    return (
        <div style={styles.authBox}>
            <h2>Inicie Sesión</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Nombre de usuario"
                    value={formData.username}
                    onChange={handleInputChange}
                    style={styles.input}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    value={formData.password}
                    onChange={handleInputChange}
                    style={styles.input}
                    required
                />
                <button type="submit" style={styles.button}>
                    Iniciar Sesión
                </button>
            </form>
        </div>
    );
};

const styles = {
    authBox: {
        backgroundColor: "#fff",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        maxWidth: "400px",
        width: "100%",
        textAlign: "center",
        boxSizing: "border-box",
    },
    input: {
        width: "100%",
        padding: "12px",
        marginBottom: "15px",
        border: "1px solid #ccc",
        borderRadius: "6px",
        fontSize: "14px",
        boxSizing: "border-box",
    },
    button: {
        width: "100%",
        padding: "12px",
        backgroundColor: "#524b4a",
        color: "white",
        border: "none",
        borderRadius: "6px",
        fontWeight: "bold",
        fontSize: "15px",
        cursor: "pointer",
        marginTop: "10px",
    },
    toggleText: {
        marginTop: "20px",
        fontSize: "14px",
    },
    toggleLink: {
        color: "#524b4a",
        cursor: "pointer",
        textDecoration: "underline",
        marginLeft: "4px",
    }
};


export default AuthBox;
