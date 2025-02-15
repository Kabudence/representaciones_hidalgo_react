
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home/Home.jsx";
import Employees from "./pages/Employees";
import Providers from "./pages/Providers.jsx";
import Clientes from "./pages/Clientes.jsx";
import Ventas from "./pages/Ventas.jsx";
import Products from "./pages/Products.jsx";
import Lines from "./pages/Lines.jsx";
import Compras from "./pages/Compras.jsx";
import Clases from "./pages/Clases.jsx";
import { useContext } from "react";
import { AuthContext, AuthProvider } from "./components/auth-components/AuthContext.jsx";
import PropTypes from "prop-types";
import NoAutorizado from "./pages/NoAutorizado.jsx";

const ProtectedRoute = ({ children }) => {
    const { authData, isAuthDataLoaded } = useContext(AuthContext);

    // Logs para depuración de ProtectedRoute

    if (!isAuthDataLoaded) {
        return <div>Cargando autenticación...</div>; // Puedes mostrar un spinner aquí si lo prefieres
    }

    if (!authData || !authData.token) {
        console.log("[ProtectedRoute] No autenticado. Redirigiendo a Home...");
        return <Navigate to="/" replace />;
    }

    return children;
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
                    <Navbar />
                    <div style={{ flex: 1 }}>
                        <Routes>
                            {/* Ruta pública */}
                            <Route path="/" element={<Home />} />

                            <Route
                                path="/no-autorizado"
                                element={
                                    <ProtectedRoute>
                                        <NoAutorizado />
                                    </ProtectedRoute>
                                }
                            />
                            {/* Rutas protegidas */}
                            <Route
                                path="/clientes"
                                element={
                                    <ProtectedRoute>
                                        <Clientes />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/proveedores"
                                element={
                                    <ProtectedRoute>
                                        <Providers/>
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/ventas"
                                element={
                                    <ProtectedRoute>
                                        <Ventas />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/lineas"
                                element={
                                    <ProtectedRoute>
                                        <Lines />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/compras"
                                element={
                                    <ProtectedRoute>
                                        <Compras />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/productos"
                                element={
                                    <ProtectedRoute>
                                        <Products />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/empleados"
                                element={
                                    <ProtectedRoute>
                                        <Employees />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/clases"
                                element={
                                    <ProtectedRoute>
                                        <Clases />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </div>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired, // 'children' debe ser un nodo React (componente hijo)
};

export default App;