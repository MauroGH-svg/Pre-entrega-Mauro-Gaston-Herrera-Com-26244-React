
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContextValue";

function ProtectedRoute({ rolRequerido }) {

  // Recuperamos el usuario, su rol y el estado de carga.
  const { usuario, rol, cargando } = useContext(AuthContext);

  // Esperamos a que Firebase compruebe la sesión y el perfil.
  if (cargando) {
    return <p>Verificando sesión...</p>;
  }

  // Si no hay usuario autenticado, redirigimos al login.
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  // Comprobamos si el usuario tiene el rol requerido.
  if (rolRequerido && rol !== rolRequerido) {
    return <Navigate to="/" replace />;
  }

  // Si cumple las condiciones, permitimos el acceso.
  return <Outlet />;
}

export default ProtectedRoute;
