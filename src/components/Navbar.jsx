import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa"; // Ícono de usuario

const Navbar = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 820);
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem("authData"); // Eliminar authData del sessionStorage
        navigate("/"); // Redirigir a la página de inicio
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
        setMobileMenuOpen(false);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
        setDropdownOpen(false);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    const desktopLinks = [
        { href: "/", label: "Home" },
        { href: "/clientes", label: "Clientes" },
        { href: "/proveedores", label: "Proveedores" },
        { href: "/ventas", label: "Ventas" },
        { href: "/compras", label: "Compras" },
        { href: "/productos", label: "Productos" },
        { href: "/empleados", label: "Empleados" },
        { href: "/lineas", label: "Lineas" },
        { href: "/clases", label: "Clases" },
        { href: "/daily-sales", label: "Ventas diarias" },
        { href: "/analiticas", label: "Analíticas" },
        { href: "/nota-venta", label: "Nota de venta" },
        { href: "/boletas", label: "Boletas" },
    ];

    const mobileLinks = [
        { href: "/analiticas", label: "Analíticas" },
        { href: "/daily-sales", label: "Ventas diarias" },
        { href: "/nota-venta", label: "Nota de venta" },
        { href: "/productos", label: "Productos" },
        { href: "/", label: "Home" },
    ];

    const styles = {
        navbar: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: isMobile ? "10px 14px" : "10px 20px",
            backgroundColor: "#fff",
            color: "black",
            paddingRight: isMobile ? "14px" : "50px",
            position: "relative",
            gap: "12px",
            boxSizing: "border-box",
        },
        logo: {
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: isMobile ? "21px" : "24px",
            fontWeight: "bold",
            letterSpacing: "2px",
            color: "black",
            whiteSpace: "nowrap",
        },
        links: {
            listStyle: "none",
            display: isMobile ? "none" : "flex",
            gap: "20px",
            margin: 0,
            padding: 0,
            flexWrap: "wrap",
            justifyContent: "center",
        },
        linkItem: {
            textDecoration: "none",
            color: "black",
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "18px",
            transition: "color 0.3s ease",
        },
        mobileActions: {
            display: isMobile ? "flex" : "none",
            alignItems: "center",
            gap: "8px",
            marginLeft: "auto",
        },
        analyticsShortcut: {
            textDecoration: "none",
            color: "white",
            background: "#7f1d1d",
            borderRadius: "999px",
            padding: "8px 11px",
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "15px",
            letterSpacing: "0.6px",
            whiteSpace: "nowrap",
        },
        menuButton: {
            border: "1px solid #d6b98d",
            background: "#fff7e8",
            color: "#331b16",
            borderRadius: "999px",
            padding: "8px 10px",
            fontWeight: "900",
            cursor: "pointer",
            fontSize: "13px",
        },
        userIcon: {
            fontSize: "20px",
            cursor: "pointer",
            color: "black",
            transition: "color 0.3s ease",
            position: "relative",
            flex: "0 0 auto",
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
            zIndex: 20,
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
        mobileMenu: {
            display: isMobile && mobileMenuOpen ? "grid" : "none",
            gridTemplateColumns: "1fr",
            gap: "8px",
            position: "absolute",
            top: "100%",
            left: "10px",
            right: "10px",
            background: "#fffaf0",
            border: "1px solid #ead9bd",
            borderRadius: "16px",
            padding: "12px",
            zIndex: 15,
            boxShadow: "0 14px 28px rgba(73, 45, 18, 0.18)",
        },
        mobileMenuLink: {
            textDecoration: "none",
            color: "#331b16",
            background: "#fff7e8",
            border: "1px solid #ead9bd",
            borderRadius: "12px",
            padding: "12px",
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "17px",
            letterSpacing: "0.6px",
        },
        separator: {
            height: "1px",
            background: "#e7e7e7",
            width: "100%",
        },
    };

    return (
        <>
            <nav style={styles.navbar}>
                <div style={styles.logo}>HIDALGO 2.0</div>

                <ul style={styles.links}>
                    {desktopLinks.map((link) => (
                        <li key={link.href}><a href={link.href} style={styles.linkItem}>{link.label}</a></li>
                    ))}
                </ul>

                <div style={styles.mobileActions}>
                    <a href="/analiticas" style={styles.analyticsShortcut}>Analíticas</a>
                    <button type="button" style={styles.menuButton} onClick={toggleMobileMenu}>
                        {mobileMenuOpen ? "Cerrar" : "Menú"}
                    </button>
                </div>

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

                <div style={styles.mobileMenu}>
                    {mobileLinks.map((link) => (
                        <a key={link.href} href={link.href} style={styles.mobileMenuLink} onClick={closeMobileMenu}>
                            {link.label}
                        </a>
                    ))}
                    <button type="button" style={{ ...styles.mobileMenuLink, cursor: "pointer", textAlign: "left" }} onClick={handleLogout}>
                        Cerrar sesión
                    </button>
                </div>
            </nav>
            <div style={styles.separator}></div> {/* Línea de separación */}
        </>
    );
};

export default Navbar;
