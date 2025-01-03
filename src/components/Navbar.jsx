import { FaUser } from 'react-icons/fa'; // Importar ícono de usuario

const Navbar = () => {
    const styles = {
        navbar: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 20px',
            backgroundColor: '#fff', // Fondo blanco
            color: 'black', // Texto negro
            paddingRight: '50px'
        },

        logo: {
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '24px',
            fontWeight: 'bold',
            letterSpacing: '2px',
            color: 'black',
        },
        links: {
            listStyle: 'none',
            display: 'flex',
            gap: '20px',
            margin: 0,
            padding: 0,
        },
        linkItem: {
            textDecoration: 'none',
            color: 'black', // Texto negro para enlaces
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '18px',
            transition: 'color 0.3s ease',
        },
        linkHover: {
            color: '#f0a500',
        },
        userIcon: {
            fontSize: '20px',
            cursor: 'pointer',
            color: 'black',
            transition: 'color 0.3s ease',
        },

    };


    return (
        <>
            <nav style={styles.navbar}>
                <div style={styles.logo}>ICM</div>
                <ul style={styles.links}>
                    <li><a href="/" style={styles.linkItem}>Home</a></li>
                    <li><a href="/clientes" style={styles.linkItem}>Clientes</a></li>
                    <li><a href="/proveedores" style={styles.linkItem}>Proveedores</a></li>
                    <li><a href="/ventas" style={styles.linkItem}>Ventas</a></li>
                    <li><a href="/compras" style={styles.linkItem}>Compras</a></li>
                    <li><a href="/productos" style={styles.linkItem}>Productos</a></li>
                    <li><a href="/empleados" style={styles.linkItem}>Empleados</a></li>
                    <li><a href="/lineas" style={styles.linkItem}>Lineas</a></li>
                </ul>
                <div style={styles.userIcon}>
                    <FaUser />
                </div>
            </nav>
            <div className="navbar-separator"></div> {/* Línea de separación */}
        </>
    );
};

export default Navbar;
