
import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";

function CargarProductos() {
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const cargarCatalogo = async () => {
    setCargando(true);
    setMensaje("");

    try {
      const respuesta = await fetch("/productos.json");

      if (!respuesta.ok) {
        throw new Error("No se pudo leer el archivo productos.json");
      }

      const productos = await respuesta.json();

      await Promise.all(
        productos.map((producto) =>
          setDoc(
            doc(db, "productos", String(producto.id)),
            producto
          )
        )
      );

      setMensaje(
        `Se cargaron correctamente ${productos.length} productos.`
      );
    } catch (error) {
      console.error("Error al cargar los productos:", error);
      setMensaje("No se pudieron cargar los productos. Revisá la consola.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <section>
      <h2>Cargar catálogo en Firestore</h2>

      <p>
        Esta acción importará los productos de productos.json
        a la colección productos.
      </p>

      <button onClick={cargarCatalogo} disabled={cargando}>
        {cargando ? "Cargando productos..." : "Cargar los 8 productos"}
      </button>

      {mensaje && <p>{mensaje}</p>}
    </section>
  );
}

export default CargarProductos;
