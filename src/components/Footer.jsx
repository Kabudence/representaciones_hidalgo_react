const Footer = () => {
    const styles = {
        footer: {
            backgroundColor: "#333",
            color: "white",
            padding: "40px 20px",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
        },
        column: {
            flex: "1 1 200px",
            margin: "10px",
        },
        heading: {
            fontSize: "18px",
            marginBottom: "10px",
            fontWeight: "bold",
        },
        link: {
            color: "white",
            textDecoration: "none",
            display: "block",
            marginBottom: "5px",
            fontSize: "14px",
            transition: "color 0.3s",
        },
        linkHover: {
            color: "#f0a500",
        },
        subscribeSection: {
            flex: "1 1 300px",
            margin: "10px",
        },
        subscribeInput: {
            width: "70%",
            padding: "10px",
            border: "none",
            borderRadius: "5px",
            marginRight: "10px",
        },
        subscribeButton: {
            padding: "10px 20px",
            backgroundColor: "#524b4a",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
        },
        socialIcons: {
            display: "flex",
            gap: "10px",
            marginTop: "10px",
        },
        socialIcon: {
            color: "white",
            fontSize: "20px",
            cursor: "pointer",
        },
        footerBottom: {
            textAlign: "center",
            marginTop: "20px",
            borderTop: "1px solid #444",
            paddingTop: "10px",
            fontSize: "12px",
        },
    };

    return (
        <footer style={styles.footer}>
            <div style={styles.column}>
                <h4 style={styles.heading}>Servicios</h4>
                <a href="/bikes" style={styles.link}>Venta de Muebles </a>
                <a href="/maintenance" style={styles.link}>Venta de Comedores</a>
                <a href="/tours" style={styles.link}>Venta de Camas</a>
                <a href="/insurance" style={styles.link}>Mantenimiento</a>
            </div>
            <div style={styles.column}>
                <h4 style={styles.heading}>Sobre Nosotros</h4>
                <a href="/about" style={styles.link}>Nuestra Historia</a>
                <a href="/team" style={styles.link}>Equipo</a>
                <a href="/careers" style={styles.link}>Únete a Nosotros</a>
            </div>
            <div style={styles.column}>
                <h4 style={styles.heading}>Soporte</h4>
                <a href="/faq" style={styles.link}>Preguntas Frecuentes</a>
                <a href="/contact" style={styles.link}>Contacto</a>
                <a href="/terms" style={styles.link}>Términos y Condiciones</a>
                <a href="/privacy" style={styles.link}>Política de Privacidad</a>
            </div>
            <div style={styles.subscribeSection}>
                <h4 style={styles.heading}>Suscríbete</h4>
                <div>
                    <input
                        type="email"
                        placeholder="Ingresa tu correo"
                        style={styles.subscribeInput}
                    />
                    <button style={styles.subscribeButton}>Suscribirse</button>
                </div>
                <div style={styles.socialIcons}>
                    <i className="fab fa-facebook" style={styles.socialIcon}></i>
                    <i className="fab fa-instagram" style={styles.socialIcon}></i>
                    <i className="fab fa-twitter" style={styles.socialIcon}></i>
                    <i className="fab fa-linkedin" style={styles.socialIcon}></i>
                </div>
            </div>
            <div style={styles.footerBottom}>
                © 2025 HIDALGO. Todos los derechos reservados.
            </div>
        </footer>
    );
};

export default Footer;
