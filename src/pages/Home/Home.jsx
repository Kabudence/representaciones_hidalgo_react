import backgroundHome from "../../assets/images/background_home.jpg";

const Home = () => {
    return (
        <div style={styles.container}>
            <div style={styles.textContainer}>
                <h2 style={styles.subHeading}>HIDALGO BUSINESS</h2>
                <h1 style={styles.heading}>Una solución eficaz para su empresa</h1>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start', // Alinear el texto desde la izquierda
        padding: '0 5%', // Padding para los lados
        height: '100vh',
        backgroundImage: `url(${backgroundHome})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        fontFamily: "'PT Sans Narrow', sans-serif", // Aplicación global

    },
    textContainer: {
        maxWidth: '100%', // Asegura que no haya límite de ancho
        color: 'white',
    },
    heading: {
        fontSize: '4rem',
        fontWeight: 'bold',
        margin: 0,
        whiteSpace: 'nowrap', // Evita que el texto se divida en múltiples líneas
        overflow: 'hidden', // Opcional para manejar texto más largo
        textOverflow: 'ellipsis', // Opcional para añadir "..." si el texto es demasiado largo
    },
    subHeading: {
        fontSize: '1.5rem',
        fontWeight: '300',
        marginBottom: '0px',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap', // Aplica la misma regla aquí si es necesario
    },
};

export default Home;
