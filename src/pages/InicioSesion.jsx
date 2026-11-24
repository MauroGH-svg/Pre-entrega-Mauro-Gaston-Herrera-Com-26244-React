
import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContextValue";

function InicioSesion() {

  // Recuperamos las funciones y datos de autenticación.
  const { iniciarSesion, usuario, rol, cargando } = useContext(AuthContext);

  // Estados para controlar los campos.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Estados para mostrar errores y controlar el ingreso.
  const [error, setError] = useState("");
  const [ingresoPendiente, setIngresoPendiente] = useState(false);

  const navigate = useNavigate();

  // Detectamos si la cuenta no tiene un rol válido.
  const errorPerfil =
  ingresoPendiente &&
  !cargando &&
  usuario &&
  rol !== "admin" &&
  rol !== "cliente"
    ? "Tu cuenta no tiene un perfil válido. Contactá al administrador."
    : "";

// Unificamos los mensajes de error.
const mensajeError = error || errorPerfil;

// Controlamos el estado del botón.
const verificandoAcceso = ingresoPendiente && !errorPerfil;


  
// Redirigimos según el rol recuperado de Firestore.
useEffect(() => {

  if (!ingresoPendiente || cargando || !usuario) {
    return;
  }

  if (rol === "admin") {

    navigate("/admin", { replace: true });

  } else if (rol === "cliente") {

    navigate("/", { replace: true });

  }

}, [ingresoPendiente, cargando, usuario, rol, navigate]);


  // Procesamos el envío del formulario.
  const handleSubmit = async (e) => {

    e.preventDefault();
    setError("");

    // Validamos el correo electrónico.
    const emailLimpio = email.trim();

    if (!emailLimpio) {
      setError("Ingresá tu correo electrónico.");
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpio);

    if (!emailValido) {
      setError("Ingresá una dirección de correo válida.");
      return;
    }

    // Validamos la contraseña.
    if (!password) {
      setError("Ingresá tu contraseña.");
      return;
    }

    // Comenzamos el proceso de autenticación.
    setIngresoPendiente(true);

    try {

      // Iniciamos sesión utilizando Firebase.
      await iniciarSesion(emailLimpio, password);

    } catch (error) {

      setIngresoPendiente(false);

      // Capturamos los posibles errores de Firebase.
      switch (error.code) {

        case "auth/invalid-credential":
          setError("El correo o la contraseña son incorrectos.");
          break;

        case "auth/invalid-email":
          setError("El correo electrónico no es válido.");
          break;

        case "auth/too-many-requests":
          setError("Demasiados intentos. Esperá un momento e intentá nuevamente.");
          break;

        default:
          setError("No se pudo iniciar sesión. Intentá nuevamente.");
      }

    }
  };


  return (
    <div className="inicio-sesion">

      <h2>Iniciar sesión</h2>

      <form onSubmit={handleSubmit} noValidate>

        <div>
          <label htmlFor="email">Correo electrónico</label>

          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingresá tu correo electrónico"
            required
          />
        </div>

        <div>
          <label htmlFor="password">Contraseña</label>

          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingresá tu contraseña"
            required
          />
        </div>

        {/* Mensaje de error personalizado. */}
        {mensajeError && (
          <p role="alert">{mensajeError}</p>
        )}

        <button
          type="submit"
          disabled={verificandoAcceso}
          >
           {verificandoAcceso ? "Verificando acceso..." : "Ingresar"}
        </button>

      </form>

      <p>
        ¿Todavía no tenés cuenta? <Link to="/registro">Registrate</Link>
      </p>

    </div>
  );
}

export default InicioSesion;
