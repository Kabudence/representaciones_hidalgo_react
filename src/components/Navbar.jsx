import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa"; // Ícono de usuario

const Navbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem("authData"); // Eliminar authData del sessionStorage
        navigate("/"); // Redirigir a la página de inicio
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const styles = {
        navbar: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 20px",
            backgroundColor: "#fff",
            color: "black",
            paddingRight: "50px",
            position: "relative",
        },
        logo: {
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "24px",
            fontWeight: "bold",
            letterSpacing: "2px",
            color: "black",
        },
        links: {
            listStyle: "none",
            display: "flex",
            gap: "20px",
            margin: 0,
            padding: 0,
        },
        linkItem: {
            textDecoration: "none",
            color: "black",
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "18px",
            transition: "color 0.3s ease",
        },
        userIcon: {
            fontSize: "20px",
            cursor: "pointer",
            color: "black",
            transition: "color 0.3s ease",
            position: "relative",
        },
        dropdown: {
            position: "absolute",
            top: "100%",
            right: 0,
            backgroundColor: "white",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            borderRadius: "5px",
            width: "150px",
            padding: "10px",
            zIndex: 10,
            textAlign: "center",
            opacity: dropdownOpen ? 1 : 0,
            transform: dropdownOpen ? "translateY(0)" : "translateY(-10px)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
            visibility: dropdownOpen ? "visible" : "hidden",
        },
        dropdownItem: {
            fontSize: "16px",
            fontFamily: "'Bebas Neue', sans-serif",
            color: "black",
            padding: "8px 0",
            cursor: "pointer",
            transition: "background 0.3s ease",
        },
        dropdownItemHover: {
            backgroundColor: "#f0a500",
            color: "white",
        },
    };

    return (
        <>
            <nav style={styles.navbar}>
                <div style={styles.logo}>HIDALGO</div>
                <ul style={styles.links}>
                    <li><a href="/" style={styles.linkItem}>Home</a></li>
                    <li><a href="/clientes" style={styles.linkItem}>Clientes</a></li>
                    <li><a href="/proveedores" style={styles.linkItem}>Proveedores</a></li>
                    <li><a href="/ventas" style={styles.linkItem}>Ventas</a></li>
                    <li><a href="/compras" style={styles.linkItem}>Compras</a></li>
                    <li><a href="/productos" style={styles.linkItem}>Productos</a></li>
                    <li><a href="/empleados" style={styles.linkItem}>Empleados</a></li>
                    <li><a href="/lineas" style={styles.linkItem}>Lineas</a></li>
                    <li><a href="/clases" style={styles.linkItem}>Clases</a></li>
                </ul>

                {/* Ícono de usuario con Dropdown */}
                <div style={styles.userIcon} onClick={toggleDropdown}>
                    <FaUser />
                    <div style={styles.dropdown}>
                        <div
                            style={styles.dropdownItem}
                            onClick={handleLogout}
                            onMouseEnter={(e) => e.target.style.backgroundColor = "#f0a500"}
                            onMouseLeave={(e) => e.target.style.backgroundColor = "white"}
                        >
                            Cerrar sesión
                        </div>
                    </div>
                </div>
            </nav>
            <div className="navbar-separator"></div> {/* Línea de separación */}
        </>
    );
};

export default Navbar;
