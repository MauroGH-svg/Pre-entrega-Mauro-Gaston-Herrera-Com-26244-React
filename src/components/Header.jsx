
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContextValue";

function Header() {

  // Recuperamos los datos y funciones de autenticación.
  const { usuario, cerrarSesion, cargando } = useContext(AuthContext);

  // Función para cerrar la sesión.
  const handleCerrarSesion = async () => {
    try {
      await cerrarSesion();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <header className="header">

      <div className="header-contenido">

        {/* IDENTIDAD DE FIESTABOX */}
        <div className="header-marca">

          <h1 className="logo">FiestaBox</h1>

          <p className="header-eslogan">
            Todo para hacer tu fiesta un momento especial.
          </p>

        </div>


        {/* OPCIONES DE AUTENTICACIÓN */}
        {!cargando && (

          <div className="acciones-usuario">

            {usuario ? (

              <>

                {/* INFORMACIÓN DEL USUARIO */}
                <div className="usuario-info">

                  <span className="usuario-saludo">
                    Bienvenido
                  </span>

                  <span className="usuario-email">
                    {usuario.email}
                  </span>

                </div>


                {/* CERRAR SESIÓN */}
                <button
                  type="button"
                  className="boton-cerrar-sesion"
                  onClick={handleCerrarSesion}
                >
                  Cerrar sesión
                </button>

              </>

            ) : (

              <>

                <Link to="/login" className="enlace-header">
                  Iniciar sesión
                </Link>

                <Link to="/registro" className="enlace-header enlace-registro">
                  Registrarse
                </Link>

              </>

            )}

          </div>

        )}

      </div>

    </header>
  );
}

export default Header;
