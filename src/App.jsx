import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // Importa el Footer
import Home from './pages/Home/Home.jsx';
import Employees from './pages/Employees';
import Providers from "./pages/Providers.jsx";
import Clientes from "./pages/Clientes.jsx";
import Ventas from "./pages/Ventas.jsx";
import Products from "./pages/Products.jsx";
import Lines from "./pages/Lines.jsx";

const App = () => {
    return (
        <Router>
            <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
                <Navbar />
                <div style={{ flex: 1 }}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/clientes" element={<Clientes/>} />
                        <Route path="/proveedores" element={<Providers/>} />
                        <Route path="/ventas" element={<Ventas/>} />
                        <Route path="/lineas" element={<Lines/>} />
                        <Route path="/compras" element={<div>Compras Page</div>} />
                        <Route path="/productos" element={<Products/>} />
                        <Route path="/empleados" element={<Employees />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
};

export default App;
