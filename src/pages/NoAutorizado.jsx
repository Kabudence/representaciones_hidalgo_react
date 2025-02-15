import { Link } from "react-router-dom";

const NoAutorizado = () => {
    return (
        <div style={{ textAlign: "center", padding: "50px" }}>
            <h1 style={{ color: "red" }}>Acceso Denegado</h1>
            <p>No tienes permiso para acceder a esta página.</p>
            <Link to="/">Volver al Inicio</Link>
        </div>
    );
};

export default NoAutorizado;
