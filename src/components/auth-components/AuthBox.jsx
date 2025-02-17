import React, { useState, useContext } from "react";
import { AuthContext } from "./AuthContext.jsx";

const AuthBox = () => {
    const { login } = useContext(AuthContext);
    const [isRegister, setIsRegister] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        role: "employee",
    });

    const toggleAuthMode = () => {
        setIsRegister(!isRegister);
        setFormData({ username: "", password: "", role: "employee" });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isRegister
            ? "https://web-production-927a.up.railway.app/api/auth/register"
            : "https://web-production-927a.up.railway.app/api/auth/login";

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                if (isRegister) {
                    alert("Cuenta creada exitosamente. ¡Por favor, inicie sesión!");
                    toggleAuthMode();
                } else {
                    login({
                        token: data.access_token,
                        role: data.role,
                        username: data.username,
                    });

                    sessionStorage.setItem("authData", JSON.stringify({
                        token: data.access_token,
                        role: data.role,
                        username: data.username,
                    }));

                    alert("Inicio de sesión exitoso");

                    // 🔥 Recargar la página para actualizar la UI
                    window.location.reload();
                }
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
            <h2>{isRegister ? "Crear Cuenta" : "Inicie Sesión"}</h2>
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
                {isRegister && (
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        style={styles.input}
                        required
                    >
                        <option value="employee">Empleado</option>
                        <option value="admin">Administrador</option>
                    </select>
                )}
                <button type="submit" style={styles.button}>
                    {isRegister ? "Registrar" : "Iniciar Sesión"}
                </button>
            </form>
            <p style={styles.toggleText}>
                {isRegister
                    ? "¿Ya tiene una cuenta? "
                    : "¿No tiene una cuenta? "}
                <span onClick={toggleAuthMode} style={styles.toggleLink}>
                    {isRegister ? "Inicie Sesión" : "Crear Cuenta"}
                </span>
            </p>
        </div>
    );
};

const styles = {
    authBox: {
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        maxWidth: "400px",
        width: "100%",
        textAlign: "center",
    },
    input: {
        width: "100%",
        padding: "10px",
        margin: "10px 0",
        border: "1px solid #ccc",
        borderRadius: "5px",
    },
    button: {
        width: "100%",
        padding: "10px",
        backgroundColor: "#524b4a",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
    toggleText: {
        marginTop: "10px",
        fontSize: "14px",
    },
    toggleLink: {
        color: "#524b4a",
        cursor: "pointer",
        textDecoration: "underline",
    },
};

export default AuthBox;
