import { HashRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Productos from "./pages/Productos";
import DetalleProducto from "./pages/DetalleProducto";
import Carrito from "./pages/Carrito";
import Registro from "./pages/Registro";
import InicioSesion from "./pages/InicioSesion";

import AdminProductos from "./pages/AdminProductos";
import AdminPedidos from "./pages/AdminPedidos";

import MisPedidos from "./pages/MisPedidos";


function App() {
  return (
    <HashRouter>
      <Routes>

        <Route path="/" element={<Layout />}>

          <Route index element={<Home />} />

          <Route path="productos" element={<Productos />} />

          <Route path="producto/:id" element={<DetalleProducto />} />

          {/* Rutas protegidas para clientes */}
        <Route element={<ProtectedRoute rolRequerido="cliente" />}>
        <Route path="carrito" element={<Carrito />} />
        <Route path="mis-pedidos" element={<MisPedidos />} />
        </Route>

            {/* Autenticación */}
          <Route path="registro" element={<Registro />} />

            {/* Inicio de sesión */}
          <Route path="login" element={<InicioSesion />} />

          {/* Rutas protegidas */}
          <Route element={<ProtectedRoute rolRequerido="admin" />}>
          <Route path="admin" element={<AdminProductos />} />

          <Route path="admin/pedidos" element={<AdminPedidos />} />
        </Route>

        </Route>

      </Routes>
    </HashRouter>
  );
}

export default App;