
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContextValue";

function Registro() {

  // Recuperamos la función de registro.
  const { registrarUsuario } = useContext(AuthContext);

  // Estados de los campos.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Estado para mostrar mensajes personalizados.
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Procesamos el envío del formulario.
  const handleSubmit = async (e) => {

    e.preventDefault();
    setError("");

    // Validamos el correo.
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

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {

      // Creamos la cuenta utilizando Firebase.
      await registrarUsuario(emailLimpio, password);

      navigate("/");

    } catch (error) {

      // Capturamos posibles errores de Firebase.
      switch (error.code) {

        case "auth/email-already-in-use":
          setError("Este correo electrónico ya está registrado.");
          break;

        case "auth/invalid-email":
          setError("El correo electrónico no es válido.");
          break;

        case "auth/weak-password":
          setError("La contraseña debe tener al menos 6 caracteres.");
          break;

        default:
          setError("No se pudo crear la cuenta. Intentá nuevamente.");
      }
    }
  };

  return (
    <div className="registro">

      <h2>Crear una cuenta</h2>

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
            placeholder="Mínimo 6 caracteres"
            minLength={6}
            required
          />
        </div>

        {error && (
          <p role="alert">{error}</p>
        )}

        <button type="submit">
          Registrarme
        </button>

      </form>

      <p>
        ¿Ya tenés una cuenta? <Link to="/login">Iniciá sesión</Link>
      </p>

    </div>
  );
}

export default Registro;
