
import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContextValue";

// Funciones de autenticación de Firebase.
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  deleteUser
} from "firebase/auth";

// Funciones para consultar y guardar datos en Firestore.
import { doc, getDoc, setDoc } from "firebase/firestore";

// Importamos los servicios de Firebase.
import { auth, db } from "../firebase/config";

// Creamos el contexto global.

export function AuthProvider({ children }) {

  // Datos del usuario autenticado.
  const [usuario, setUsuario] = useState(null);

  // Rol del usuario: admin o cliente.
  const [rol, setRol] = useState(null);

  // Controlamos la carga inicial de la sesión y el perfil.
  const [cargando, setCargando] = useState(true);

  // Registramos un nuevo usuario y creamos su perfil como cliente.
  const registrarUsuario = async (email, password) => {
    const credencial = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    try {
      await setDoc(doc(db, "usuarios", credencial.user.uid), {
        email: credencial.user.email,
        rol: "cliente"
      });

      return credencial;

    } catch (error) {
      // Si falla la creación del perfil, intentamos cancelar la cuenta recién creada.
      try {
        await deleteUser(credencial.user);
      } catch (errorEliminacion) {
        console.error("No se pudo eliminar la cuenta incompleta:", errorEliminacion);
      }

      throw error;
    }
  };

  // Iniciamos sesión con un usuario existente.
  const iniciarSesion = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Cerramos la sesión.
  const cerrarSesion = () => {
    return signOut(auth);
  };

  // Detectamos cambios en la autenticación y consultamos el rol.
  useEffect(() => {

    let consultaActual = 0;

    const cancelarSuscripcion = onAuthStateChanged(
      auth,
      async (usuarioActual) => {

        const numeroConsulta = ++consultaActual;

        setUsuario(usuarioActual);
        setRol(null);
        setCargando(true);

        // Si no hay sesión activa, terminamos la carga.
        if (!usuarioActual) {
          setCargando(false);
          return;
        }

        try {
          // Buscamos el perfil del usuario en Firestore.
          const referencia = doc(db, "usuarios", usuarioActual.uid);
          const documento = await getDoc(referencia);

          if (numeroConsulta !== consultaActual) return;

          if (documento.exists()) {
            // Guardamos el rol encontrado.
            setRol(documento.data().rol);
          } else {
            setRol(null);
            console.warn("El usuario no tiene un perfil registrado en Firestore.");
          }

        } catch (error) {
          console.error("Error al consultar el perfil:", error);
          setRol(null);

        } finally {
          if (numeroConsulta === consultaActual) {
            setCargando(false);
          }
        }
      }
    );

    // Cancelamos la suscripción al desmontar el contexto.
    return () => {
      consultaActual++;
      cancelarSuscripcion();
    };

  }, []);

  // Compartimos la información con los componentes hijos.
  return (
    <AuthContext.Provider
      value={{
        usuario,
        rol,
        cargando,
        registrarUsuario,
        iniciarSesion,
        cerrarSesion
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
